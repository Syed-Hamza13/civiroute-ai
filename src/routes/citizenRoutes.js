
import express from "express";

const router = express.Router();

// Dashboard
router.get("/dashboard", (req, res) => {
  res.render("citizen/dashboard");
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
