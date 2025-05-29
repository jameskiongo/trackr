import express, { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { newDirectoryParser, verifyToken } from "../middleware/authMiddleware";
import { errorMiddleware } from "../middleware/errorMiddleware";
const router = express.Router();

router.get("/", verifyToken, (_req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong " + error });
  }
});
router.post("/", verifyToken, newDirectoryParser, (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token!, process.env.JWT_SECRET_KEY!);
  const userId = (decoded as { userId: number }).userId;

  console.log(req.body, userId);
  res.send("Directory Home Page");
});
router.use(errorMiddleware);
export default router;
