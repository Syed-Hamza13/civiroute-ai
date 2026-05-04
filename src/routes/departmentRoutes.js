
import express from "express";

const router = express.Router();

// Dashboard
router.get("/dashboard", (req, res) => {
  res.render("department/dashboard");
});

// Assigned complaints
router.get("/complaints", (req, res) => {
  res.render("department/complaints");
});

// Complaint details
router.get("/complaints/:id", (req, res) => {
  res.render("department/complaint-details", {
    complaintId: req.params.id,
  });
});

// Profile
router.get("/profile", (req, res) => {
  res.render("department/profile");
});

export default router;
