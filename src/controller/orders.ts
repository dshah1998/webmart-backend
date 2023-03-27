import { getRepository, FindConditions } from "typeorm";
import { Request, Response } from "express";
import { Joi } from "express-validation";
import { sumBy, omit } from "lodash";

import { MailService } from "../service/Mail";
import StripeOrderPaymentService from "../service/StripeOrderPayment";
import GetCartService from "../service/GetCart";

import { BadRequestError, NotFoundError } from "../error";

import { Orders } from "../model/Orders";
import { Users } from "../model/Users";
import { OrderDetails } from "../model/OrderDetails";
import { Address } from "../model/Address";
import { orderSuccess } from "../database/seed/htmlTemplates/register";

import config from "../config";

export const createOrderValidation = {
  body: Joi.object({
    stripeCardId: Joi.string().required(),
    addressId: Joi.string().required(),
  }),
};
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
      orderDetails = orderDetails.map((details) =>
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
        amount: 1 || Math.ceil(data.grandTotal ? data.grandTotal : 0),
        stripeCustomerId: user?.stripeCustomerId,
      });
      await ordersRepo.save(Object.assign({}, order, { stripePaymentIntentId: payment?.PaymentIntent?.id || '' }))
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
          .replace(new RegExp("{name}", "g"), `${user?.firstName} ${user?.lastName}` || "")
          .replace(
            new RegExp("{status}", "g"),
            "created"
          ).replace(
            new RegExp("{orderId}", "g"),
            `${order?.id.toString() || 'AwedrteosffsdFSW'}`
          ).replace(
            new RegExp("{qty}", "g"),
            (qty || 0).toString()
          ).replace(
            new RegExp("{salesTax}", "g"),
            (totalSalesTax || 0).toString()
          ).replace(
            new RegExp("{subTotal}", "g"),
            (subTotal || 0).toString()
          ).replace(
            new RegExp("{grandTotal}", "g"),
            (grandTotal || 0).toString()
          ).replace(
            new RegExp("{admin}", "g"),
            "sarangp3010@gmail.com"
          ),
        };
        mailService.send(mailBody);
      } catch (error) {
        console.error('Error in sending the mail');
      }

      const tokens = grandTotal / 10;
      const updatedUser = Object.assign({}, user, { totalCredits: (user?.totalCredits || 0) + tokens });
      await userRepo.save(updatedUser);

    res.status(201).json({order, orderDetails});
  };
