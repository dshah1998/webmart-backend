import { Request, Response } from 'express';
import { Joi } from 'express-validation';

import StripeCardsService from '../service/StripeCards';

import { Actions } from '../constants';

export const createUsersCardValidation = {
  body: Joi.object({
    cardNumber: Joi.string().max(25).required(),
    expMonth: Joi.string().max(5).required(),
    expYear: Joi.string().max(5).required(),
    cvc: Joi.string().max(5).required(),
    name: Joi.string().max(50).required(),
    isDefault: Joi.boolean().optional().default(true),
  }),
};
/**
 * Title: Create Stripe Card API;
 * Created By: Sarang Patel;
 */
export const createUsersCard = () => async (req: Request, res: Response): Promise<void> => {
  const {
    user,
    body: { cardNumber, expMonth, expYear, cvc, name },
  } = req;

  const service = new StripeCardsService();
  const result = await service.execute({
    cvc,
    name,
    expYear,
    expMonth,
    cardNumber,
    userId: user?.id,
    action: Actions.CREATE,
    stripeCustomerId: user?.stripeCustomerId || '',
  });

  res.status(200).json(result);
};
