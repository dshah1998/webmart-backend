import { getRepository, getManager, Not, In } from "typeorm";
import { Request, Response } from "express";
import { Joi } from "express-validation";

import { BadRequestError } from "../error";

import { Brand } from "../model/Brand";
import { Products } from "../model/Products";
import { Category } from "../model/Category";
import { Inventory } from "../model/Inventory";

export const getProductsValidation = {
  query: Joi.object({
    search: Joi.string().min(1).optional().optional(),
    categoryId: Joi.number().integer().optional(),
  }),
};
export const getAll = () => async (req: Request, res: Response): Promise<void> => {
  const {
    query: { search, categoryId },
  } = req;

  const query = getManager()
    .createQueryBuilder(Products, 'product')
    .leftJoinAndSelect('product.category', 'category');

  if (search && search !== '') {
    query.andWhere('product.name like :name', { name: '%' + search + '%' });
  }
  if (categoryId && categoryId !== '') {
    query.andWhere('category.id = :categoryId', { categoryId });
  }

  const [products, count] = await query.getManyAndCount();

  res.status(200).json({ count, products });
};

const namePattern = "^[A-za-z]";
export const createProductValidation = {
  body: Joi.object({
    name: Joi.string().max(255).regex(new RegExp(namePattern)).required(),
    description: Joi.string().required(),
    thumbnailImage: Joi.string().optional(),
    price: Joi.number().optional(),
    discount: Joi.number().optional(),
    isUsed: Joi.boolean().optional().default(false),
    images: Joi.array().items(Joi.string().optional()).default(null).optional(),
    brandId: Joi.string().optional(),
    categoryId: Joi.string().optional(),
  }),
};
export const createProduct =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: {
        name,
        description,
        thumbnailImage,
        price,
        discount,
        isUsed,
        images,
        brandId,
        categoryId,
      },
    } = req;

    const productRepo = getRepository(Products);
    const inventoryRepo = getRepository(Inventory);

    const existingProduct = await productRepo.findOne({
      where: { name, description, price, categoryId, brandId },
    });
    if (existingProduct) {
      throw new BadRequestError(
        "product Already Exist",
        "PRODUCT_ALREADY_EXIST"
      );
    }

    let newProduct = productRepo.create({
      name,
      price,
      isUsed,
      images,
      discount,
      description,
      thumbnailImage,
      brand: brandId && (await getManager().getRepository(Brand).findOneOrFail(brandId)),
      category: categoryId && (await getManager().getRepository(Category).findOneOrFail(categoryId)),
    });

    newProduct = await productRepo.save(newProduct);

    /*
    * Created Entry into the Inventory if a new product added.
    */
    let newInventory = inventoryRepo.create({
      product: newProduct,
    });

    newInventory = await inventoryRepo.save(newInventory);
    res.status(201).json(newProduct);
  };

export const getProductByIdValidation = {
  params: Joi.object({ id: Joi.string().uuid({ version: 'uuidv4' }).required() }),
};
export const getProductById =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      params: { id },
    } = req;

    const query = getManager()
      .createQueryBuilder(Products, "product")
      .where("product.id = :id", { id })
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.category", "category");

    const product = await query.getOne();
    if (!product) {
      throw new BadRequestError('Product not found', 'PRODUCT_NOT_FOUND');
    }
    res.status(200).json(product);
  };

export const deleteProductValidation = {
  params: Joi.object({ id: Joi.string().uuid({ version: 'uuidv4' }).required() }),
};
export const removeProduct =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      params: { id },
    } = req;

    const productRepo = getRepository(Products);
    const product = await productRepo.findOne(id);

    if (!product) {
      throw new BadRequestError('Product is already deleted', "PRODUCT_ALREADY_DELETED");
    }

    try {
      await productRepo.delete(id);
    } catch (error) {
      console.error("Error in deletation of the product");
      throw new BadRequestError('Something went wrong in deletation of the Product', "PRODUCT_ERROR_DELETE");
    }
    res.sendStatus(204);
  };
