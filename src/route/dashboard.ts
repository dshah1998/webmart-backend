import { Router } from 'express';
import { validate } from 'express-validation';

import { authenticate ,handleError, checkUserType } from '../middleware';
import {
  getAdminDashboard
} from '../controller/dashboard';
import { WebMartUserType } from '../constants';

const router = Router();

const getDashboardCount = (): Router =>
  router.get(
    '/count',
    authenticate,
    checkUserType(WebMartUserType.ADMIN),
    handleError(getAdminDashboard()),
  );

export default (): Router => router.use([getDashboardCount()]);
