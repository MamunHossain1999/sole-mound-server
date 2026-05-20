"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitorMiddleware = void 0;
const stats_model_1 = __importDefault(require("../modules/vistor/stats.model"));
const visitorMiddleware = async (req, res, next) => {
    try {
        const ip = req.ip; // user IP
        // check already visited or not
        const exists = await stats_model_1.default.findOne({
            visitedIPs: ip,
        });
        if (!exists) {
            await stats_model_1.default.findOneAndUpdate({}, {
                $inc: { visitors: 1 },
                $addToSet: { visitedIPs: ip }, // duplicate prevent
            }, {
                upsert: true,
                new: true,
            });
        }
        next();
    }
    catch (error) {
        console.error("Visitor middleware error:", error);
        next();
    }
};
exports.visitorMiddleware = visitorMiddleware;
