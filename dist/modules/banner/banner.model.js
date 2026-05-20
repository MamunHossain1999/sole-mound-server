"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bannerSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    description: {
        type: String,
    },
}, { timestamps: true });
exports.Banner = mongoose_1.default.model("Banner", bannerSchema);
