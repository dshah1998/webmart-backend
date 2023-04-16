import { Router } from 'express';
import { validate } from 'express-validation';

import { handleError, authenticate, checkUserType } from '../middleware';
import {
  getAll,
  createNotificationValidation,
  createNotification,
  updateRequestValidation,
  updateRequest,
  deleteremoveRequestValidation,
  removeRequest
} from '../controller/modificationRequests';

import { WebMartUserType } from '../constants';

const router = Router();

const getModifyRequests = (): Router => 
  router.get(
    '/',
    authenticate,
    handleError(getAll()),
  );

const postCreateModifyRequest = (): Router =>
  router.post(
    '/',
    authenticate,
    validate(createNotificationValidation, { context: true }),
    handleError(createNotification()),
  );

const deleteUpdateModifyRequest = (): Router =>
  router.delete(
    '/:id',
    authenticate,
    checkUserType(WebMartUserType.ADMIN, WebMartUserType.USER, WebMartUserType.SELLER),
    validate(deleteremoveRequestValidation, { context: true }),
    handleError(removeRequest()),
  );

  const updateModifyRequests = (): Router =>
  router.put(
    '/:id',
    authenticate,
    validate(updateRequestValidation, { context: true }),
    handleError(updateRequest()),
  );

export default (): Router =>
  router.use([
    getModifyRequests(),
    postCreateModifyRequest(),
    deleteUpdateModifyRequest(),
    updateModifyRequests(),
  ]);
