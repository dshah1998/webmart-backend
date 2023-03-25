import { getManager, getRepository, getCustomRepository, FindConditions, Like, Not } from 'typeorm';
import { Request, Response } from 'express';
import { Joi } from 'express-validation';

import { BadRequestError } from '../error';
import { BrandRepository } from '../repository/Brand';

import { Brand } from '../model/Brand';

const namePattern = '^[A-za-z]';
export const getBrandsValidation = {
  query: Joi.object({
    name: Joi.string().max(255).regex(new RegExp(namePattern)).default(null),
  }),
};
export const getAll = () => async (req: Request, res: Response): Promise<void> => {
  const {
    query: { name },
  } = req;
  const brandsRepository = getCustomRepository(BrandRepository);

  let where: FindConditions<Brand> = {};

  if (name && name !== '') {
    where = { ...where, name: Like(`%${name}%`) };
  }
  const [brands, count] = await brandsRepository.findAndCount({
    where,
  });

  res.status(200).json({ count, brands });
};

export const createBrandValidation = {
  body: Joi.object({
    name: Joi.string().max(255).regex(new RegExp(namePattern)).required(),
    threshold: Joi.number().min(0).required(),
  }),
};
export const createBrand = () => async (req: Request, res: Response): Promise<void> => {
  const {
    user,
    body: { name, threshold },
  } = req;

  const brandRepository = getRepository(Brand);
  const existingBrand = await brandRepository.findOne({ where: { name } });

  if (existingBrand) {
    throw new BadRequestError('Brand is already added', 'Brand_ALREADY_EXIST');
  }

  let brand = brandRepository.create({
    name,
    threshold
  });

  brand = await brandRepository.save(brand);

  res.status(201).json(brand);
};

export const updateBrandValidation = {
  body: Joi.object({
    type: Joi.string().max(255).regex(new RegExp(namePattern)).required(),
    properties: Joi.array().items(Joi.string().allow(null)).allow(null).default(null),
  }),
};
export const updateBrand = () => async (req: Request, res: Response): Promise<void> => {
  const {
    user,
    body: { name, threshold },
    params: { id },
  } = req;

  const brandsRepository = getCustomRepository(BrandRepository);

  const uniqBrand = await brandsRepository.findOne({
    where: { id: Not(id), name },
  });
  if (uniqBrand) {
    throw new BadRequestError(
      `Brand with name: ${name} is already added`,
      'BRAND_ALREADY_EXIST',
    );
  }
  await brandsRepository.update(id, {
    name,
    threshold
  });

  res.sendStatus(204);
};

export const deleteBrandValidation = {
  params: Joi.object({ id: Joi.number().required() }),
};
export const removeBrand = () => async (req: Request, res: Response): Promise<void> => {
  const {
    params: { id },
  } = req;

  await getManager().transaction(async (em) => {
      await em.delete(Brand, id);
  });

  res.sendStatus(204);
};
