import crypto from 'crypto';
import User from '../../models/user.model.js';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import ApplicationError from '../../errors/applicationError.js';
dotenv.config();
// ========================================

class Authentication{
  
    // Generate Random Salt
    static generateSalt(): string {
        const salt = crypto.randomBytes(16).toString('hex');
        return salt;
      }

    // Hash Password
    static hashPassword(password: string, salt: string): string {
        const hash = crypto.pbkdf2Sync(password, salt, 911 , 64, 'sha256').toString('hex');
        return hash;
      }

    // Generate JWT Token
    static generateToken(userId: string): string {
      const secret: Secret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign({ userId }, secret, { expiresIn: '24h' });
      return token;
    }
      
    // Authenticate User
    static async authenticateUser(userId: string, password: string, role: string): Promise<boolean> {
        const user = await User.findOne({ userId });
        if (!user) {
          return false;
        }
        const findSalt = user.salt || '';
        console.log('findSalt', findSalt);
        const roleMatch = user.role === role;
        const hashedPassword = this.hashPassword(password, findSalt );
        return hashedPassword === user.password && roleMatch;
      }

    // Validate Token

    static async validateToken(token: string): Promise<boolean> {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET not found');
        }
        try {
          jwt.verify(token, secret);
          return true;
        } catch (error) {
          throw new ApplicationError('Invalid Token', 401, 'Invalid Token', 'invalid token');
        }
      }
    }
    
export default Authentication;
