import { Router } from "express";
import { validate } from "express-validation";

import { authenticate, handleError, checkUserType } from "../middleware";
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
  deleteUserValidation,
  removeUser
} from "../controller/users";
import { WebMartUserType } from '../constants';

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

  const deleteUser = (): Router =>
  router.delete(
    '/:id',
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(deleteUserValidation, { context: true }),
    handleError(removeUser()),
  );

export default (): Router =>
  router.use([
    getProfile(),
    getAllUsers(),
    deleteUser(),
    postVerifyEmail(),
    postForgetPassword(),
    postUpdatePassword(),
    patchChangePassword(),
    postBecomeSeller(),
  ]);
