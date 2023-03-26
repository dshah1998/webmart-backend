import { getRepository, getManager, Not, In } from "typeorm";
import { Request, Response } from "express";
import { Joi } from "express-validation";

import { BadRequestError } from "../error";

import { Brand } from "../model/Brand";
import { Products } from "../model/Products";
import { Carts } from "../model/Cart";
import { Category } from "../model/Category";
import { Inventory } from "../model/Inventory";

export const getCartValidation = {
  query: Joi.object({
  }),
};

export const getAll = () => async (req: Request, res: Response): Promise<void> => {
  // console.log(req, "---carts request");
  const {
    user: {id},
  } = req;
  // console.log("Called!!!");
  // console.log("user---", id);

  const query = getManager()
    .createQueryBuilder(Carts, 'cart')
    .leftJoinAndSelect('cart.user', 'user')
    .leftJoinAndSelect('cart.product', 'product')
    .where('user.id = :id', { id });

  console.log("-----------------");
  console.log("This funciton is called");
  console.log("-----------------");

  const [carts, count] = await query.getManyAndCount();

  res.status(200).json({ count, carts });
};

const namePattern = "^[A-za-z]";
export const createCartValidation = {
  body: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
  }),
};

export const createCart =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: {
        productId,
        quantity,
      },
    } = req;

    const cartRepo = getRepository(Carts);

    let newCart = cartRepo.create({
      product: productId && (await getManager().getRepository(Products).findOneOrFail(productId)),
      quantity,
      user
    });

    newCart = await cartRepo.save(newCart);

    /*
    * Created Entry into the Inventory if a new product added.
    */
    res.status(201).json(newCart);
  };

export const updateCartByIdValidation = {
    query: Joi.object({
        cartsID: Joi.string().uuid({ version: 'uuidv4' }).required(),
        quantity : Joi.number().required(),
      }),
};

export const updateCartById =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
        user: { id },
        query: { cartId,  quantity},
    } = req;

    // const query = getManager()
    //   .createQueryBuilder(Carts, "carts")
    //   .where("carts.id = :id", { id })
    //   .leftJoinAndSelect("product.brand", "brand")
    //   .leftJoinAndSelect("product.category", "category");


    const cartRepo = getRepository(Carts);

    const query = getManager()
    .createQueryBuilder(Carts, 'cart')
    .leftJoinAndSelect('cart.user', 'user')
    .where('user.id = :id', { id })
    .andWhere('cart.id = :cartId', { cartId });

    
    const cart = await query.getOne();
    if (!cart) {
      throw new BadRequestError('Product not found', 'PRODUCT_NOT_FOUND');
    }

    cart.quantity = Number(quantity);

    await cartRepo.save(cart);
    res.status(200).json(cart);
  };

export const deleteCartValidation = {
  params: Joi.object({ id: Joi.string().required() }),
};

export const removeCart =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      params: { id },
    } = req;

    console.log("------");
    console.log(id);
    console.log("------");

    const cartRepo = getRepository(Carts);
    const product = await cartRepo.findOne(id);

    if (!product) {
      throw new BadRequestError('Product is already deleted', "PRODUCT_ALREADY_DELETED");
    }

    try {
      await cartRepo.delete(id);

    } catch (error) {
      console.error("Error in deletation of the product");
      throw new BadRequestError('Something went wrong in deletation of the Product', "PRODUCT_ERROR_DELETE");
    }
    res.sendStatus(204).json({"message": "removed from cart, success"});
  };
