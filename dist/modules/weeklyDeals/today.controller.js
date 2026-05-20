"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayDeals = exports.getWeeklyDeals = void 0;
const product_model_1 = require("../product/product.model");
// 🔥 Weekly Deals
const getWeeklyDeals = async (req, res) => {
    try {
        const now = new Date();
        const products = await product_model_1.Product.find({
            dealType: "weekly",
            endDate: { $gt: now },
        });
        res.json({
            success: true,
            data: products,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getWeeklyDeals = getWeeklyDeals;
// ⚡ Today Deals
const getTodayDeals = async (req, res) => {
    try {
        const now = new Date();
        const products = await product_model_1.Product.find({
            dealType: "today",
            endDate: { $gt: now },
        });
        res.json({
            success: true,
            data: products,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getTodayDeals = getTodayDeals;
