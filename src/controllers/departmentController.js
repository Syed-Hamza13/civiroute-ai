import Complaint from "../models/Complaint.js";
import Department from "../models/Department.js";

export async function getDepartmentComplaints(
  req,
  res
) {

  try {

    const departmentId =
      req.session.user.id;

    // logged-in department
    const department =
      await Department.findById(
        departmentId
      );

    if (!department) {

      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    const complaints =
      await Complaint.findByDepartment(
        department.department_type_id,
        department.city_id
      );

    res.json({
      success: true,
      complaints
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}