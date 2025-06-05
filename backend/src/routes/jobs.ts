import express, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/authMiddleware";
import { errorMiddleware } from "../middleware/errorMiddleware";
import { getJobs } from "../services/jobs";
const router = express.Router();

router.get("/", verifyToken, (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token!, process.env.JWT_SECRET_KEY!);
  const userId = (decoded as { userId: number }).userId;
  const jobs = getJobs(userId);
  jobs
    .then((jobs) => {
      res.status(200).json(jobs);
    })
    .catch((error) => {
      res.status(400).json("" + error);
    });
});
router.use(errorMiddleware);
export default router;
