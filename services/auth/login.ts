import Authentication from "./auth.js";
import User from '../../models/user.model.js';
// ========================================

class LoginService extends Authentication {
    static async login(userId: string, password: string): Promise<string | null | boolean> {
        try {
          const user = await User.findOne({ userId });
          if (!user) {
            return 'User not found';
          }
    
    // Authenticate user using AuthService methods
      const isAuthenticated = await Authentication.authenticateUser(userId, password);
      if (!isAuthenticated) {
        console.log('Invalid credentials');
        return false;
        
      }

    // Generate JWT token using AuthService method
      const token = Authentication.generateToken(userId);
      return token;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  }
  
}

export default LoginService;