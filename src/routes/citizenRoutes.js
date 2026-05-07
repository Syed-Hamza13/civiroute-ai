import express from "express";
import path from "path";
import { rootDir } from "../app.js";
import { requireCitizen } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard",requireCitizen, (req, res) => {
  res.sendFile(path.join(rootDir, "views/citizen/dashboard.html"));
});

// Complaint pages
router.get("/submit-complaint", (req, res) => {
  res.render("citizen/submit-complaint");
});

router.get("/my-complaints", (req, res) => {
  res.render("citizen/my-complaints");
});

router.get("/profile", (req, res) => {
  res.render("citizen/profile");
});

router.get("/notifications", (req, res) => {
  res.render("citizen/notifications");
});

export default router;
