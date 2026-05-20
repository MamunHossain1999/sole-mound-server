"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWithdrawStatus = exports.getWithdraws = exports.createWithdraw = void 0;
const withdraw_model_1 = require("./withdraw.model");
const order_model_1 = require("../order/order.model");
// create withdhraw
const createWithdraw = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { amount } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount",
            });
        }
        // ✅ Calculate user balance (only paid + completed orders)
        const orders = await order_model_1.Order.find({
            userId,
            paymentStatus: "paid",
            status: "completed",
        });
        const totalIncome = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const withdrawals = await withdraw_model_1.Withdraw.find({ userId });
        const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);
        const availableBalance = totalIncome - totalWithdrawn;
        // ❗ Balance check
        if (amount > availableBalance) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
            });
        }
        const withdraw = await withdraw_model_1.Withdraw.create({
            userId,
            amount,
        });
        res.json({ success: true, data: withdraw });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.createWithdraw = createWithdraw;
// get withdraws
const getWithdraws = async (req, res) => {
    try {
        const userId = req.user?.id;
        const data = await withdraw_model_1.Withdraw.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.getWithdraws = getWithdraws;
// update withdraw
const updateWithdrawStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatus = ["pending", "approved", "rejected"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }
        const updated = await withdraw_model_1.Withdraw.findByIdAndUpdate(id, { status }, { new: true });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.updateWithdrawStatus = updateWithdrawStatus;
