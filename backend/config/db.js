const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("⚠️ Database connection failed:", error.message);
    console.log("ℹ️ Running in resilient fallback mode.");
  }
};

module.exports = connectDB;
