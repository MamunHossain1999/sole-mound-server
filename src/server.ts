import dotenv from "dotenv";
import http from "http";
import app from "./app";
import connectDB from "./config/db";
import { initializeSocket } from "./modules/chat/chat.socket";


dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // 🔥 HTTP server create
    const server = http.createServer(app);

    // 🔥 Socket initialize
    initializeSocket(server);

    // 🔥 Start server
    server.listen(PORT, () =>
      console.log(`Server running on port ${PORT} 🚀`)
    );
  } catch (error) {
    console.log("Failed to start server:", error);
  }
};

startServer();