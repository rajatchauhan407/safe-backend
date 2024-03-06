import Express from 'express';
const router = Express.Router();
import authController from '../controllers/auth.controller.js';
// ========================================================

router.post('/login',authController.login);
export default router;