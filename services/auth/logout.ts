import Authentication from "./auth";
import { Request, Response } from 'express';
// ========================================

class LogoutService extends Authentication{
    static async logout(req: Request, res: Response<any, Record<string, any>>): Promise<void | Response<any, Record<string, any>>> {
        try {
              // Get the token from the request headers
              const token = req.headers.authorization?.split(' ')[1];
        
              if (!token) {
                // If token is not found, return unauthorized status
                return res.status(401).json({ message: 'Unauthorized' });
              }
            // Send success response
             res.json({ message: 'Logout successful' });
        } catch (error) {
          console.error('Error logging out:', error);
          // If there's an error, return internal server error status
          res.status(500).json({ message: 'Internal Server Error' });
        }
      }
    }
export default LogoutService;