import { Router } from 'express';

import auth from './auth';
import users from './users';
import products from './products';
import category from './category';
import userCards from './userCards';
import testPayment from './testPayment';
import carts from './carts';

const routes = Router();
routes.get('/', (req, res) => res.status(400).json({ message: 'Access not allowed' }));

routes.use('/auth', auth());
routes.use('/users', users());
routes.use('/products', products());
routes.use('/categories', category());
routes.use('/userCards', userCards());
routes.use('/testPayment', testPayment());
routes.use('/cart', carts());

export default (): Router => routes;
