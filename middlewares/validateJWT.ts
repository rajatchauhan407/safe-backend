import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//Middleware to validate JWT
const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization;

    // Check if authHeader exists
    if (!authHeader) {
        console.log("Authorization Header not provided");
        return res.status(401).json({ message: 'Authorization Header not provided' });
    }
    const token = authHeader.split(' ')[1];
   
    // Check if token exists
    if (!token) {
        console.log("Authorization token not provided");
        return res.status(401).json({ message: 'Authorization token not provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);     
       
        next();
    } catch (err) {        
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default validateJWT;
