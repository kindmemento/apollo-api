import { Request } from "express";

// Extension to attach userId to incoming requests in authMiddleware.

declare global {
	namespace Express {
		interface Request {
			userId?: number;
		}
	}
}