import { getRepository } from "typeorm";

import { hashPassword } from "./password";
import { Token } from "../constants";

import { Users } from "../model/Users";

import { BadRequestError, UnauthorizedError } from "../error";
import {
  ITokenBase,
  verifyToken,
  isForgetPasswordToken,
} from "../service/token";

interface Request {
  token?: string;
  newPassword: string;
  otp?: string;
  userType?: string;
}

interface Response {
  message: string;
}

class UpdatePasswordService {
  private static instance: UpdatePasswordService;

  constructor() {
    if (UpdatePasswordService.instance instanceof UpdatePasswordService) {
      return UpdatePasswordService.instance;
    }
    UpdatePasswordService.instance = this;
  }

  public async execute(request: Request): Promise<Response> {
    const { token, newPassword: password } = request;

    const userRepository = getRepository(Users);
    let user;
    let decoded: ITokenBase;

    try {
      decoded = await verifyToken(token || "", Token.FORGETPASSWORD);
      if (!isForgetPasswordToken(decoded)) {
        throw new BadRequestError(
          "Provided token is not valid token",
          "INVALID_TOKEN"
        );
      }
      // TODO: remove any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.name === "TokenExpiredError") {
        throw new UnauthorizedError("Token is expired.", "TOKEN_EXPIRED");
      }
      throw new BadRequestError(
        "Provided token is not valid token",
        "INVALID_TOKEN"
      );
    }

    user = await userRepository.findOne({
      where: {
        id: decoded.sub,
      },
    });

    if (!user) {
      console.error(`user does not exist with this token : [${token}]`);
      throw new BadRequestError("User does not exist", "USER_DOES_NOT_EXIST");
    }

    user.password = await hashPassword(password);
    await userRepository.save(user);

    const response: Response = {
      message: "Password updated successfully",
    };

    return response;
  }
}

export default UpdatePasswordService;
