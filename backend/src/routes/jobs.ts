import express, { type Response, type Request } from "express";
import jwt from "jsonwebtoken";
import { newJobParser, verifyToken } from "../middleware/authMiddleware";
import { errorMiddleware } from "../middleware/errorMiddleware";
import { deleteJob, getJob, getJobs } from "../services/jobs";
import addJob from "../services/jobs/addJobs";
import editJob from "../services/jobs/editJob";
import type { AddJob, EditJob } from "../types";
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
	const jobs = getJobs(userId);
	jobs
		.then((jobs) => {
			res.status(200).json(jobs);
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
		const jobs = getJob({
			userId: userId,
			paramId: paramId,
		});
		jobs
			.then((job) => {
				res.status(200).json(job);
			})
			.catch((error) => {
				res.status(400).json(`${error}`);
			});
	},
);
router.post(
	"/:id",
	verifyToken,
	newJobParser,
	(req: Request<{ id: string }, unknown, AddJob>, res: Response) => {
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
		const response = addJob(req.body, userId, paramId);
		response
			.then((job) => {
				res.status(201).json(job);
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

	const job = deleteJob({
		userId: userId,
		id: id,
	});
	job
		.then(() => {
			res.status(204).json({ message: "Job deleted successfully" });
		})
		.catch((error) => {
			res.status(400).json(`${error}`);
		});
});
router.patch(
	"/:id",
	verifyToken,
	(req: Request<{ id: string }, unknown, EditJob>, res: Response) => {
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
		const id = Number(req.params.id);
		const jobs = editJob(req.body, userId, id);
		jobs
			.then((job) => {
				res.status(201).json(job);
			})
			.catch((error) => {
				res.status(400).json(`${error}`);
			});
	},
);

router.use(errorMiddleware);
export default router;
