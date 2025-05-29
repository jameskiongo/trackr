import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { config } from "dotenv";

config({ path: ".env" }); // or .env.local
interface CustomRequest extends Request {
  userId?: string | object; // Adjust type as needed
  token?: string;
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Token not provided" });
    }
    const decoded = jwt.verify(token!, process.env.JWT_SECRET_KEY!);
    if (!decoded) {
      res.status(401).json({ error: "Invalid token" });
    }
    next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Authentication failed" });
  }
};
