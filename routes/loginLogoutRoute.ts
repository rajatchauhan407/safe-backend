import Express from 'express';
const router = Express.Router();
import authController from '../controllers/auth.controller.js';
// ========================================================

router.post('/login',authController.login);
router.get('/logout',authController.logout);
export default router;