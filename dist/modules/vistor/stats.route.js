"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stats_model_1 = __importDefault(require("./stats.model"));
const visitor_middleware_1 = require("../../middlewares/visitor.middleware");
const router = express_1.default.Router();
// ✅ VISIT + GET COUNT (same route)
router.get("/visitor", visitor_middleware_1.visitorMiddleware, async (req, res) => {
    try {
        let stats = await stats_model_1.default.findOne();
        if (!stats) {
            stats = await stats_model_1.default.create({ visitors: 0 });
        }
        res.json({
            success: true,
            visitors: stats.visitors,
        });
    }
    catch (error) {
        console.error("Visitor error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get visitors",
        });
    }
});
const statsRoute = router;
exports.default = statsRoute;
