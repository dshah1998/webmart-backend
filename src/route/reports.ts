import { Router } from "express";
import { validate } from "express-validation";

import { handleError, authenticate, checkUserType } from "../middleware";
import { WebMartUserType } from "../constants";
import {
  customersReport,
  getCustomerReportValidation,
  productReport,
  getProductReportValidation,
  getOrdersReportValidation,
  ordersReport,
} from "../controller/reports";

const router = Router();
const customerReports = (): Router =>
  router.get(
    "/customers",
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(getCustomerReportValidation, { context: true }),
    handleError(customersReport())
  );

const productReports = (): Router =>
  router.get(
    "/product",
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(getProductReportValidation, { context: true }),
    handleError(productReport())
  );

const ordersReports = (): Router =>
  router.get(
    "/orders",
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(getOrdersReportValidation, { context: true }),
    handleError(ordersReport())
  );

export default (): Router =>
  router.use([ordersReports(), productReports(), customerReports()]);
