"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const statsSchema = new mongoose_1.default.Schema({
    visitors: { type: Number, default: 0 },
    visitedIPs: [{ type: String }],
}, { timestamps: true });
const Stats = mongoose_1.default.model("Stats", statsSchema);
exports.default = Stats;
