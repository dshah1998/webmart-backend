import { Router } from 'express';
import { validate } from 'express-validation';

import { handleError, authenticate } from '../middleware';
import { addAddress, addAddressValidation } from '../controller/address';

const router = Router();

const postAddAddress = (): Router =>
  router.post(
    '/',
    authenticate,
    validate(addAddressValidation, { context: true }),
    handleError(addAddress()),
  );

export default (): Router => router.use([postAddAddress()]);