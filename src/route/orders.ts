import { Router } from 'express';
import { validate } from 'express-validation';

import { handleError, authenticate } from '../middleware';
import { createOrder, createOrderValidation } from '../controller/orders';

const router = Router();

const postCreateOrder = (): Router =>
  router.post(
    '/',
    authenticate,
    validate(createOrderValidation, { context: true }),
    handleError(createOrder()),
  );

export default (): Router => router.use([postCreateOrder()]);