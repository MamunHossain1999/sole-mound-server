"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const storeSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    // ================= BASIC STORE INFO =================
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
    },
    shopCode: {
        type: String,
    },
    location: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    // ================= EXTRA INFO =================
    address: {
        type: String,
    },
    website: {
        type: String,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    reviews: {
        type: String,
        default: "0",
    },
    yearlyRevenue: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
exports.Store = mongoose_1.default.model("Store", storeSchema);
