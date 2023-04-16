import { Router } from 'express';
import { validate } from 'express-validation';

import { handleError, authenticate } from '../middleware';
import { createOrder, createOrderValidation, getAll, getAllOrderValidation, getOrderByIdValidation, getById } from '../controller/orders';

const router = Router();

const getAllOrders = (): Router =>
  router.get(
    '/',
    authenticate,
    validate(getAllOrderValidation, { context: true }),
    handleError(getAll()),
  );

const getByIdOrders = (): Router =>
  router.get(
    '/:id',
    authenticate,
    validate(getOrderByIdValidation, { context: true }),
    handleError(getById()),
  );

const postCreateOrder = (): Router =>
  router.post(
    '/',
    authenticate,
    validate(createOrderValidation, { context: true }),
    handleError(createOrder()),
  );

export default (): Router => router.use([getAllOrders(), getByIdOrders(), postCreateOrder()]);