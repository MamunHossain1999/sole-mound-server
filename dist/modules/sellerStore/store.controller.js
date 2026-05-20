"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreStats = exports.saveStore = exports.getStore = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const store_model_1 = require("./store.model");
const product_model_1 = require("../product/product.model");
const order_model_1 = require("../order/order.model");
/* ================= STORE INFO ================= */
const getStore = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user",
            });
        }
        if (role !== "seller" && role !== "both") {
            return res.status(403).json({
                success: false,
                message: "Only sellers can access store",
            });
        }
        const store = await store_model_1.Store.findOne({ userId });
        res.json({
            success: true,
            data: store || null,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getStore = getStore;
/* ================= SAVE STORE ================= */
const saveStore = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user",
            });
        }
        if (role !== "seller" && role !== "both") {
            return res.status(403).json({
                success: false,
                message: "Only sellers can create store",
            });
        }
        const store = await store_model_1.Store.findOneAndUpdate({ userId }, { ...req.body, userId }, {
            returnDocument: "after",
            upsert: true,
        });
        res.json({
            success: true,
            data: store,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.saveStore = saveStore;
/* ================= STORE STATS ================= */
const getStoreStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user",
            });
        }
        if (role !== "seller" && role !== "both") {
            return res.status(403).json({
                success: false,
                message: "Only sellers can access stats",
            });
        }
        const objectId = new mongoose_1.default.Types.ObjectId(userId);
        const stockAgg = await product_model_1.Product.aggregate([
            { $match: { sellerId: objectId } },
            {
                $group: {
                    _id: null,
                    itemsStock: { $sum: "$quantity" },
                },
            },
        ]);
        const itemsStock = stockAgg?.[0]?.itemsStock || 0;
        const salesAgg = await order_model_1.Order.aggregate([
            { $match: { userId: objectId } },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$totalAmount" },
                    orders: { $sum: 1 },
                },
            },
        ]);
        const revenue = salesAgg?.[0]?.revenue || 0;
        const sells = salesAgg?.[0]?.orders || 0;
        res.json({
            success: true,
            data: {
                itemsStock,
                sells,
                happyClient: sells,
                revenue,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getStoreStats = getStoreStats;
