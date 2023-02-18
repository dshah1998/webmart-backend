import { Router } from 'express';

import auth from './auth';
import users from './users';

const routes = Router();
routes.get('/', (req, res) => res.status(400).json({ message: 'Access not allowed' }));

routes.use('/auth', auth());
routes.use('/users', users());

export default (): Router => routes;
