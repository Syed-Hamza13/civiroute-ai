import express from "express";
import path from "path";
import { rootDir } from "../app.js";
import AuthController from "../controllers/authController.js";
import guestOnly from "../middlewares/guestMiddleware.js";

const router = express.Router();

// Home
router.get("/", guestOnly, (req, res) => {
  const userSession = req.session;
  console.log("User session in home route:", userSession);
  res.sendFile(path.join(rootDir, "views/auth/login.html"));
});

// Login page (HTML)
router.get("/login", guestOnly, (req, res) => {
  res.sendFile(path.join(rootDir, "views/auth/login.html"));
});

// Signup page (HTML)
router.get("/signup", guestOnly, (req, res) => {
  res.sendFile(path.join(rootDir, "views/auth/signup.html"));
});

// Verify email page (HTML)
router.get("/verify-email", (req, res) => {
  res.sendFile(path.join(rootDir, "views/auth/verify-email.html"));
});

// API Routes - Citizen Signup
router.post("/signup", AuthController.signup);

// API Routes - Login (Citizen / Department / Admin)
router.post("/login", AuthController.login);

// API Routes - Verify Email
router.post("/verify-email", AuthController.verifyEmail);

// API Routes - Send Mobile OTP
router.post("/send-mobile-otp", AuthController.sendMobileOtp);

// API Routes - Verify Mobile
router.post("/verify-mobile", AuthController.verifyMobile);

// API Routes - Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("civiroute.sid");
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });
});

export default router;