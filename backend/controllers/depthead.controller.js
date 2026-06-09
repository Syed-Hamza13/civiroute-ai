const User = require('../models/user.model');
const Complaint = require('../models/complaint.model');

// @desc    Get all Supervisors under this DeptHead
// @route   GET /api/depthead/supervisors
exports.getSupervisors = async (req, res) => {
  try {
    // Get the logged-in DeptHead's details
    const deptHead = await User.findById(req.session.userId);
    
    // Fetch supervisors only in their exact State, City, and Department
    const supervisors = await User.find({
      role: 'Supervisor',
      state: deptHead.state,
      city: deptHead.city,
      department: deptHead.department
    }).select('-password');

    res.json(supervisors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new Supervisor (Auto-inherits location/dept)
// @route   POST /api/depthead/supervisors
exports.createSupervisor = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;
    const deptHead = await User.findById(req.session.userId);

    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) return res.status(400).json({ message: 'Supervisor already exists' });

    const newSupervisor = await User.create({
      name, email, mobile, password,
      role: 'Supervisor',
      state: deptHead.state,         // Auto-inherited
      city: deptHead.city,           // Auto-inherited
      pincode: deptHead.pincode,     // Auto-inherited
      department: deptHead.department // Auto-inherited
    });

    res.status(201).json({ message: 'Supervisor created successfully', user: newSupervisor });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all Complaints for this DeptHead's jurisdiction
// @route   GET /api/depthead/complaints
exports.getComplaints = async (req, res) => {
  try {
    const deptHead = await User.findById(req.session.userId);

    // AI already sets "assignedDepartment", we just filter by it and location
    const complaints = await Complaint.find({
      assignedDepartment: deptHead.department,
      state: deptHead.state,
      city: deptHead.city
    }).populate('assignedSupervisorId', 'name mobile').sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Assign a Complaint to a Supervisor
// @route   PATCH /api/depthead/complaints/assign
exports.assignComplaint = async (req, res) => {
  try {
    const { complaintId, supervisorId } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { assignedSupervisorId: supervisorId, status: 'Assigned' },
      { new: true }
    );

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint assigned successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Approve or Reject Resolution Proof
// @route   PATCH /api/depthead/complaints/approve
exports.approveResolution = async (req, res) => {
  try {
    const { complaintId, action } = req.body; // action should be 'Approve' or 'Reject'

    const newStatus = action === 'Approve' ? 'Resolved' : 'Assigned';
    
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status: newStatus },
      { new: true }
    );

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: `Complaint ${action}d successfully`, complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};