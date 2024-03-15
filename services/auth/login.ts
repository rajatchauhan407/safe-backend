import Authentication from "./auth.js";
import User from '../../models/user.model.js';
import ApplicationError from "../../errors/applicationError.js";
import { IError } from "../../shared/interfaces/error.interface.js";
// ========================================

class LoginService extends Authentication {
    static async login(userId: string, password: string): Promise<string | null | boolean | IError> {
        try {
          const user = await User.findOne({ userId });
          if (!user) {
            throw new ApplicationError('User Not Found',404,'User Not Found','Hey be careful');
          }
    
    // Authenticate user using AuthService methods
      const isAuthenticated = await Authentication.authenticateUser(userId, password);
      if (!isAuthenticated) {
        console.log('Invalid credentials');
        throw new ApplicationError('Invalid credentials',404,'Invalid Credentials','error details')
      }

    // Generate JWT token using AuthService method
      const token = Authentication.generateToken(userId);
      return token;
    } catch (error) {
      console.error('Error logging in:', error);
      if(error instanceof ApplicationError){
        return error;
      }
      return new ApplicationError('Invalid Request',500,'internal server error','details')
      // return false;
    }
  }
  
}

export default LoginService;