import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "dotenv";
import { NewDirectorySchema, NewJobSchema } from "../utils";

config({ path: ".env" }); // or .env.local
interface CustomRequest extends Request {
	userId?: string | object; // Adjust type as needed
	token?: string;
}
export const newJobParser = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		NewJobSchema.parse(req.body);
		next();
	} catch (error: unknown) {
		next(error);
	}
};

export const newDirectoryParser = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		NewDirectorySchema.parse(req.body);
		next();
	} catch (error: unknown) {
		next(error);
	}
};

export const verifyToken = (
	req: CustomRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		res.status(401).json({ error: "Token not provided" });
		return;
		// throw new Error("Token not provided");
	}
	try {
		const secretKey = String(process.env.JWT_SECRET_KEY);
		const decoded = jwt.verify(token, secretKey);
		req.userId = (decoded as { userId: string }).userId;
		next();
	} catch (error: unknown) {
		if (error instanceof jwt.TokenExpiredError) {
			res.status(401).json({ error: "Token expired" });
			return;
			// throw new Error("Token expired");
		}
		if (error instanceof jwt.JsonWebTokenError) {
			res.status(401).json({ error: "Invalid token" });
			return;
			// throw new Error("Invalid token");
		}
		res.status(500).json({ error: "Authentication failed" });
		return;
		// next(error);
	}
};
