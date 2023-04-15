import { getRepository, getCustomRepository, getManager } from "typeorm";
import { Request, Response } from "express";
import { Joi } from "express-validation";

import ForgetPasswordService from "../service/ForgetPasswordService";
import UpdatePasswordService from "../service/UpdatePasswordService";
import { hashPassword, comparePassword } from "../service/password";
import { BadRequestError, UnauthorizedError } from "../error";
import { UsersRepository } from "../repository/Users";

import { Users } from "../model/Users";
import { WebMartUserType } from "../constants";
import { SellerInformationRepository } from "../repository/SellerInformation";
import { SellerInformation } from "../model/SellerInformation";
import { MailService } from "../service/Mail";
import { sellerMessage } from "../database/seed/htmlTemplates/register";

export const changePasswordValidation = {
  body: Joi.object({
    oldPassword: Joi.string().min(6).max(128).required(),
    newPassword: Joi.string().min(6).max(128).required(),
  }),
};
export const changePassword =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: { oldPassword, newPassword },
    } = req;

    const usersRepo = getRepository(Users);
    let relations: string[] = [];

    const userWithPassword = await usersRepo.findOneOrFail(user.id, {
      select: ["id", "password", "isActive"],
      relations,
    });

    if (userWithPassword.isActive === false) {
      throw new UnauthorizedError("User is deactivated", "USER_DEACTIVATED");
    }

    const result = await comparePassword(
      oldPassword,
      userWithPassword.password
    );

    if (!result) {
      throw new BadRequestError("Pasword is incorrect", "PASSWORD_INCORRECT");
    }

    user.password = await hashPassword(newPassword);
    await usersRepo.save(user);

    res.status(200).json({ message: "Password successfully updated" });
  };

export const forgetPasswordValidation = {
  body: Joi.object({
    userType: Joi.array()
      .valid(...Object.values(WebMartUserType))
      .required(),
    email: Joi.string().lowercase().max(255).email().optional(),
  }),
};
export const forgetPassword =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const service = new ForgetPasswordService();
    const result = await service.execute(req.body);

    res.json(result);
  };

export const profile =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user: { id },
    } = req;

    let userInfo = await getCustomRepository(UsersRepository).findOne({
      where: { id },
    });
    console.log("UserInfo", userInfo);

    userInfo = Object.assign({}, userInfo, { password: undefined });
    res.json(userInfo);
  };

export const updatePasswordValidation = {
  body: Joi.object({
    token: Joi.string().optional(),
    newPassword: Joi.string().min(6).max(128).required(),
    userType: Joi.array()
      .valid(...Object.values(WebMartUserType))
      .default(null)
      .required(),
  }),
};
export const updatePassword =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const service = new UpdatePasswordService();
    const result = await service.execute(req.body);

    res.json(result);
  };

export const verifyEmailValidation = {
  body: Joi.object({
    token: Joi.string().required(),
  }),
};
export const verifyEmail =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      body: { token },
    } = req;

    const userRepository = getCustomRepository(UsersRepository);
    const verificationDetails = await userRepository.findOne({
      where: { token: token },
    });

    if (!verificationDetails) {
      throw new BadRequestError("Token is invalid or expired", "INVALID_TOKEN");
    }

    await userRepository.update(verificationDetails.id, {
      isEmailVerify: true,
    });
    res.sendStatus(200);
  };

export const becomeSellerValidation = {
  body: Joi.object({
    companyRegistrationNumber: Joi.string().min(10).max(10).required(),
    streetAddress: Joi.string().required(),
    addressLine2: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    storeName: Joi.string().required(),
    accountName: Joi.string().required(),
    routingNumber: Joi.string().required(),
    accountNumber: Joi.string().required(),
  }),
};

export const becomeSeller =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: {
        companyRegistrationNumber,
        streetAddress,
        addressLine2,
        city,
        state,
        zip,
        storeName,
        accountName,
        routingNumber,
        accountNumber,
      },
    } = req;
    const sellerInformationRepository = getCustomRepository(
      SellerInformationRepository
    );

    let sellerInfo = sellerInformationRepository.create({
      companyRegistrationNumber,
      streetAddress,
      addressLine2,
      city,
      state,
      zip,
      storeName,
      accountName,
      routingNumber,
      accountNumber,
      user,
    });
    // let userInfo = await getCustomRepository(UsersRepository).findOne({
    //   where: { id: user.id },
    // });

    // if (userInfo) {
    sellerInfo = await sellerInformationRepository.save(sellerInfo);
    // }

    // if (sellerInfo) {
    //   userInfo.userType.push("seller");
    //   const usersRepo = getRepository(Users);
    //   const userUpdated = usersRepo.save(userInfo);
    // }

    res.status(201).json({
      companyRegistrationNumber,
      streetAddress,
      addressLine2,
      city,
      state,
      zip,
      storeName,
      accountName,
      routingNumber,
      accountNumber,
    });
  };

export const sellerPendingRequest =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    // const {
    //   user: { id },
    // } = req;
    // let userInfo = await getCustomRepository(UsersRepository).findOne({
    //   where: { id },
    // });
    // userInfo = Object.assign({}, userInfo, { password: undefined });
    // res.json(userInfo);
    console.log("Inside pending Reuqets");

    const query = getManager()
      .createQueryBuilder(SellerInformation, "seller")
      .innerJoinAndSelect("seller.user", "user")
      .where("seller.sellerStatus = false");

    const [pendingRequest, count] = await query.getManyAndCount();

    console.log("Pending Reuqest", pendingRequest);

    res.status(200).json({ pendingRequest });
  };

export const sellerRequestDecisionValidation = {
  body: Joi.object({
    message: Joi.string().optional(),
    userId: Joi.string().required(),
    sellerRequestId: Joi.string().required(),
    decision: Joi.string().required(),
  }),
};

export const sellerRequestDecision =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: { message, userId, sellerRequestId, decision },
    } = req;

    console.log("Details ", message, userId, sellerRequestId, decision);

    let userInfo = await getCustomRepository(UsersRepository).findOne({
      where: { id: userId },
    });

    // if (userInfo) {
    //   sellerInfo = await sellerInformationRepository.save(sellerInfo);
    // }

    console.log("UserInfo ----", userInfo);

    let userUpdated;
    if (decision === "accepted") {
      if (userInfo) {
        console.log("Inside userInfo");
        console.log("UserInfo", userInfo.userType);

        userInfo.userType.push("seller");
        console.log("UserInfo1", userInfo.userType);
        const usersRepo = await getRepository(Users);
        userUpdated = await usersRepo.save(userInfo);
      }

      console.log("UserUpdated ---- ", userUpdated);
      let sellerInfo;
      if (userUpdated) {
        sellerInfo = await getCustomRepository(
          SellerInformationRepository
        ).findOne({
          where: { id: sellerRequestId },
        });
        sellerInfo.sellerStatus = true;
        const sellerRepo = await getRepository(SellerInformation);
        const sellerUpdated = sellerRepo.save(sellerInfo);
        console.log("Seller Info ---- ", sellerInfo);
        console.log("Seller Updated ---- ", sellerUpdated);
        console.log("Inside accepted");
        const systemMessage =
          "Congratulations!! Your request to become seller is accepted";

        console.log("Before mail");

        await sendMail(userUpdated, systemMessage);
      }
      res.status(201).json(sellerInfo);
    } else {
      await getManager().transaction(async (em) => {
        await em.delete(SellerInformation, sellerRequestId);
      });
      const systemMessage =
        "Unfortunately!! Your request to become seller is rejected due to " +
        message;
      await sendMail(userInfo, systemMessage);
      res.sendStatus(204);
    }
  };

const sendMail = async (user: Users, message: string) => {
  const mailService = new MailService();
  const mailBody = {
    to: user.email,
    subject: "Become Seller Status | WebMart",
    html: (sellerMessage || "")
      .replace(
        new RegExp("{name}", "g"),
        `${user?.firstName} ${user?.lastName}` || ""
      )
      .replace(new RegExp("{message}", "g"), message || ""),
  };
  await mailService.send(mailBody);
};
