
import express from "express";

const router = express.Router();

// Dashboard
router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard");
});

// Department Management
router.get("/departments", (req, res) => {
  res.render("admin/departments");
});

router.get("/departments/create", (req, res) => {
  res.render("admin/create-department");
});

// Citizens
router.get("/citizens", (req, res) => {
  res.render("admin/citizens");
});

// Complaints
router.get("/complaints", (req, res) => {
  res.render("admin/complaints");
});

// Analytics
router.get("/analytics", (req, res) => {
  res.render("admin/analytics");
});

// Settings
router.get("/settings", (req, res) => {
  res.render("admin/settings");
});

export default router;

