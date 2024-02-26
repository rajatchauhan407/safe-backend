import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user/userService.js';
class AuthController {
  async register(req:Request, res:Response, next:NextFunction) {
    try {
      const userData = req.body;
      const newUser = await new UserService().createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();
export default authController;