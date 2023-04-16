import { getManager } from "typeorm";
import { Request, Response } from "express";

import { Category } from "../model/Category";
import { Brand } from "../model/Brand";
import { Users } from "../model/Users";
import { Products } from "../model/Products";
import { Orders } from "../model/Orders";

export const getAdminDashboard =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const categoryCount = await getManager()
      .createQueryBuilder(Category, "category")
      .getCount();

    const brandsCount = await getManager()
      .createQueryBuilder(Brand, "brand")
      .getCount();

    const userCount = await getManager()
      .createQueryBuilder(Users, "user")
      .where("user.userType @> :userType", { userType: ["user"] })
      .getCount();

    const sellerCount = await getManager()
      .createQueryBuilder(Users, "user")
      .where("user.userType @> :userType", { userType: ["seller"] })
      .getCount();

    const productsCount = await getManager()
      .createQueryBuilder(Products, "product")
      .getCount();

      const ordersCount = await getManager()
      .createQueryBuilder(Orders, "order")
      .getCount();

    res
      .status(200)
      .json({
        categoryCount,
        brandsCount,
        userCount,
        sellerCount,
        productsCount,
        ordersCount,
      });
  };