import express, { Response, Request } from "express";
import { verifyToken } from "../middleware/authMiddleware";
const router = express.Router();

router.get("/", verifyToken, (_req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong " + error });
  }
});
router.get("/", (_req, res) => {
  res.send("Directory Home Page");
});

export default router;
