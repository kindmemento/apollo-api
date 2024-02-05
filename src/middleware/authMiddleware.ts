import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()
const jwtSecret = process.env.JWT_SECRET as string || "secret";

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decodedToken = jwt.verify(token, jwtSecret);
        req.userId = (decodedToken as any).userId;
        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
