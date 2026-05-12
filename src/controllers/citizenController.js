import Complaint from "../models/Complaint.js";

import {
  classifyComplaint
} from "../../python-services/api/classifier_model.js";

export async function submitComplaint(req, res) {

  try {

    const {
      title,
      complaint
    } = req.body;

    const citizenId =
      req.session.user.id;

    // =========================
    // AI CLASSIFICATION
    // =========================

    const aiResult =
      await classifyComplaint(
        complaint
      );

    console.log(
      "AI Classification Result:",
      aiResult
    );

    const data =
      aiResult.data;

    // =========================
    // MAP DEPARTMENT
    // =========================

    let predictedDepartmentTypeId = null;

    const detectedDepartment =
      data.detected_department
        ?.toLowerCase();

    if (
      detectedDepartment.includes("road")
    ) {
      predictedDepartmentTypeId = 1;
    }

    else if (
      detectedDepartment.includes("water")
    ) {
      predictedDepartmentTypeId = 2;
    }

    else if (
      detectedDepartment.includes("waste")
      ||
      detectedDepartment.includes("sanitation")
    ) {
      predictedDepartmentTypeId = 4;
    }

    else if (
      detectedDepartment.includes("electric")
      ||
      detectedDepartment.includes("lighting")
    ) {
      predictedDepartmentTypeId = 3;
    }

    // =========================
    // PRIORITY MAP
    // =========================

    let priority = "medium";

    const urgency =
      data.urgency_level
        ?.toLowerCase();

    if (urgency === "low") {
      priority = "low";
    }

    else if (urgency === "medium") {
      priority = "medium";
    }

    else if (urgency === "high") {
      priority = "high";
    }

    else if (
      urgency === "critical"
    ) {
      priority = "critical";
    }

    // =========================
    // SAVE COMPLAINT
    // =========================

    await Complaint.create({

      citizen_id:
        citizenId,

      title,

      description:
        complaint,

      language:
        "english",

      predicted_department_type_id:
        predictedDepartmentTypeId,

      priority,

      status:
        "submitted",

      confidence_score:
        95.50
    });

    res.status(200).json({
      success: true,
      message:
        "Complaint submitted successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error.message
    });
  }
}

export async function myComplaints(
  req,
  res
) {

  try {

    const citizenId =
      req.session.user.id;

    const complaints =
      await Complaint.findByCitizen(
        citizenId
      );

    res.json({
      success: true,
      complaints
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });
  }
}