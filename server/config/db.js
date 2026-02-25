const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log("Make sure MongoDB is running locally. If you don't have it installed, use Atlas URI or install MongoDB Community Server.");
    // allowing app to run even if db fails for dev purposes (so user can see logs)
    // process.exit(1); 
  }
};

module.exports = connectDB;
