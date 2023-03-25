import { Router } from 'express';
import { validate } from 'express-validation';

import { handleError, authenticate,checkUserType } from '../middleware';
import {
  createBrandValidation,
  createBrand,
  getBrandsValidation,
  getAll,
  updateBrandValidation,
  updateBrand,
  deleteBrandValidation,
  removeBrand
} from '../controller/brand';

import { WebMartUserType } from '../constants';

const router = Router();

const getAllBrands = (): Router =>
  router.get(
    '/',
    authenticate,
    validate(getBrandsValidation, { context: true }),
    handleError(getAll()),
  );

const postCreateBrand = (): Router =>
  router.post(
    '/',
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(createBrandValidation, { context: true }),
    handleError(createBrand()),
  );

const putupdateBrand = (): Router =>
  router.put(
    '/:id',
    authenticate,
    validate(updateBrandValidation, { context: true }),
    handleError(updateBrand()),
  );

const deleteBrand = (): Router =>
  router.delete(
    '/:id',
    authenticate,
    validate(deleteBrandValidation),
    handleError(removeBrand()),
  );

export default (): Router =>
  router.use([getAllBrands(), postCreateBrand(), putupdateBrand(), deleteBrand()]);
