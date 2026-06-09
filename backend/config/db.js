const mongoose = require('mongoose');
 
const connectDB = async () => { 
  try {   
    console.log('Attempting to connect to MongoDB...');
    // console.log(`URI: ${process.env.MONGO_URI?.replace(/:.+@/, ':***@')}`); // Log URI without password
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) { 
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.error(`Error Code: ${error.code}`);
    process.exit(1);
  } 
}; 
  
module.exports = connectDB;      