import express, { Response, Request } from "express";
import directoryService from "../services/directoryService";
import jwt from "jsonwebtoken";
import { newDirectoryParser, verifyToken } from "../middleware/authMiddleware";
import { errorMiddleware } from "../middleware/errorMiddleware";
import { TDirectoryRequest, TDirectoryResponse } from "../types";
const router = express.Router();

router.get("/", verifyToken, (_req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong " + error });
  }
});
router.post(
  "/",
  verifyToken,
  newDirectoryParser,
  (
    req: Request<unknown, unknown, TDirectoryRequest>,
    res: Response<TDirectoryResponse | string>,
  ) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token!, process.env.JWT_SECRET_KEY!);
    const userId = (decoded as { userId: number }).userId;
    const { name } = req.body;
    const directory = directoryService.addDirectory({
      name: name,
      userId: userId,
    });
    directory
      .then((directory) => {
        res.status(201).json(directory);
      })
      .catch((error) => {
        res.status(400).json("" + error);
      });
  },
);
router.use(errorMiddleware);
export default router;
