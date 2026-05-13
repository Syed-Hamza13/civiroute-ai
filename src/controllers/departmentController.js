import Complaint from "../models/Complaint.js";
import Department from "../models/Department.js";

export async function getDepartmentComplaints(req, res) {
  try {
    const departmentId = req.session.user.id;

    // logged-in department
    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const complaints = await Complaint.findByDepartment(
      department.department_type_id,
      department.city_id,
    );

    res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateComplaintStatus(req, res) {
  try {
    const complaintId = req.params.id;

    const { status } = req.body;

    const allowedStatuses = [
      "submitted",
      "assigned",
      "in_progress",
      "resolved",
      "closed",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    await Complaint.updateStatus(complaintId, status);

    res.json({
      success: true,
      message: "Complaint status updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
