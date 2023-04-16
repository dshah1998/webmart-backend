import { getRepository, getManager, Brackets } from "typeorm";
import { Request, Response } from "express";
import { Joi } from "express-validation";
import { sumBy, omit } from "lodash";

import { MailService } from "../service/Mail";
import StripeOrderPaymentService from "../service/StripeOrderPayment";
import GetCartService from "../service/GetCart";

import { BadRequestError, NotFoundError } from "../error";

import { Orders } from "../model/Orders";
import { Users } from "../model/Users";
import { Carts } from "../model/Cart";
import { OrderDetails } from "../model/OrderDetails";
import { Address } from "../model/Address";
import { orderSuccess } from "../database/seed/htmlTemplates/register";

import config from "../config";

export const getAllOrderValidation = {
  query: Joi.object({
    productId: Joi.string().allow(null).optional().default(null),
    search: Joi.string().max(50).default(null).optional(),
  }),
};
export const getAll =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      query: { search },
    } = req;

    const query = getManager()
      .createQueryBuilder(Orders, "order")
      .leftJoin("order.orderDetails", "orderDetails")
      .addSelect([
        "orderDetails.id",
        "orderDetails.quantity",
        "orderDetails.price",
        "orderDetails.discount",
        "orderDetails.subTotal",
        "orderDetails.grandTotal",
      ])
      .leftJoin("orderDetails.product", "product")
      .addSelect([
        "product.id",
        "product.thumbnailImage",
        "product.name",
        "product.images",
      ])
      .leftJoinAndSelect("order.user", "user");

    if (search && search !== null) {
      query.andWhere(
        new Brackets((qb) => {
          return qb
            .orWhere("product.name like :name", { name: "%" + search + "%" })
            .orWhere("user.firstName like :name", {
              name: "%" + search + "%",
            })
            .orWhere("user.lastName like :name", {
              name: "%" + search + "%",
            })
            .orWhere("user.email like :name", {
              name: "%" + search + "%",
            });
        })
      );
    }
    if (!user?.userType?.includes("admin")) {
      query.where("user.id = :userId", { userId: user?.id });
    }

    const [orders, count] = await query.getManyAndCount();
    res.status(200).json({ orders, count });
  };

export const getOrderByIdValidation = {
  params: Joi.object({
    id: Joi.string().uuid({ version: "uuidv4" }).required(),
  }),
};
export const getById =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      params: { id },
    } = req;

    const query = getManager()
      .createQueryBuilder(Orders, "order")
      .where("order.id = :id", { id })
      .leftJoin("order.orderDetails", "orderDetails")
      .addSelect([
        "orderDetails.id",
        "orderDetails.quantity",
        "orderDetails.price",
        "orderDetails.discount",
        "orderDetails.subTotal",
        "orderDetails.grandTotal",
      ])
      .leftJoin("orderDetails.product", "product")
      .addSelect([
        "product.id",
        "product.thumbnailImage",
        "product.name",
        "product.images",
      ])
      .leftJoinAndSelect("order.user", "user");

    const [orders, count] = await query.getManyAndCount();
    res.status(200).json({ orders, count });
  };

export const createOrderValidation = {
  body: Joi.object({
    stripeCardId: Joi.string().required(),
    addressId: Joi.string().required(),
  }),
};
/**
 * Title: Order API;
 * Created By: Sarang Patel;
 */
export const createOrder =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: { stripeCardId, addressId },
    } = req;

    const ordersRepo = getRepository(Orders);
    const userRepo = getRepository(Users);
    const userAddressRepo = getRepository(Address);
    const orderDetailsRepo = getRepository(OrderDetails);
    const cartRepo = getRepository(Carts);

    // let where: FindConditions<Address> = {};
    // if (addressId) where = { ...where, id: addressId };
    // const address = await userAddressRepo.findOne({ where });
    // if (!address)
    //   throw new NotFoundError(
    //     "Default address not found",
    //     "DEFAULT_ADDRESS_NOT_FOUND"
    //   );

    const cartService = new GetCartService();
    const data = await cartService.execute({
      userId: user?.id,
    });

    let { orderDetails } = data;
    if (!(orderDetails && orderDetails.length)) {
      throw new BadRequestError("Cart is empty", "EMPTY_CART");
    }

    const grandTotal = sumBy(orderDetails, "grandTotal");
    const subTotal = sumBy(orderDetails, "subTotal");
    const qty = sumBy(orderDetails, "qty");
    const totalSalesTax = sumBy(orderDetails, "salseTaxAmount");
    const cartIds = (orderDetails || []).map((detail) => detail.id);
    const orderDetailIds = (orderDetails || []).map(
      (detail) => detail?.id || ""
    );

    let order = ordersRepo.create({
      user,
      subTotal,
      grandTotal,
      createdAt: new Date(),
    });
    order = await ordersRepo.save(order);

    // TODO: manage relations
    try {
      orderDetails = orderDetails?.map((details) =>
        omit(Object.assign({}, { ...details, order }), ["id"])
      );

      orderDetails = await orderDetailsRepo.save(orderDetails);

      order = Object.assign({}, order, {
        grandTotal,
        subTotal,
      });
      order = await ordersRepo.save(order);
    } catch (error) {
      await ordersRepo.delete(order?.id);
      throw new BadRequestError(
        "Order details creation error",
        "ORDERDETAILS_CREATE_FAILED"
      );
    }

    // payment integration of order
    try {
      const service = new StripeOrderPaymentService();
      const payment = await service.execute({
        stripeCardId,
        confirm: true,
        isOrder: true,
        orderDetailIds,
        currency: "usd",
        userId: user?.id,
        email: user?.email,
        orderId: order?.id,
        amount: Math.ceil(data.grandTotal ? data.grandTotal : 0),
        stripeCustomerId: user?.stripeCustomerId,
      });
      await ordersRepo.save(
        Object.assign({}, order, {
          stripePaymentIntentId: payment?.PaymentIntent?.id || "",
        })
      );
    } catch (error) {
      await orderDetailsRepo.delete(orderDetailIds);
      await ordersRepo.delete(order?.id);
      throw new BadRequestError("Error in payment");
    }

    try {
      const mailService = new MailService();
      const mailBody = {
        to: `${user?.email}, ${config.ADMIN_CONTACT_EMAIL}`,
        email: user?.email,
        orderId: order?.id.toString(),
        total: data?.grandTotal.toString(),
        subject: "Webmart - Order Placed",
        html: (orderSuccess || "")
          .replace(
            new RegExp("{name}", "g"),
            `${user?.firstName} ${user?.lastName}` || ""
          )
          .replace(new RegExp("{status}", "g"), "created")
          .replace(
            new RegExp("{orderId}", "g"),
            `${order?.id.toString() || "AwedrteosffsdFSW"}`
          )
          .replace(new RegExp("{qty}", "g"), (qty || 0).toString())
          .replace(
            new RegExp("{salesTax}", "g"),
            (totalSalesTax || 0).toString()
          )
          .replace(new RegExp("{subTotal}", "g"), (subTotal || 0).toString())
          .replace(
            new RegExp("{grandTotal}", "g"),
            (grandTotal || 0).toString()
          )
          .replace(new RegExp("{admin}", "g"), "sarangp3010@gmail.com"),
      };
      mailService.send(mailBody);
    } catch (error) {
      console.error("Error in sending the mail");
    }

    await cartRepo.delete(cartIds);

    const tokens = grandTotal / 10;
    const updatedUser = Object.assign({}, user, {
      totalCredits: (user?.totalCredits || 0) + tokens,
    });
    await userRepo.save(updatedUser);

    res.status(201).json({ order, orderDetails });
  };
