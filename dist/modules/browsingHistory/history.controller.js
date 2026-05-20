"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearHistory = exports.deleteHistoryItem = exports.getHistory = exports.addToHistory = void 0;
const history_model_1 = require("./history.model");
/* =========================
   🔥 Add to History (UPSERT)
========================= */
const addToHistory = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID required",
            });
        }
        await history_model_1.History.updateOne({ user: req.user.id, product: productId }, {
            $set: { viewedAt: new Date() },
            $setOnInsert: {
                user: req.user.id,
                product: productId,
            },
        }, { upsert: true });
        return res.status(201).json({
            success: true,
            message: "History saved",
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.addToHistory = addToHistory;
/* =========================
   🔥 Get History
========================= */
const getHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const history = await history_model_1.History.find({ user: req.user.id })
            .populate("product", "name images price")
            .sort({ viewedAt: -1 })
            .limit(10);
        return res.status(200).json({
            success: true,
            data: history,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.getHistory = getHistory;
/* =========================
   🔥 Delete Single Item
========================= */
const deleteHistoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await history_model_1.History.findOneAndDelete({
            _id: id,
            user: req.user.id,
        });
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "History not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "History item deleted",
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.deleteHistoryItem = deleteHistoryItem;
/* =========================
   🔥 Clear All History
========================= */
const clearHistory = async (req, res) => {
    try {
        await history_model_1.History.deleteMany({ user: req.user.id });
        return res.status(200).json({
            success: true,
            message: "All history cleared",
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.clearHistory = clearHistory;
