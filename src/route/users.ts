import { Router } from "express";
import { validate } from "express-validation";

import { authenticate, handleError } from "../middleware";
import {
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
  sellerPendingRequest,
  sellerRequestDecisionValidation,
  sellerRequestDecision,
  updateBecomeSeller,
} from "../controller/users";

const router = Router();

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

const postBecomeSeller = (): Router => {
  console.log("Inside2-------");

  return router.post(
    "/become-seller",
    validate(becomeSellerValidation, { context: true }),
    authenticate,
    handleError(becomeSeller())
  );
};

const putBecomeSeller = (): Router =>
  router.put("/become-seller", authenticate, handleError(updateBecomeSeller()));

const getAllSellerPendingRequest = (): Router => {
  return router.get(
    "/pendingSellerRequest",
    handleError(sellerPendingRequest())
  );
};

const postSellerRequestDecision = (): Router => {
  return router.post(
    "/sellerRequestDecision",
    validate(sellerRequestDecisionValidation, { context: true }),
    authenticate,
    handleError(sellerRequestDecision())
  );
};

export default (): Router =>
  router.use([
    getProfile(),
    postVerifyEmail(),
    postForgetPassword(),
    postUpdatePassword(),
    patchChangePassword(),
    postBecomeSeller(),
    getAllSellerPendingRequest(),
    postSellerRequestDecision(),
    putBecomeSeller(),
  ]);
