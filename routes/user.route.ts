import Express from 'express';
import validateJWT from '../shared/validations/validateJWT.js';
import UserController from '../controllers/user.controller.js';

const router = Express.Router();
// Apply the validateJWT middleware for all routes in this router
// router.use(validateJWT);

router.get('/create',UserController.createUser);

router.put('/update/:userId',UserController.updateUser);

router.get('/delete/:userId',UserController.deleteUser);

router.get('/users',UserController.getUsers);

router.get('/user/:userId',UserController.getUser);

export default router;