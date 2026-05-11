import express from "express";
import path from "path";
import { rootDir } from "../app.js";
import AuthController from "../controllers/authController.js";
import guestOnly from "../middlewares/guestMiddleware.js";

const router = express.Router();

// Home
router.get("/", guestOnly, (req, res) => {
  res.sendFile(path.join(rootDir, "views/auth/login.html"));
});

// Login page
router.get("/login", guestOnly, (req, res) => {
  res.sendFile(path.join(rootDir, "views/auth/login.html"));
});

// Signup page
router.get("/signup", guestOnly, (req, res) => {
  res.sendFile(path.join(rootDir, "views/auth/signup.html"));
});

router.get("/verify-email", (req, res) => {
  res.sendFile(path.join(rootDir, "views/auth/verify-email.html"));
});

router.post("/verify-email", AuthController.verifyEmail);

router.post("/send-mobile-otp", AuthController.sendMobileOtp);

router.post("/verify-mobile", AuthController.verifyMobile);
 
// Citizen Signup
router.post("/signup", AuthController.signup);

// Login (Citizen / Department / Admin)
router.post("/login", AuthController.login);

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("civiroute.sid");
    res.redirect("/login");
  });
});

export default router;
