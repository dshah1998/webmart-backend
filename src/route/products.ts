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
  updateProductValidation,
  updateProduct
} from '../controller/products';

import { WebMartUserType } from '../constants';

const router = Router();

const getProducts = (): Router =>
  router.get(
    '/',
    // authenticate,
    validate(getProductsValidation, { context: true }),
    handleError(getAll()),
  );

const postCreateProduct = (): Router =>
  router.post(
    '/',
    authenticate,
    checkUserType(WebMartUserType.ADMIN, WebMartUserType.SELLER, WebMartUserType.USER),
    validate(createProductValidation, { context: true }),
    handleError(createProduct()),
  );

const putupdateProduct = (): Router =>
  router.put(
    '/:id',
    authenticate,
    checkUserType(WebMartUserType.ADMIN, WebMartUserType.SELLER, WebMartUserType.USER),
    validate(updateProductValidation, { context: true }),
    handleError(updateProduct()),
  );

const deleteProduct = (): Router =>
  router.delete(
    '/:id',
    authenticate,
    checkUserType(WebMartUserType.ADMIN, WebMartUserType.SELLER, WebMartUserType.USER),
    validate(deleteProductValidation, { context: true }),
    handleError(removeProduct()),
  );

const getByIdProduct = (): Router =>
  router.get(
    '/:id',
    // authenticate,
    validate(getProductByIdValidation, { context: true }),
    handleError(getProductById()),
  );

export default (): Router =>
  router.use([
    getProducts(),
    deleteProduct(),
    getByIdProduct(),
    putupdateProduct(),
    postCreateProduct(),
  ]);
