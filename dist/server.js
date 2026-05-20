"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const chat_socket_1 = require("./modules/chat/chat.socket");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, db_1.default)();
        // 🔥 HTTP server create
        const server = http_1.default.createServer(app_1.default);
        // 🔥 Socket initialize
        (0, chat_socket_1.initializeSocket)(server);
        // 🔥 Start server
        server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
    }
    catch (error) {
        console.log("Failed to start server:", error);
    }
};
startServer();
