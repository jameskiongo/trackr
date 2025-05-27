import express, { Request, Response } from "express";
import { TLoginRequest, TLoginResponse } from "../types";

const router = express.Router();

router.get("/login", (_req, res) => {
  res.send("Login Page");
});

router.post(
  "/login",
  (
    req: Request<unknown, unknown, TLoginRequest>,
    res: Response<TLoginResponse>,
  ) => {
    const { email, password }: TLoginRequest = req.body;
    console.log({ email, password });
    const name = "james";
    const id = 2;
    res.send({ email, id, name });
  },
);

export default router;
