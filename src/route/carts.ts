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
  updateCartById,
  updateCartByIdValidation,
  getCartById,
  getCartByIdValidation
} from '../controller/carts';

import { WebMartUserType } from '../constants';

const router = Router();

const getCarts = (): Router => 
  router.get(
    '/',
    authenticate,
    validate(getCartValidation, { context: true }),
    handleError(getAll()),
  );

const postCreateCart = (): Router =>
  router.post(
    '/',
    authenticate,
    checkUserType(WebMartUserType.ADMIN, WebMartUserType.USER),
    validate(createCartValidation, { context: true }),
    handleError(createCart()),
  );

const getCartUsingId = (): Router =>
router.get(
  '/:id',
  authenticate,
  validate(getCartByIdValidation, { context: true }),
  handleError(getCartById()),
);

const deleteUpdateCart = (): Router =>
  router.delete(
    '/:id',
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(deleteCartValidation, { context: true }),
    handleError(removeCart()),
  );

  const updateCarts = (): Router =>
  router.put(
    '/:id',
    authenticate,
    validate(updateCartByIdValidation, { context: true }),
    handleError(updateCartById()),
  );

export default (): Router =>
  router.use([
    getCarts(),
    postCreateCart(),
    getCartUsingId(),
    deleteUpdateCart(),
    updateCarts(),
  ]);
