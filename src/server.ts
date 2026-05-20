import dotenv from "dotenv";
// import http from "http";
// import app from "./app";
import connectDB from "./config/db";
// import { initializeSocket } from "./modules/chat/chat.socket";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // ❌ VERCEL: HTTP server create করা লাগে না (only local server)
    // const server = http.createServer(app);

    // ❌ VERCEL: Socket.IO serverless এ কাজ করে না
    // initializeSocket(server);

    // ❌ VERCEL: server.listen() ব্যবহার করা যাবে না
    // server.listen(PORT, () =>
    //   console.log(`Server running on port ${PORT} 🚀`)
    // );

  } catch (error) {
    console.log("Failed to start server:", error);
  }
};

startServer();