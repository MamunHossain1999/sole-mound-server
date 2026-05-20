"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false;
const connectDB = async () => {
    if (isConnected) {
        // Connection reuse
        return;
    }
    try {
        const db = await mongoose_1.default.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB connected");
    }
    catch (error) {
        console.log("MongoDB connection error:", error);
    }
};
exports.default = connectDB;
