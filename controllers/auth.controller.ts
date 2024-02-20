import { Request, Response, NextFunction } from 'express';
class AuthController {
  async register(req:Request, res:Response, next:NextFunction) {
    try {
      res.send('Register');
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();
export default authController;