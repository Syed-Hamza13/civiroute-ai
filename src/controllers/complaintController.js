import db from "../config/db.js";

class ComplaintController {
  // Get all complaints for the logged-in citizen
  static async getComplaints(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const [complaints] = await db.query(
        `SELECT id, citizen_id, title, description, status, priority, submitted_at, updated_at
         FROM complaints 
         WHERE citizen_id = ? 
         ORDER BY submitted_at DESC`,
        [userId]
      );

      res.json({
        success: true,
        data: complaints || [],
      });
    } catch (error) {
      console.error("Get complaints error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch complaints",
        error: error.message,
      });
    }
  }

  // Create a new complaint
  static async createComplaint(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { title, description, priority, language } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "Title and description are required",
        });
      }

      const [result] = await db.query(
        `INSERT INTO complaints (citizen_id, title, description, priority, language, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, title, description, priority || "medium", language || "en", "submitted"]
      );

      res.status(201).json({
        success: true,
        message: "Complaint created successfully",
        data: {
          id: result.insertId,
          citizen_id: userId,
          title,
          description,
          priority: priority || "medium",
          status: "submitted",
          submitted_at: new Date(),
        },
      });
    } catch (error) {
      console.error("Create complaint error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create complaint",
        error: error.message,
      });
    }
  }

  // Get a single complaint by ID
  static async getComplaintById(req, res) {
    try {
      const userId = req.user?.id;
      const complaintId = req.params.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const [complaints] = await db.query(
        `SELECT * FROM complaints 
         WHERE id = ? AND citizen_id = ?`,
        [complaintId, userId]
      );

      if (complaints.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      res.json({
        success: true,
        data: complaints[0],
      });
    } catch (error) {
      console.error("Get complaint error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch complaint",
        error: error.message,
      });
    }
  }

  // Update a complaint
  static async updateComplaint(req, res) {
    try {
      const userId = req.user?.id;
      const complaintId = req.params.id;
      const { title, description, priority } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // Check if complaint belongs to user and is not resolved
      const [complaints] = await db.query(
        `SELECT status FROM complaints 
         WHERE id = ? AND citizen_id = ?`,
        [complaintId, userId]
      );

      if (complaints.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      if (complaints[0].status === "resolved" || complaints[0].status === "closed") {
        return res.status(400).json({
          success: false,
          message: "Cannot update resolved or closed complaints",
        });
      }

      await db.query(
        `UPDATE complaints 
         SET title = ?, description = ?, priority = ?, updated_at = NOW()
         WHERE id = ?`,
        [title, description, priority, complaintId]
      );

      res.json({
        success: true,
        message: "Complaint updated successfully",
      });
    } catch (error) {
      console.error("Update complaint error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update complaint",
        error: error.message,
      });
    }
  }

  // Delete a complaint
  static async deleteComplaint(req, res) {
    try {
      const userId = req.user?.id;
      const complaintId = req.params.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const [complaints] = await db.query(
        `SELECT status FROM complaints 
         WHERE id = ? AND citizen_id = ?`,
        [complaintId, userId]
      );

      if (complaints.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      // Only allow deletion of submitted complaints
      if (complaints[0].status !== "submitted") {
        return res.status(400).json({
          success: false,
          message: "Can only delete submitted complaints",
        });
      }

      await db.query(`DELETE FROM complaints WHERE id = ?`, [complaintId]);

      res.json({
        success: true,
        message: "Complaint deleted successfully",
      });
    } catch (error) {
      console.error("Delete complaint error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete complaint",
        error: error.message,
      });
    }
  }

  // Add comment to complaint
  static async addComment(req, res) {
    try {
      const userId = req.user?.id;
      const complaintId = req.params.id;
      const { comment } = req.body;

      if (!userId || !comment) {
        return res.status(400).json({
          success: false,
          message: "Comment is required",
        });
      }

      // Verify complaint exists and belongs to user
      const [complaints] = await db.query(
        `SELECT id FROM complaints 
         WHERE id = ? AND citizen_id = ?`,
        [complaintId, userId]
      );

      if (complaints.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      res.json({
        success: true,
        message: "Comment added successfully",
      });
    } catch (error) {
      console.error("Add comment error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add comment",
        error: error.message,
      });
    }
  }

  // Update complaint status (department/admin only)
  static async updateStatus(req, res) {
    try {
      const complaintId = req.params.id;
      const { status, remarks } = req.body;

      const validStatuses = ["submitted", "assigned", "in_progress", "resolved", "closed", "rejected"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const [complaints] = await db.query(
        `SELECT status FROM complaints WHERE id = ?`,
        [complaintId]
      );

      if (complaints.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Complaint not found",
        });
      }

      const oldStatus = complaints[0].status;

      await db.query(
        `UPDATE complaints 
         SET status = ?, updated_at = NOW()
         WHERE id = ?`,
        [status, complaintId]
      );

      // Log status change if remarks provided
      if (remarks) {
        await db.query(
          `INSERT INTO complaint_status_history (complaint_id, old_status, new_status, remarks, updated_by_role)
           VALUES (?, ?, ?, ?, ?)`,
          [complaintId, oldStatus, status, remarks, "system"]
        );
      }

      res.json({
        success: true,
        message: "Complaint status updated successfully",
      });
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update status",
        error: error.message,
      });
    }
  }
}

export default ComplaintController;
