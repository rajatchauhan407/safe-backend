import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user/userService.js';
import LoginService from '../services/auth/login.js';
import LogoutService from '../services/auth/logout.js';
import ApplicationError from '../errors/applicationError.js';
// ========================================================
class AuthController {
  // REGISTER ============================================
  async register(req:Request, res:Response, next:NextFunction) {
    try {
      const userData = req.body;
      const newUser = await new UserService().createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
// LOGIN ===============================================
async login(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, password, role } = req.body;
    console.log(req.body);
    const token = await LoginService.login(userId, password, role);
    if(token instanceof ApplicationError){
      throw token
    }
    if (token) {
      const user = new UserService();
      const userData = await user.getUser(userId);
      console.log(userData);
      res.status(200).json({ token,user:userData });

    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    next(error);
  }
}
// LOGOUT ===============================================
async logout(req: Request, res: Response, next: NextFunction) {
  try {
    await LogoutService.logout(req, res);
  } catch (error) {
    next(error);
  }
}

// verifyToken ===============================================
async verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)
    if (!token) {
      throw new ApplicationError('Token not found', 401, 'Token not found', 'token not found');
    }
    const isAuthed = await LoginService.validateToken(token);
    res.status(200).json({isAuthed});
  } catch (error) {
    next(error);
  }
}
  async storeToken(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenData = req.body;
      console.log(tokenData);
      const token = await LoginService.storeToken(tokenData);
      res.status(201).json({message:'Token stored successfully',token});
    } catch (error) {
      next(error);
    }
  }
  async deleteToken(req: Request, res: Response, next: NextFunction) {
    try {
      const {userId} = req.body;
      console.log(userId)
      const deletedToken = await LoginService.deleteToken(userId);
      res.status(200).json({message:'Token deleted successfully',deletedToken});
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();
export default authController;