import {
  getManager,
  getRepository,
  getCustomRepository,
  FindConditions,
  Like,
  Not,
} from "typeorm";
import { Request, Response } from "express";
import { Joi } from "express-validation";

import { BadRequestError } from "../error";
import { ModificationRequestsRepository } from "../repository/ModificationRequests";

import { Products } from "../model/Products";
import { ModificationRequests } from "../model/ModificationRequests";

export const getAll =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      query: { isAdmin },
    } = req;
    const query = getManager()
      .createQueryBuilder(ModificationRequests, "requests")
      .leftJoinAndSelect("requests.user", "user")
      .leftJoinAndSelect("requests.product", "product");

    if (isAdmin === "false") {
      query.where("user.id = :userId", { userId: user?.id });
    }

    const [notifications, count] = await query.getManyAndCount();
    res.status(200).json({ count, notifications });
  };

export const createNotificationValidation = {
  body: Joi.object({
    comments: Joi.string().max(255).required(),
    productId: Joi.string().uuid({ version: "uuidv4" }).required(),
    status: Joi.string().default("pending"),
  }),
};
export const createNotification =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: { comments, productId, status },
    } = req;

    const requestRepository = getRepository(ModificationRequests);
    const existingrequest = await requestRepository.findOne({
      where: { comments, status },
    });

    if (existingrequest) {
      throw new BadRequestError(
        "Request is already added",
        "Request_ALREADY_EXIST"
      );
    }

    let newRequest = requestRepository.create({
      product:
        productId &&
        (await getManager().getRepository(Products).findOneOrFail(productId)),
      user,
      comments,
      status,
    });

    newRequest = await requestRepository.save(newRequest);

    res.status(201).json(newRequest);
  };

export const updateRequestValidation = {
  body: Joi.object({
    status: Joi.string().default("pending").required(),
  }),
};
export const updateRequest =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      body: { status },
      params: { id },
    } = req;

    const notificationRepository = getCustomRepository(
      ModificationRequestsRepository
    );
    await notificationRepository.update(id, {
      status,
    });

    res.sendStatus(204);
  };

export const deleteremoveRequestValidation = {
  params: Joi.object({ id: Joi.number().required() }),
};
export const removeRequest =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      params: { id },
    } = req;

    await getManager().transaction(async (em) => {
      await em.delete(ModificationRequestsRepository, id);
    });

    res.sendStatus(204);
  };
