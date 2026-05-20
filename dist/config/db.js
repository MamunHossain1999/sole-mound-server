"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            console.log("MongoDB already connected");
            return;
        }
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("MongoDB connected ✅");
    }
    catch (error) {
        console.log("MongoDB connection error:", error);
    }
};
exports.default = connectDB;
