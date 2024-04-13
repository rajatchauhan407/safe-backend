import Express from 'express';
import validateJWT from '../shared/validations/validateJWT.js';
import authController from '../controllers/auth.controller.js';

const router = Express.Router();
// Apply the validateJWT middleware for all routes in this router
// router.use(validateJWT);

router.get('/register',authController.register);

export default router;