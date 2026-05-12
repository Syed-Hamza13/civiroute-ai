import express from "express";
import path from "path";
import { rootDir } from "../app.js";

import { requireAdmin } from "../middlewares/authMiddleware.js";

import AdminController from "../controllers/adminController.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", requireAdmin, (req, res) => {
  res.sendFile(path.join(rootDir, "views/admin/dashboard.html"));
});

// Department Management
router.get("/departments", requireAdmin, (req, res) => {
  res.sendFile(path.join(rootDir, "views/admin/departments.html"));
});

router.get("/departments/create", requireAdmin, (req, res) => {
  res.sendFile(path.join(rootDir, "views/admin/create-department.html"));
});

router.post("/departments/create", AdminController.createDepartment);

router.get("/api/states", requireAdmin, AdminController.getStates);

router.get("/api/cities/:stateId", requireAdmin, AdminController.getCities);

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
