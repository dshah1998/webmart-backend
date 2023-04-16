import { getRepository, getManager, getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { Joi } from "express-validation";

import { BadRequestError } from "../error";

import { ProductsRepository } from "../repository/Product";
import { InventoryRepository } from "../repository/Inventory";
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
/**
 * Title: List Products API;
 * Created By: Sarang Patel;
 */
export const getAll =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      query: { search, categoryId },
    } = req;

    const query = getManager()
      .createQueryBuilder(Products, "product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.brand", "brand");

    if (search && search !== "") {
      query.andWhere("product.name like :name", { name: "%" + search + "%" });
    }
    if (categoryId && categoryId !== "") {
      query.andWhere("category.id = :categoryId", { categoryId });
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
    isUsed: Joi.boolean().optional().default(false),
    completedStep: Joi.number().required(),
  }),
};
/**
 * Title: Create Products API;
 * Created By: Sarang Patel;
 */
export const createProduct =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: { name, description, thumbnailImage, isUsed, completedStep },
    } = req;

    const productRepo = getRepository(Products);
    const inventoryRepo = getRepository(Inventory);
    const existingProduct = await productRepo.findOne({
      where: { name, description },
    });

    if (existingProduct) {
      throw new BadRequestError(
        "product Already Exist",
        "PRODUCT_ALREADY_EXIST"
      );
    }

    let newProduct = productRepo.create({
      name,
      isUsed,
      description,
      thumbnailImage,
      completedStep,
    });

    newProduct = await productRepo.save(newProduct);

    /*
     * Created Entry into the Inventory if a new product added.
     */
    let newInventory = inventoryRepo.create({
      product: newProduct,
      quantity: 0,
      user,
    });

    newInventory = await inventoryRepo.save(newInventory);

    res.status(201).json(newProduct);
  };

export const getProductByIdValidation = {
  params: Joi.object({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};
/**
 * Title: Get By Id Products API;
 * Created By: Sarang Patel;
 */
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
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.inventory", "inventory");

    const product = await query.getOne();
    if (!product) {
      throw new BadRequestError("Product not found", "PRODUCT_NOT_FOUND");
    }
    res.status(200).json(product);
  };

export const updateProductValidation = {
  body: Joi.object({
    name: Joi.string().max(255).regex(new RegExp(namePattern)).optional(),
    description: Joi.string().optional().default(null),
    thumbnailImage: Joi.string().optional().default(null),
    isUsed: Joi.boolean().optional().default(null),
    categoryId: Joi.string().optional().default(null),
    price: Joi.number().optional().default(null),
    quantity: Joi.number().optional().default(null),
    discount: Joi.number().optional().default(null),
    images: Joi.array()
      .items(Joi.string().optional())
      .default(null)
      .optional()
      .default(null),
    brandId: Joi.string().optional().default(null),
    completedStep: Joi.number().required(),
    properties: Joi.object().default(null).optional(),
  }),
  params: Joi.object({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};
/**
 * Title: Update Products API;
 * Created By: Sarang Patel;
 */
export const updateProduct =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: {
        name,
        description,
        thumbnailImage,
        isUsed,
        categoryId,
        quantity,
        price,
        discount,
        images,
        brandId,
        completedStep,
        properties,
      },
      params: { id },
    } = req;

    const productsRepository = getCustomRepository(ProductsRepository);
    const inventoryRepository = getCustomRepository(InventoryRepository);

    const product = await productsRepository.findOneOrFail({
      where: { id },
      relations: ["inventory", "brand", "category"],
    });

    const { inventory } = product;

    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productUpdate: any = product;
    const inventoryUpdate: any = {};

    if (name) productUpdate.name = name;
    if (description) productUpdate.description = description;
    if (thumbnailImage) productUpdate.thumbnailImage = thumbnailImage;
    if (completedStep) product.completedStep = completedStep;
    if (properties) product.properties = { ...properties };
    if (price) product.price = price;
    if (discount) product.discount = discount;
    if (images) product.images = images;

    if (brandId)
      product.brand =
        brandId &&
        (await getManager().getRepository(Brand).findOneOrFail(brandId));
    if (categoryId)
      product.category =
        categoryId &&
        (await getManager().getRepository(Category).findOneOrFail(categoryId));

    if (quantity) inventoryUpdate.quantity = quantity;

    await productsRepository.save({
      id: product?.id,
      ...productUpdate,
      isUsed: isUsed || product?.isUsed,
      completedStep:
        completedStep >= product?.completedStep
          ? completedStep
          : product?.completedStep,
    });

    if (inventory && inventory?.id) {
      await inventoryRepository.save({
        id: inventory?.id,
        ...inventoryUpdate,
        user,
      });
    }

    res.sendStatus(204);
  };

export const deleteProductValidation = {
  params: Joi.object({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};
/**
 * Title: Delete Products API;
 * Created By: Sarang Patel;
 */
export const removeProduct =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      params: { id },
    } = req;

    const productRepo = getRepository(Products);
    const product = await productRepo.findOne(id);

    if (!product) {
      throw new BadRequestError(
        "Product is already deleted",
        "PRODUCT_ALREADY_DELETED"
      );
    }

    try {
      await productRepo.delete(id);
    } catch (error) {
      throw new BadRequestError(
        "Something went wrong in deletation of the Product",
        "PRODUCT_ERROR_DELETE"
      );
    }
    res.sendStatus(204);
  };
