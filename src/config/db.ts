import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB connected ✅");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

export default connectDB;