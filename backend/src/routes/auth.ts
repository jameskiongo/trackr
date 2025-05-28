import express, { Request, Response } from "express";
import {
  TLoginRequest,
  TLoginResponse,
  TRegisterRequest,
  TRegisterResponse,
} from "../types";
import authService from "../services/authService";
import {
  errorMiddleware,
  loginUserParser,
  newUserParser,
} from "../middleware/errorMiddleware";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/login", (_req, res) => {
  res.send("Login Page");
});

router.get("/protected", verifyToken, (_req, res) => {
  res.send("Protected Route: Access Granted");
});

router.post(
  "/login",
  loginUserParser,
  (
    req: Request<unknown, unknown, TLoginRequest>,
    res: Response<TLoginResponse | string>,
  ) => {
    const login = authService.loginUser(req.body);
    login
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((error) => {
        console.error("Login error:", error);
        res.status(401).json("Invalid email or password");
      });
  },
);

router.post(
  "/register",
  newUserParser,
  (
    req: Request<unknown, unknown, TRegisterRequest>,
    res: Response<TRegisterResponse | string>,
  ) => {
    const register = authService.registerUser(req.body);
    register
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((error) => {
        console.error("Registration error:", error);
        res.status(400).json("Error registering user");
      });
  },
);

router.use(errorMiddleware);
export default router;
