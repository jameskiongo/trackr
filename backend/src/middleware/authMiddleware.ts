import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    return next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    return res.status(500).json({ error: "Authentication failed" });
  }
};
