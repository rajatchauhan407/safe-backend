import Express from 'express';
import validateJWT from '../middlewares/validateJWT.js';
import UserController from '../controllers/user.controller.js';

const router = Express.Router();

router.get('/create',validateJWT,UserController.createUser);

router.put('/update/:userId',validateJWT,UserController.updateUser);

router.get('/delete/:userId',validateJWT,UserController.deleteUser);

router.get('/users',validateJWT,UserController.getUsers);

router.get('/user/:userId',validateJWT,UserController.getUser);

export default router;