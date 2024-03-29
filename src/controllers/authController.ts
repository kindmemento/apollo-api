import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import dotenv from 'dotenv';

dotenv.config()
const jwtSecret = process.env.JWT_SECRET as string || "secret";

export const signup = async (req: Request, res: Response) => {
    const { email, password, companyName } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = await User.create({ email, password, companyName });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Error signing up:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
			const user = await User.findOne({ where: { email } });
			if (!user) {
					return res.status(404).json({ error: 'User not found' });
			}

			if (user.password !== password) {
					return res.status(401).json({ error: 'Invalid password' });
			}

			const token = jwt.sign({ userId: user.id }, jwtSecret);
			return res.status(200).json({ token });
	} catch (error) {
			console.error('Error logging in:', error);
			return res.status(500).json({ error: 'Internal server error' });
	}
};

export const logout = (req: Request, res: Response) => {
    // Logout logic (e.g., session/token invalidation) can be implemented here based on required feature improvements.
    return res.status(200).json({ message: 'Logout successful' });
};
