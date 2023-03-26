import { getRepository, getManager, getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { Joi } from "express-validation";

import { BadRequestError } from "../error";

import { Address } from "../model/Address";

export const addAddressValidation = {
  body: Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().max(255).required(),
    addressType: Joi.string().max(255).required(),
    streetAddress: Joi.string().max(255).required(),
    city: Joi.string().max(255).required(),
    county: Joi.string().max(255).optional(),
    pincode: Joi.string().max(255).required(),
    country: Joi.string().max(255).required()
  }),
};

export const addAddress =
  () =>
  async (req: Request, res: Response): Promise<void> => {
    const {
      user,
      body: {
        name,
        email,
        addressType,
        streetAddress,
        city,
        county,
        pincode,
        country
      },
    } = req;

    const addressRepository = getRepository(Address);

    let address = addressRepository.create({
      user,
      name,
      email,
      addressType,
      city,
      county,
      country,
      pincode,
      streetAddress,
    });

    address = await addressRepository.save(address);

    res.status(201).json(address);
  };
