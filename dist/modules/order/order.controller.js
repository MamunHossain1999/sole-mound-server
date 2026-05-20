"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestReturnOrder = exports.deleteOrder = exports.updatePaymentStatus = exports.updateOrderStatus = exports.updateOrderComment = exports.getOrderById = exports.getAllOrders = exports.createOrder = void 0;
const order_model_1 = require("./order.model");
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = require("../product/product.model");
/* =========================
   CREATE ORDER
========================= */
const createOrder = async (req, res) => {
    try {
        console.log("🔥 CREATE ORDER HIT");
        const userId = req.user?.id;
        const { products, totalAmount, shippingAddress, shippingMethod } = req.body;
        // ================= VALIDATION =================
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!products?.length || !Array.isArray(products)) {
            return res.status(400).json({
                success: false,
                message: "Products required",
            });
        }
        // ================= FETCH PRODUCTS ONCE (IMPORTANT FIX) =================
        const productIds = products.map((p) => p.productId);
        const dbProducts = await product_model_1.Product.find({
            _id: { $in: productIds },
        });
        const productMap = new Map();
        dbProducts.forEach((p) => {
            productMap.set(p._id.toString(), p);
        });
        const formattedProducts = [];
        // ================= STOCK CHECK + FORMAT =================
        for (const item of products) {
            const product = productMap.get(item.productId.toString());
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`,
                });
            }
            const currentQty = product.quantity ?? 0;
            console.log(`📦 Stock check: ${product.name} | DB: ${currentQty} | Order: ${item.quantity}`);
            if (currentQty < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Out of stock for ${product.name}`,
                });
            }
            // reduce stock
            product.quantity = currentQty - item.quantity;
            // format product (ONLY DB DATA → NO fallback bug)
            formattedProducts.push({
                productId: product._id,
                name: product.name,
                image: product.images?.[0] || "",
                price: product.price,
                quantity: item.quantity,
                sku: product.sku || "",
            });
        }
        // ================= SAVE STOCK ONCE (OPTIMIZED) =================
        await Promise.all(dbProducts.map((p) => p.save()));
        // ================= CREATE ORDER =================
        const order = await order_model_1.Order.create({
            userId,
            products: formattedProducts,
            totalAmount,
            shippingAddress,
            shippingMethod,
            status: "pending",
            paymentStatus: "unpaid",
            returnStatus: "none",
        });
        console.log("🎉 ORDER CREATED:", order._id);
        return res.status(201).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        console.error("🔥 ORDER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.createOrder = createOrder;
/* =========================
   GET ALL ORDERS (ONLY USER)
========================= */
const getAllOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        // query থেকে page + limit নাও
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        // total count (pagination এর জন্য দরকার)
        const total = await order_model_1.Order.countDocuments({ userId });
        const orders = await order_model_1.Order.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllOrders = getAllOrders;
/* =========================
   GET SINGLE ORDER (SECURE)
========================= */
const getOrderById = async (req, res) => {
    try {
        const userId = req.user?.id;
        // ✅ fix id properly
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0] : rawId;
        // 🔐 auth check
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        // 🛑 id validation
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Order ID",
            });
        }
        // 🔐 secure query (user-specific)
        const order = await order_model_1.Order.findOne({
            _id: id,
            userId,
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        console.error("🔥 GET ORDER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getOrderById = getOrderById;
// update order comment
const updateOrderComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Order id required",
            });
        }
        const order = await order_model_1.Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        order.comment = comment;
        await order.save();
        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: order,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateOrderComment = updateOrderComment;
/* =========================
   UPDATE ORDER STATUS (SECURE)
========================= */
const updateOrderStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const rawId = req.params.id;
        const orderId = Array.isArray(rawId) ? rawId[0] : rawId;
        const { status } = req.body;
        const validStatuses = [
            "pending",
            "payment",
            "processing",
            "on_the_way",
            "pickup",
            "completed",
            "cancelled",
        ];
        // ================= AUTH CHECK =================
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        // ================= ID CHECK =================
        if (!orderId || !mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }
        // ================= STATUS CHECK =================
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }
        // ================= GET ORDER =================
        const existingOrder = await order_model_1.Order.findOne({
            _id: orderId,
            userId,
        });
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        // ================= BUSINESS RULE =================
        if (existingOrder.status === "processing" && status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Processing order cannot be cancelled",
            });
        }
        if (existingOrder.status === "completed" && status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Completed order cannot be cancelled",
            });
        }
        // ================= STOCK RESTORE (🔥 IMPORTANT) =================
        if (status === "cancelled" && existingOrder.status !== "cancelled") {
            for (const item of existingOrder.products) {
                await product_model_1.Product.findByIdAndUpdate(item.productId, {
                    $inc: { quantity: item.quantity },
                });
            }
        }
        // ================= UPDATE ORDER =================
        const updatedOrder = await order_model_1.Order.findOneAndUpdate({ _id: orderId, userId }, { status }, { new: true });
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder,
        });
    }
    catch (error) {
        console.error("🔥 UPDATE ORDER STATUS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
/* =========================
   UPDATE PAYMENT STATUS (SECURE)
========================= */
const updatePaymentStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { paymentStatus, transactionId } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const order = await order_model_1.Order.findOneAndUpdate({ _id: req.params.id, userId }, // 🔥 SECURITY
        {
            paymentStatus,
            transactionId,
            status: paymentStatus === "paid"
                ? "processing"
                : paymentStatus === "failed"
                    ? "cancelled"
                    : "pending",
        }, { new: true });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Payment updated",
            data: order,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updatePaymentStatus = updatePaymentStatus;
/* =========================
   DELETE ORDER (SECURE)
========================= */
const deleteOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const order = await order_model_1.Order.findOneAndDelete({
            _id: req.params.id,
            userId, // 🔥 SECURITY
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Order deleted",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteOrder = deleteOrder;
/* =========================
   RETURN ORDER (SECURE)
========================= */
const requestReturnOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { returnId } = req.params;
        const { reason } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const order = await order_model_1.Order.findOne({
            _id: returnId,
            userId, // 🔥 SECURITY
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        if (order.returnStatus !== "none") {
            return res.status(400).json({
                success: false,
                message: "Return already requested",
            });
        }
        order.returnStatus = "requested";
        order.returnReason = reason;
        order.returnRequestedAt = new Date();
        await order.save();
        return res.status(200).json({
            success: true,
            message: "Return requested",
            data: order,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.requestReturnOrder = requestReturnOrder;
