import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Joi } from "express-validation";

import { hashPassword, comparePassword } from "../service/password";
import { BadRequestError, UnauthorizedError } from "../error";

import { Users } from "../model/Users";

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
