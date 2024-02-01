// src/controllers/authController.ts
import { Request, Response } from 'express';
import { User } from '../models/user';

export const signup = async (req: Request, res: Response) => {
    const { email, password, companyName } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Create a new user
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
        // Check if the user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check password
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        // Session management or token generation can be implemented here based on required feature improvements.
        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = (req: Request, res: Response) => {
    // Logout logic (e.g., session/token invalidation) can be implemented here based on required feature improvements.
    return res.status(200).json({ message: 'Logout successful' });
};
