import Express from 'express';

const router = Express.Router();

import UserController from '../controllers/user.controller.js';

router.get('/create',UserController.createUser);

router.put('/update/:userId',UserController.updateUser);

router.get('/delete/:userId',UserController.deleteUser);

router.get('/users',UserController.getUsers);

router.get('/user/:userId',UserController.getUser);

export default router;