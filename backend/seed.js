const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/user.model');
const connectDB = require('./config/db');

const seedSuperAdmin = async () => {
  try {
    await connectDB(); // Database se connect karo

    // Check if SuperAdmin already exists
    const adminExists = await User.findOne({ role: 'SuperAdmin' });

    if (adminExists) {
      console.log('⚠️ SuperAdmin account already exists. Skipping...');
      process.exit();
    }

    // Create SuperAdmin with your specified credentials
    const superAdmin = await User.create({
      name: 'System Administrator',
      email: 'adminciviroute@civiroute.com', // Using email field as the username for SuperAdmin
      mobile: '0000000000', // Dummy mobile
      password: 'Admin@civiroute123',
      role: 'SuperAdmin',
      state: 'Global',
      city: 'Global',
      pincode: '000000'
    });

    console.log('✅ SuperAdmin account seeded successfully!');
    console.log(`Username (Email): ${superAdmin.email}`);
    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding SuperAdmin: ${error.message}`);
    process.exit(1);
  }
};

seedSuperAdmin();