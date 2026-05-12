
import express from "express";
import ComplaintController from "../controllers/complaintController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all complaints
router.get("/", authMiddleware, ComplaintController.getComplaints);

// Create complaint
router.post("/", authMiddleware, ComplaintController.createComplaint);

// Get complaint by ID
router.get("/:id", authMiddleware, ComplaintController.getComplaintById);

// Update complaint
router.put("/:id", authMiddleware, ComplaintController.updateComplaint);

// Delete complaint
router.delete("/:id", authMiddleware, ComplaintController.deleteComplaint);

// Add comment
router.post("/:id/comment", authMiddleware, ComplaintController.addComment);

// Status update
router.patch("/:id/status", authMiddleware, ComplaintController.updateStatus);

export default router;

