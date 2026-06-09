const User = require('../models/user.model');
 
// @desc    Register a new Citizen
// @route   POST /api/auth/register
exports.registerCitizen = async (req, res) => { 
  try {
    const { name, mobile, email, address, state, city, pincode, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or mobile already exists' });
    }

    const user = await User.create({
      name, mobile, email, address, state, city, pincode, password,
      role: 'Citizen' // Strictly locked to Citizen from this open endpoint
    });

    req.session.userId = user._id;
    req.session.role = user.role;

    res.status(201).json({ message: 'Citizen registered successfully', user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Universal Login for all roles
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check by email or mobile
    const user = await User.findOne({ 
      $or: [{ email: username }, { mobile: username }],
      role: role // Security: Ensure they are logging into the correct portal
    });

    if (user && (await user.matchPassword(password))) {
      // Set Session
      req.session.userId = user._id;
      req.session.role = user.role;

      res.json({ message: 'Login successful', user: { id: user._id, name: user.name, role: user.role, state: user.state, city: user.city, department: user.department } });
    } else {
      res.status(401).json({ message: 'Invalid credentials or incorrect role portal' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Could not log out' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

// @desc    Get current logged in user (Check session)
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};