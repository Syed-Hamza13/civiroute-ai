
import express from "express";
import path from "path";
import { rootDir } from "../app.js";
import AuthController from "../controllers/authController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "views/auth/login.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(rootDir, "views/auth/login.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(path.join(rootDir, "views/auth/signup.html"));
});

router.post("/signup", AuthController.signup);

export default router;
