const Complaint = require('../models/complaint.model');

// @desc    Get action worklist assigned to this supervisor
// @route   GET /api/supervisor/complaints
exports.getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ 
      assignedSupervisorId: req.session.userId 
    }).sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Submit resolution proof
// @route   POST /api/supervisor/complaints/resolve
exports.resolveComplaint = async (req, res) => {
  try {
    const { complaintId, description } = req.body;
    const proofImagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!proofImagePath) {
      return res.status(400).json({ message: 'Proof image is mandatory for resolution' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        status: 'Pending Approval', // Moves to DeptHead's Audit Loop
        resolutionDetails: {
          description,
          proofImages: [proofImagePath],
          submittedAt: new Date()
        }
      },
      { new: true }
    );

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.json({ message: 'Resolution submitted for approval', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};