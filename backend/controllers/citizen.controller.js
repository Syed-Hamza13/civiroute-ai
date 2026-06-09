const Complaint = require('../models/complaint.model');
const User = require('../models/user.model');
const { analyzeGrievance } = require('../utils/mockAI');

// @desc    Get logged-in citizen's complaints
// @route   GET /api/citizen/complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizenId: req.session.userId }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Lodge a new complaint (Triggers AI Routing)
// @route   POST /api/citizen/complaints
exports.lodgeComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const documentPath = req.file ? `/uploads/${req.file.filename}` : null;

    // 1. Get Citizen details for Geo-tagging
    const citizen = await User.findById(req.session.userId);

    // 2. Pass description to Mock AI Engine
    const { predictedDepartment, urgency } = analyzeGrievance(title + " " + description);

    // 3. Create Complaint
    const newComplaint = await Complaint.create({
      title,
      description,
      citizenId: citizen._id,
      state: citizen.state,
      city: citizen.city,
      pincode: citizen.pincode,
      supportingDocs: documentPath ? [documentPath] : [],
      aiAnalysis: {
        predictedDepartment,
        confidenceScore: 0.92, // Mock score
        urgency
      },
      assignedDepartment: predictedDepartment, // Auto-routing it to DeptHead's inbox
      status: 'Pending'
    });

    res.status(201).json({ message: 'Complaint lodged and routed successfully', complaint: newComplaint });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};