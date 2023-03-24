import { Router } from 'express';
import { validate } from 'express-validation';

import { handleError, authenticate, checkUserType } from '../middleware';
import {
  createProductValidation,
  createProduct,
  getProductsValidation,
  getAll,
  deleteProductValidation,
  removeProduct,
  getProductByIdValidation,
  getProductById,
} from '../controller/products';

import { WebMartUserType } from '../constants';

const router = Router();

const getProducts = (): Router =>
  router.get(
    '/',
    authenticate,
    validate(getProductsValidation, { context: true }),
    handleError(getAll()),
  );

const postCreateProduct = (): Router =>
  router.post(
    '/',
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(createProductValidation, { context: true }),
    handleError(createProduct()),
  );

const deleteUpdateProduct = (): Router =>
  router.delete(
    '/:id',
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(deleteProductValidation, { context: true }),
    handleError(removeProduct()),
  );

const getByIdProduct = (): Router =>
  router.get(
    '/:id',
    authenticate,
    validate(getProductByIdValidation, { context: true }),
    handleError(getProductById()),
  );

export default (): Router =>
  router.use([
    getProducts(),
    getByIdProduct(),
    postCreateProduct(),
    deleteUpdateProduct(),
  ]);
