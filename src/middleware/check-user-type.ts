import { RequestHandler } from "express";

import { ForbiddenError } from "../error";
import { WebMartUserType } from "../constants";

export const checkUserType =
  (...userTypes: WebMartUserType[]): RequestHandler =>
  (req, _, next): void => {
    const { user = null } = req;

    if (!user) {
      console.error(
        `Unable to find user while checking API: [${req.originalUrl}]`
      );
      return next(new ForbiddenError(`Unable to find user`, "MISSING_USER"));
    }

    if (!userTypes.some((type) => user.userType.includes(type))) {
      console.error(`User does not have access to API : [${req.originalUrl}]`);
      return next(new ForbiddenError(`User does not have access`));
    }

    // TODO: for the later implimentation.
    // if (!userTypes.includes(user.userType as any)) {}

    return next();
  };
