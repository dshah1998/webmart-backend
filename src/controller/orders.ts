// import {
//   getManager,
//   getRepository,
//   FindConditions,
//   In,
//   Brackets,
//   getCustomRepository,
// } from "typeorm";
// import { Request, Response } from "express";
// import { Joi } from "express-validation";
// import { sumBy } from "lodash";

// import { MailService } from "../service/Mail";
// import StripeOrderPaymentService from "../service/StripeOrderPayment";

// import { BadRequestError, NotFoundError } from "../error";

// //   import { Cart } from '../model/Cart';
// import { Users } from "../model/Users";
// import { Orders } from "../model/Orders";
// import { OrderDetails } from "../model/OrderDetails";
// import { Address } from "../model/Address";

// import { WebMartUserType } from "../constants";

// import { OrderDetailsRepository } from "../repository/OrdersDetail";
// import { OrdersRepository } from "../repository/Orders";
// import config from "../config";

// export const createOrderValidation = {
//   body: Joi.object({
//     stripeCardId: Joi.string().required(),
//     addressId: Joi.number().integer().min(1).optional(),
//   }),
// };
// export const createOrder =
//   () =>
//   async (req: Request, res: Response): Promise<void> => {
//     const {
//       user,
//       body: { stripeCardId, addressId },
//     } = req;

//     const ordersRepo = getRepository(Orders);
//     const userAddressRepo = getRepository(Address);
//     const orderDetailsRepo = getRepository(OrderDetails);

//     const cartService = new GetCart();
//     const data = await cartService.execute({
//       userId: user?.id,
//       isOrder: true,
//     });

//     let { orderDetails } = data;

//     if (!(orderDetails && orderDetails.length)) {
//       throw new BadRequestError("Cart is empty", "EMPTY_CART");
//     }

//     const grandTotal = sumBy(orderDetails, "grandTotal");
//     const cartIds = (orderDetails || []).map((detail) => detail.id);

//     let where: FindConditions<UserAddresses> = {};

//     if (addressId) where = { ...where, id: addressId };
//     else where = { ...where, isDefault: true, user };

//     const address = await userAddressRepo.findOne({ where });
//     if (!address)
//       throw new NotFoundError(
//         "Default address not found",
//         "DEFAULT_ADDRESS_NOT_FOUND"
//       );

//     res.status(201).json({});
//   };
