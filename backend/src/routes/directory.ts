import express, { type Response, type Request } from "express";
import jwt from "jsonwebtoken";
import { newDirectoryParser, verifyToken } from "../middleware/authMiddleware";
import { errorMiddleware } from "../middleware/errorMiddleware";
import {
	addDirectory,
	deleteDirectory,
	editDirectory,
	getDirectories,
	getDirectory,
} from "../services/directory";
import type {
	EditDirectoryRequest,
	TDirectoryRequest,
	TDirectoryResponse,
} from "../types";
const router = express.Router();

router.get("/", verifyToken, (req: Request, res: Response) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		throw new Error("Token not provided");
	}
	const SecretKey = String(process.env.JWT_SECRET_KEY);
	if (!process.env.JWT_SECRET_KEY) {
		throw new Error("JWT_SECRET_KEY is not defined");
	}
	const decoded = jwt.verify(token, SecretKey);
	const userId = (decoded as { userId: number }).userId;

	// const directory = directoryService.getDirectories(userId);
	const directory = getDirectories(userId);
	directory
		.then((directory) => {
			res.status(201).json(directory);
		})
		.catch((error) => {
			res.status(400).json(`${error}`);
		});
});

router.get(
	"/:id",
	verifyToken,
	(req: Request<{ id: string }, unknown, unknown>, res: Response) => {
		const paramId = Number(req.params.id);
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) {
			throw new Error("Token not provided");
		}
		const SecretKey = String(process.env.JWT_SECRET_KEY);
		if (!process.env.JWT_SECRET_KEY) {
			throw new Error("JWT_SECRET_KEY is not defined");
		}
		const decoded = jwt.verify(token, SecretKey);

		const userId = (decoded as { userId: number }).userId;

		const directory = getDirectory({ userId: userId, paramId: paramId });
		directory
			.then((directory) => {
				res.status(201).json(directory);
			})
			.catch((error) => {
				res.status(400).json(`${error}`);
			});
	},
);

router.post(
	"/",
	verifyToken,
	newDirectoryParser,
	(
		req: Request<unknown, unknown, TDirectoryRequest>,
		res: Response<TDirectoryResponse | string>,
	) => {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) {
			throw new Error("Token not provided");
		}
		const SecretKey = String(process.env.JWT_SECRET_KEY);
		if (!process.env.JWT_SECRET_KEY) {
			throw new Error("JWT_SECRET_KEY is not defined");
		}
		const decoded = jwt.verify(token, SecretKey);
		const userId = (decoded as { userId: number }).userId;
		const { name } = req.body;
		const directory = addDirectory({
			name: name,
			userId: userId,
		});
		directory
			.then((directory) => {
				res.status(201).json(directory);
			})
			.catch((error) => {
				res.status(400).json(`${error}`);
			});
	},
);
router.put(
	"/:id",
	verifyToken,
	newDirectoryParser,
	(
		req: Request<{ id: string }, unknown, EditDirectoryRequest>,
		res: Response,
	) => {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) {
			throw new Error("Token not provided");
		}
		const SecretKey = String(process.env.JWT_SECRET_KEY);
		if (!process.env.JWT_SECRET_KEY) {
			throw new Error("JWT_SECRET_KEY is not defined");
		}
		const decoded = jwt.verify(token, SecretKey);
		const userId = (decoded as { userId: number }).userId;
		const { name } = req.body;
		const paramId = req.params.id;

		const directory = editDirectory({
			userId: userId,
			name: name,
			id: paramId,
		});
		directory
			.then((directory) => {
				res.status(201).json(directory);
			})
			.catch((error) => {
				res.status(400).json(`${error}`);
			});
	},
);
router.delete("/:id", verifyToken, (req: Request, res: Response) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		throw new Error("Token not provided");
	}
	const SecretKey = String(process.env.JWT_SECRET_KEY);
	if (!process.env.JWT_SECRET_KEY) {
		throw new Error("JWT_SECRET_KEY is not defined");
	}
	const decoded = jwt.verify(token, SecretKey);
	const userId = (decoded as { userId: number }).userId;
	const id = req.params.id;

	const directory = deleteDirectory({
		userId: userId,
		id: id,
	});
	directory
		.then(() => {
			res.status(204).json({ message: "Directory deleted successfully" });
		})
		.catch((error) => {
			res.status(400).json(`${error}`);
		});
});

router.use(errorMiddleware);
export default router;
