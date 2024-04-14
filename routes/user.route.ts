import Express from 'express';
import validateJWT from '../middlewares/validateJWT.js';
import UserController from '../controllers/user.controller.js';

const router = Express.Router();

router.get('/create',UserController.createUser);

router.put('/update/:userId',UserController.updateUser);

router.get('/delete/:userId',UserController.deleteUser);

router.get('/users',UserController.getUsers);

router.get('/user/:userId',UserController.getUser);

export default router;