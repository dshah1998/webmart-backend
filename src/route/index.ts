import { Router } from 'express';

import auth from './auth';
import users from './users';
import carts from './carts';
import brands from './brand';
import orders from './orders';
import report from './reports';
import products from './products';
import category from './category';
import userCards from './userCards';
import dashboard from './dashboard';
import testPayment from './testPayment';
import orderAddress from './orderAddress';
import modificationRequests from './modificationRequests';

const routes = Router();
routes.get('/', (req, res) => res.status(400).json({ message: 'Access not allowed' }));

routes.use('/auth', auth());
routes.use('/cart', carts());
routes.use('/users', users());
routes.use('/brands', brands());
routes.use('/orders', orders());
routes.use('/reports', report());
routes.use('/products', products());
routes.use('/dashboard', dashboard());
routes.use('/categories', category());
routes.use('/userCards', userCards());
routes.use('/testPayment', testPayment());
routes.use('/orderAddress', orderAddress());
routes.use('/modificationRequests', modificationRequests());

export default (): Router => routes;
