import crypto from 'crypto';
import User from '../../models/user.model';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
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
    static async authenticateUser(userId: string, password: string): Promise<boolean> {
        const user = await User.findOne({ userId });
        if (!user) {
          return false;
        }
        const salt = "salt"
        const hashedPassword = this.hashPassword(password, salt);
        return hashedPassword === user.password;
      }

    }
    
export default Authentication;
