import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();

// 🔹 Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // server start হওয়ার আগে DB connect
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log("Failed to start server:", error);
  }
};

startServer();
