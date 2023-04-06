import { Router } from "express";
import { validate } from "express-validation";

import { handleError, authenticate } from "../middleware";
import {
  createUsersCardValidation,
  createUsersCard,
} from "../controller/userCards";

const router = Router();

const postCreateCard = (): Router =>
  router.post(
    "/",
    authenticate,
    validate(createUsersCardValidation, { context: true }),
    handleError(createUsersCard())
  );

export default (): Router => router.use([postCreateCard()]);
