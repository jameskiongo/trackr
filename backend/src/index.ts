import express from "express";
import userAuthRouter from "./routes/auth";
import "dotenv/config";
import { config } from "dotenv";

const app = express();
app.use(express.json());

config({ path: ".env" });

const PORT = process.env.PORT || 3000;

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});
app.use("/auth", userAuthRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
