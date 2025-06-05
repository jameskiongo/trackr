import express, { Response, Request } from "express";
const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.send("Get all jobs");
});
export default router;
