import express from "express";
import path from "path";
import { rootDir } from "../app.js";
import { requireDepartment } from "../middlewares/authMiddleware.js";
const router = express.Router();
import {
  getDepartmentComplaints,
  updateComplaintStatus,
} from "../controllers/departmentController.js";

// Dashboard
router.get("/dashboard", requireDepartment, (req, res) => {
  res.sendFile(path.join(rootDir, "views/department/dashboard.html"));
});

// Assigned complaints
router.get("/complaints", getDepartmentComplaints);

// Complaint details
router.get("/complaints/:id", (req, res) => {
  res.render("department/complaint-details", {
    complaintId: req.params.id,
  });
});

router.patch("/complaints/:id/status", updateComplaintStatus);

// Profile
router.get("/profile", (req, res) => {
  res.render("department/profile");
});

export default router;
