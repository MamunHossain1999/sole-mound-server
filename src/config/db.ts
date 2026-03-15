import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    // Connection reuse
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI!);
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

export default connectDB;