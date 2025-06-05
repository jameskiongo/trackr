import express, { Response, Request } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { errorMiddleware } from "../middleware/errorMiddleware";
const router = express.Router();

router.get("/", verifyToken, (_req: Request, res: Response) => {
  res.send("Get all jobs");
});
router.use(errorMiddleware);
export default router;
