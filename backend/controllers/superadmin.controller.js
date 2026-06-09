const User = require('../models/user.model');

// @desc    Get all Department Heads
// @route   GET /api/superadmin/departments
exports.getDepartments = async (req, res) => {
  try {
    const deptHeads = await User.find({ role: 'DeptHead' }).select('-password');
    res.json(deptHeads);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new Department Head
// @route   POST /api/superadmin/departments
exports.createDeptHead = async (req, res) => {
  try {
    // 👉 CHANGE 1: Added password in destructuring from req.body
    const { state, city, pincode, deptName, headName, mobile, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // 👉 CHANGE 2: Removed hardcoded defaultPassword. Passing dynamic password from frontend.
    const newDeptHead = await User.create({
      name: headName,
      email,
      mobile,
      password: password, 
      role: 'DeptHead',
      state,
      city,
      pincode,
      department: deptName
    });

    res.status(201).json({ 
      message: 'Department Head onboarded successfully', 
      user: { id: newDeptHead._id, name: newDeptHead.name, department: newDeptHead.department } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a Department Head
// @route   DELETE /api/superadmin/departments/:id
exports.deleteDepartment = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'DeptHead') {
      return res.status(404).json({ message: 'Department Head not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department Head account removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};