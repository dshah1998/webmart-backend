import { Router } from "express";
import { validate } from "express-validation";

import { authenticate, handleError } from "../middleware";
import {
  getAll,
  getAllUsersValidation,
  changePassword,
  changePasswordValidation,
  forgetPassword,
  forgetPasswordValidation,
  profile,
  updatePassword,
  updatePasswordValidation,
  verifyEmailValidation,
  verifyEmail,
  becomeSeller,
  becomeSellerValidation,
} from "../controller/users";

const router = Router();

const getAllUsers = (): Router =>
  router.get(
    "/all",
    validate(getAllUsersValidation),
    handleError(getAll())
  );

const patchChangePassword = (): Router =>
  router.patch(
    "/change-password",
    authenticate,
    validate(changePasswordValidation),
    handleError(changePassword())
  );

const postForgetPassword = (): Router =>
  router.post(
    "/forget-password",
    validate(forgetPasswordValidation, { context: true }),
    handleError(forgetPassword())
  );

const postUpdatePassword = (): Router =>
  router.post(
    "/update-password",
    validate(updatePasswordValidation, { context: true }),
    handleError(updatePassword())
  );

const postVerifyEmail = (): Router =>
  router.post(
    "/verify-email",
    validate(verifyEmailValidation, { context: true }),
    handleError(verifyEmail())
  );

const getProfile = (): Router =>
  router.get("/profile/me", authenticate, handleError(profile()));

const postBecomeSeller = (): Router =>
  router.post(
    "/become-seller",
    validate(becomeSellerValidation, { context: true }),
    authenticate,
    handleError(becomeSeller())
  );

export default (): Router =>
  router.use([
    getProfile(),
    getAllUsers(),
    postVerifyEmail(),
    postForgetPassword(),
    postUpdatePassword(),
    patchChangePassword(),
    postBecomeSeller(),
  ]);
