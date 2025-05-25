import express from "express";

const router = express.Router();

router.get("/login", (_req, res) => {
  res.send("Login Page");
});

router.post("/login", (_req, res) => {
  res.send("Login Page");
});

export default router;
