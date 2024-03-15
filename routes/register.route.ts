import Express from 'express';

const router = Express.Router();

import authController from '../controllers/auth.controller.js';

router.get('/register',authController.register);

export default router;