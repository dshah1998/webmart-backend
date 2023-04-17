import { Router } from "express";
import { validate } from "express-validation";

import { handleError, authenticate, checkUserType } from "../middleware";
import {
  createCategoryValidation,
  createCategory,
  getCategoriesValidation,
  getAll,
  updateCategoryValidation,
  updateCategory,
  deleteCategoryValidation,
  removeCategory,
  getCategoryByIdValidation,
  getCategoryById,
} from "../controller/categories";

import { WebMartUserType } from "../constants";

const router = Router();

const getAllCategories = (): Router =>
  router.get(
    "/",
    authenticate,
    handleError(getAll())
  );

const postCreateCategory = (): Router =>
  router.post(
    "/",
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    validate(createCategoryValidation, { context: true }),
    handleError(createCategory())
  );

const putupdateCategory = (): Router =>
  router.put(
    "/:id",
    authenticate,
    validate(updateCategoryValidation, { context: true }),
    handleError(updateCategory())
  );

const getByIdCategory = (): Router =>
  router.get(
    "/:id",
    validate(getCategoryByIdValidation, { context: true }),
    handleError(getCategoryById())
  );

const deleteCcategory = (): Router =>
  router.delete(
    "/:id",
    authenticate,
    // validate(deleteCategoryValidation),
    handleError(removeCategory())
  );

export default (): Router =>
  router.use([
    getAllCategories(),
    getByIdCategory(),
    postCreateCategory(),
    putupdateCategory(),
    deleteCcategory(),
  ]);
