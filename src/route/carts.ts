import { Router } from 'express';
import { validate } from 'express-validation';

import { handleError, authenticate, checkUserType } from '../middleware';
import {
  createCartValidation,
  createCart,
  getCartValidation,
  getAll,
  deleteCartValidation,
  removeCart,
} from '../controller/carts';

import { WebMartUserType } from '../constants';

const router = Router();

const getCarts = (): Router => 
  router.get(
    '/',
    // authenticate,
    validate(getCartValidation, { context: true }),
    handleError(getAll()),
  );

const postCreateCart = (): Router =>
  router.post(
    '/',
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(createCartValidation, { context: true }),
    handleError(createCart()),
  );

const deleteUpdateCart = (): Router =>
  router.delete(
    '/:id',
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(deleteCartValidation, { context: true }),
    handleError(removeCart()),
  );

export default (): Router =>
  router.use([
    getCarts(),
    postCreateCart(),
    deleteUpdateCart(),
  ]);
