import { getManager, getRepository, getCustomRepository, FindConditions, Like, Not } from 'typeorm';
import { Request, Response } from 'express';
import { Joi } from 'express-validation';

import { BadRequestError } from '../error';
import { CategoryRepository } from '../repository/Category';

import { Category } from '../model/Category';

const namePattern = '^[A-za-z]';
export const getCategoriesValidation = {
  query: Joi.object({
    type: Joi.string().max(255).regex(new RegExp(namePattern)).default(null),
  }),
};
/**
 * Title: List category API;
 * Created By: Sarang Patel;
 */
export const getAll = () => async (req: Request, res: Response): Promise<void> => {
  const {
    query: { type },
  } = req;
  const categoriesRepository = getCustomRepository(CategoryRepository);

  let where: FindConditions<Category> = {};

  if (type && type !== '') {
    where = { ...where, type: Like(`%${type}%`) };
  }
  const [categories, count] = await categoriesRepository.findAndCount({
    where,
  });

  res.status(200).json({ count, categories });
};

export const createCategoryValidation = {
  body: Joi.object({
    type: Joi.string().max(255).regex(new RegExp(namePattern)).required(),
    properties: Joi.array().items(Joi.string().allow(null)).allow(null).default(null),
  }),
};
/**
 * Title: Create category API;
 * Created By: Sarang Patel;
 */
export const createCategory = () => async (req: Request, res: Response): Promise<void> => {
  const {
    user,
    body: { type, properties },
  } = req;

  const categoriesRepository = getRepository(Category);
  const existingCategory = await categoriesRepository.findOne({ where: { type } });

  if (existingCategory) {
    throw new BadRequestError('Category is already added', 'CATEGORY_ALREADY_EXIST');
  }

  let category = categoriesRepository.create({
    type,
    properties
  });

  category = await categoriesRepository.save(category);

  res.status(201).json(category);
};

export const updateCategoryValidation = {
  body: Joi.object({
    type: Joi.string().max(255).regex(new RegExp(namePattern)).required(),
    properties: Joi.array().items(Joi.string().allow(null)).allow(null).default(null),
  }),
};
/**
 * Title: Update category API;
 * Created By: Sarang Patel;
 */
export const updateCategory = () => async (req: Request, res: Response): Promise<void> => {
  const {
    user,
    body: { type, properties },
    params: { id },
  } = req;

  const categoriesRepository = getCustomRepository(CategoryRepository);

  const uniqCategory = await categoriesRepository.findOne({
    where: { id: Not(id), type, properties },
  });
  if (uniqCategory) {
    throw new BadRequestError(
      `Category with type: ${type} is already added`,
      'CATEGORY_ALREADY_EXIST',
    );
  }
  await categoriesRepository.update(id, {
    type,
    properties
  });

  res.sendStatus(204);
};

export const deleteCategoryValidation = {
  params: Joi.object({ id: Joi.number().required() }),
};
/**
 * Title: Delete category API;
 * Created By: Sarang Patel;
 */
export const removeCategory = () => async (req: Request, res: Response): Promise<void> => {
  const {
    params: { id },
  } = req;

  await getManager().transaction(async (em) => {
      await em.delete(Category, id);
  });

  res.sendStatus(204);
};
