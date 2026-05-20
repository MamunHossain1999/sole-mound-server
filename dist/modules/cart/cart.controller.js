"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartQuantity = exports.getCart = exports.addToCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_model_1 = require("./cart.model");
// =========================
// 🔥 ADD TO CART
// =========================
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, discount = 0 } = req.body;
        if (!productId || !mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Valid Product ID required",
            });
        }
        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }
        let cart = await cart_model_1.Cart.findOne({ user: req.user.id });
        // 🆕 create cart
        if (!cart) {
            cart = await cart_model_1.Cart.create({
                user: req.user.id,
                items: [{ product: productId, quantity, discount }],
            });
            return res.status(201).json({
                success: true,
                data: cart,
            });
        }
        // 🔍 check existing item
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.items.push({
                product: productId,
                quantity,
                discount,
            });
        }
        await cart.save();
        return res.status(200).json({
            success: true,
            message: "Cart updated",
            data: cart,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.addToCart = addToCart;
// =========================
// 🔥 GET CART
// =========================
const getCart = async (req, res) => {
    try {
        const cart = await cart_model_1.Cart.findOne({ user: req.user.id }).populate("items.product");
        if (!cart) {
            return res.status(200).json({
                success: true,
                data: { items: [] },
            });
        }
        // 🧹 filter null products
        const filteredItems = cart.items.filter((item) => item.product !== null);
        return res.status(200).json({
            success: true,
            data: { ...cart.toObject(), items: filteredItems },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getCart = getCart;
// =========================
// 🔥 UPDATE QUANTITY
// =========================
const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Valid Product ID required",
            });
        }
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }
        const cart = await cart_model_1.Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }
        const item = cart.items.find((i) => i.product.toString() === productId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }
        item.quantity = quantity;
        await cart.save();
        return res.status(200).json({
            success: true,
            message: "Quantity updated",
            data: cart,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateCartQuantity = updateCartQuantity;
// =========================
// 🔥 REMOVE SINGLE ITEM
// =========================
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId || !mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Valid Product ID required",
            });
        }
        const cart = await cart_model_1.Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        return res.status(200).json({
            success: true,
            message: "Item removed",
            data: cart,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.removeFromCart = removeFromCart;
// =========================
// 🔥 CLEAR CART
// =========================
const clearCart = async (req, res) => {
    try {
        const cart = await cart_model_1.Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }
        cart.items = [];
        await cart.save();
        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: cart,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.clearCart = clearCart;
