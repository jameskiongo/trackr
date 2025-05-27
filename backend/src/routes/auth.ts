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

const router = express.Router();

router.get("/login", (_req, res) => {
  res.send("Login Page");
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
      .then(() => {
        res.status(201).json("User registered successfully");
      })
      .catch((error) => {
        console.error("Registration error:", error);
        res.status(400).json("Error registering user");
      });
  },
);

router.use(errorMiddleware);
export default router;
