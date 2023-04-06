import Stripe from 'stripe';

import config from '../config';
import { Actions } from '../constants';
import { BadRequestError } from '../error';

const stripe = new Stripe(config.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

interface Request {
  userId?: string;
  name?: string;
  cardNumber?: string;
  expMonth?: string;
  expYear?: string;
  cvc?: string;
  action: Actions;
  limit?: number;
  stripeCustomerId?: string;
  stripeCardId?: string;
  object?: string;
}

interface Response {
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sources?: any;
  stripeCardId?: string;
}

class StripeCardsService {
  private static instance: StripeCardsService;

  constructor() {
    if (StripeCardsService.instance instanceof StripeCardsService) {
      return StripeCardsService.instance;
    }
    StripeCardsService.instance = this;
  }

  public async execute(request: Request): Promise<Response> {
    const action: Actions = request?.action;
    let response: Response = {};

    switch (action) {
      case Actions.CREATE:
        response = await this.createCard(request);
        break;
      default:
        response = { message: 'Action of the card is not available' };
        break;
    }
    return response || {};
  }

  private async createCard(request: Request) {
    if (!(request && request.stripeCustomerId)) {
      throw new BadRequestError('Stripe Customer is not available', 'CUSTOMER_NOT_AVAILABLE');
    }
    const tokenParams: Stripe.TokenCreateParams = {
      card: {
        name: request?.name,
        number: request?.cardNumber || '',
        exp_month: request?.expMonth || '',
        exp_year: request?.expYear || '',
        cvc: request?.cvc,
      },
    };

    const token: Stripe.Token = await stripe.tokens.create(tokenParams);

    if (!token) {
      throw new BadRequestError('Stripe Token is not created', 'TOKEN_CREATE_ERROR');
    }

    const sources = await stripe.customers.createSource(request?.stripeCustomerId || '', {
      source: token?.id,
      metadata: {
        userId: request?.userId || '',
        customerId: request?.stripeCustomerId || '',
      },
    });

    const response: Response = {
      message: 'SOURCE_CREATE_SUCCESS',
      sources,
    };
    return response;
  }
}

export default StripeCardsService;
