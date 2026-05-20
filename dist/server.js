"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// import http from "http";
// import app from "./app";
const db_1 = __importDefault(require("./config/db"));
// import { initializeSocket } from "./modules/chat/chat.socket";
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, db_1.default)();
        // ❌ VERCEL: HTTP server create করা লাগে না (only local server)
        // const server = http.createServer(app);
        // ❌ VERCEL: Socket.IO serverless এ কাজ করে না
        // initializeSocket(server);
        // ❌ VERCEL: server.listen() ব্যবহার করা যাবে না
        // server.listen(PORT, () =>
        //   console.log(`Server running on port ${PORT} 🚀`)
        // );
    }
    catch (error) {
        console.log("Failed to start server:", error);
    }
};
startServer();
