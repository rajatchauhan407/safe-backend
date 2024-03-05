import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user/userService.js';
import LoginService from '../services/auth/login.js';
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
    const { userId, password } = req.body;
    const token = await LoginService.login(userId, password);
    if (token) {
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
}
}

const authController = new AuthController();
export default authController;