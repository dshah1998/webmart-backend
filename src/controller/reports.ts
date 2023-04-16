import { Request, Response } from "express";
import { Joi } from "express-validation";
import { Brackets, getManager } from "typeorm";

import { OrderDetails } from "../model/OrderDetails";
import { Products } from "../model/Products";
import { Users } from "../model/Users";
import { WebMartUserType } from "../constants";

export const getCustomerReportValidation = {
  query: Joi.object({
    search: Joi.string().max(50).default(""),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).default(10),
  }),
};
export const customersReport =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      query: { search, page, perPage },
    } = req;

    const limit = Number(perPage);
    const offset = (Number(page) - 1) * limit;
    const query = getManager()
      .createQueryBuilder(Users, "user")
      .select([
        "user.id",
        "user.email",
        "user.firstName",
        "user.lastName",
        "user.userType",
        "user.isActive",
      ])
      .leftJoin("user.orders", "orders")
      .addSelect([
        'sum(orders.grandTotal ) "TotalAmountPaid"',
        'count(orders.user ) "TotalOrders"',
      ])
      .where("user.userType @> :userType", { userType: [WebMartUserType.USER] })
      .groupBy("user.id")
      .offset(offset)
      .limit(limit);

    if (search && search !== "") {
      query.andWhere(
        new Brackets((qb) => {
          return qb
            .orWhere("user.firstName like :fullName", {
              fullName: "%" + search + "%",
            })
            .orWhere("user.lastName like :fullName", {
              fullName: "%" + search + "%",
            });
        })
      );
    }

    const customers = await query.getRawMany();
    const count = await query.getCount();

    res.status(200).json({ customers, count });
  };

export const getProductReportValidation = {
  query: Joi.object({
    search: Joi.string().max(50).default(""),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).default(10),
  }),
};
export const productReport =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      query: { search, page, perPage  },
    } = req;

    const limit = Number(perPage);
    const offset = (Number(page) - 1) * limit;
    const query = getManager()
      .createQueryBuilder(Products, "products")
      .leftJoin("products.orderDetails", "orderdetails")
      .addSelect([
        'count(orderdetails.id ) "TotalOrder"',
        'sum(orderdetails.subTotal) "TotalSales"',
      ])
      .leftJoin("products.brand", "brand")
      .leftJoin("products.category", "category")
      .addSelect(["brand.name", "category.type"])
      .groupBy("products.id")
      .addGroupBy("brand.name")
      .addGroupBy("category.type")
      .addGroupBy("orderdetails.product")
      .offset(offset)
      .limit(limit);

    if (search && search !== "") {
      query.andWhere(
        new Brackets((qb) => {
          return qb
            .orWhere("products.name like :name", { name: "%" + search + "%" })
            .orWhere("brand.name like :name", { name: "%" + search + "%" })
            .orWhere("category.type like :name", { name: "%" + search + "%" });
        })
      );
    }

    let productReports = await query.getRawMany();
    const count = productReports.length;
    productReports = await query.getRawMany();

    res.status(200).json({ productReports, count });
  };

export const getOrdersReportValidation = {
  query: Joi.object({
    search: Joi.string().max(50).default(""),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).default(10),
  }),
};
export const ordersReport =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      query: { search, startDate, endDate, page, perPage  },
    } = req;

    const limit = Number(perPage);
    const offset = (Number(page) - 1) * limit;
    const query = getManager()
      .createQueryBuilder(OrderDetails, "orderDetails")
      .select([
        "orderDetails.id",
        "orderDetails.quantity",
        "orderDetails.price",
        "orderDetails.discount",
        "orderDetails.subTotal",
        "orderDetails.grandTotal",
      ])
      .leftJoin("orderDetails.order", "order")
      .addSelect(["order.id", "order.createdAt"])
      .leftJoin("order.user", "user")
      .leftJoin("order.address", "address")
      .addSelect(["user.email", "user.firstName", "user.lastName", "user.id"])
      .leftJoin("orderDetails.product", "product")
      .addSelect(["product.id", "product.name"])
      .offset(offset)
      .limit(limit);

    if (startDate && endDate) {
      query.andWhere("order.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      });
    }
    if (search && search !== null) {
      query.andWhere(
        new Brackets((qb) => {
          return qb
            .orWhere("user.firstName like :name", {
              name: "%" + search + "%",
            })
            .orWhere("user.lastName like :name", {
              name: "%" + search + "%",
            });
        })
      );
    }

    const ordersReports = await query.getRawMany();
    const count = await query.getCount();
    res.status(200).json({ ordersReports, count });
  };
