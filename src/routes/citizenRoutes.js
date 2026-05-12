import express from "express";
import path from "path";
import { rootDir } from "../app.js";
import { requireCitizen } from "../middlewares/authMiddleware.js";
import { submitComplaint, myComplaints } from "../controllers/citizenController.js";

const router = express.Router();

// Dashboard
router.get("/dashboard",requireCitizen, (req, res) => {
  res.sendFile(path.join(rootDir, "views/citizen/dashboard.html"));
});

// Complaint pages
router.post("/submit-complaint", submitComplaint) 


router.get("/my-complaints", myComplaints)

router.get("/profile", (req, res) => {
  res.render("citizen/profile");
});

router.get("/notifications", (req, res) => {
  res.render("citizen/notifications");
});

export default router;
