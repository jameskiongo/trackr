import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { NewUserSchema } from "../utils";

const LoginUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const newUserParser = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		NewUserSchema.parse(req.body);
		next();
	} catch (error: unknown) {
		next(error);
	}
};

export const loginUserParser = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		LoginUserSchema.parse(req.body);
		next();
	} catch (error: unknown) {
		next(error);
	}
};

export const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (error instanceof z.ZodError) {
		res.status(400).send({ error: error.issues });
	} else {
		next(error);
	}
};
