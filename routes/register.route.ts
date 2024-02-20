import Express from 'express';

const router = Express.Router();

import authController from '../controllers/auth.controller';
router.get('/register',authController.register);