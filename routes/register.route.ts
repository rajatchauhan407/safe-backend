import Express from 'express';
import validateJWT from '../middlewares/validateJWT.js';
import authController from '../controllers/auth.controller.js';

const router = Express.Router();

router.get('/register',authController.register);

export default router;