import Express from 'express';
import validateJWT from '../middlewares/validateJWT.js';
import authController from '../controllers/auth.controller.js';
const router = Express.Router();

// ========================================================

router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.get('/verify-token',authController.verifyToken);
router.post('/storeToken',authController.storeToken);
router.post('/deleteToken',authController.deleteToken);
export default router;