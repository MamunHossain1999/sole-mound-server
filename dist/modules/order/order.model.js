"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/* =========================
   ORDER PRODUCT
========================= */
const orderProductSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    name: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    sku: {
        type: String,
        default: "",
    },
}, { _id: false });
/* =========================
   ADDRESS SCHEMA
========================= */
const addressSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "Bangladesh" },
}, { _id: false });
/* =========================
   ORDER SCHEMA (FINAL FIXED)
========================= */
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    products: {
        type: [orderProductSchema],
        required: true,
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: "At least one product is required",
        },
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["pending", "processing", "completed", "cancelled"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "failed"],
        default: "unpaid",
    },
    paymentMethod: {
        type: String,
        enum: ["stripe", "sslcommerz", "cash"],
        default: "stripe",
    },
    transactionId: {
        type: String,
        default: null,
    },
    comment: {
        type: String,
        default: "",
    },
    shippingAddress: {
        type: addressSchema,
        required: true,
    },
    billingAddress: {
        type: addressSchema,
        required: false,
    },
    shippingMethod: {
        type: String,
        enum: ["standard", "express", "pickup"],
        default: "standard",
    },
    /* =========================
       RETURN SYSTEM
    ========================= */
    returnStatus: {
        type: String,
        enum: ["none", "requested", "approved", "rejected", "returned"],
        default: "none",
    },
    returnReason: {
        type: String,
        default: "",
    },
    returnRequestedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Order = mongoose_1.default.model("Order", orderSchema);
