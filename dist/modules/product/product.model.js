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
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// ========================
// Variant Schema
// ========================
const variantSchema = new mongoose_1.Schema({
    option: { type: String, required: true },
    values: { type: [String], required: true },
}, { _id: false });
// ========================
// Shipping Schema
// ========================
const shippingSchema = new mongoose_1.Schema({
    isDigital: { type: Boolean, default: false },
    weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
}, { _id: false });
// ========================
// MAIN PRODUCT SCHEMA
// ========================
const productSchema = new mongoose_1.Schema({
    // ========================
    // BASIC INFO
    // ========================
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true }, // ✅ FIXED
    categoryStatus: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        index: true,
    },
    tags: { type: [String], default: [] },
    description: { type: String, default: "" },
    status: {
        type: String,
        enum: ["Low Stock", "Published", "Draft", "Out of Stock"],
        default: "Draft",
        index: true,
    },
    images: { type: [String], default: [] },
    video: { type: String, default: "" },
    isBestSeller: {
        type: Boolean,
        default: false,
    },
    // ========================
    // PRICE INFO
    // ========================
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Boolean, default: false },
    // ========================
    // DEAL SYSTEM
    // ========================
    dealType: {
        type: String,
        enum: ["weekly", "today", "none"],
        default: "none",
        index: true,
    },
    label: {
        type: String,
        enum: ["hot", "new", "sale", "sold out", "none"],
        default: "none",
        index: true,
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    // ========================
    // BRAND / INVENTORY
    // ========================
    brand: { type: String, default: "", index: true },
    sku: { type: String, unique: true, sparse: true },
    barcode: { type: String, default: "" },
    quantity: { type: Number, default: 0, min: 0 },
    // ========================
    // VARIANTS & SHIPPING
    // ========================
    variants: { type: [variantSchema], default: [] },
    shipping: { type: shippingSchema, default: undefined }, // ✅ FIXED
    // ========================
    // SELLER
    // ========================
    sellerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    // ========================
    // RATINGS
    // ========================
    ratingsAverage: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    ratingsCount: {
        type: Number,
        default: 0,
    },
    // ========================
    // ANALYTICS
    // ========================
    views: {
        type: Number,
        default: 0,
        min: 0,
    },
    salesCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    wishlistCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    trendingScore: {
        type: Number,
        default: 0,
        index: true,
    },
}, {
    timestamps: true,
});
// ========================
// INDEX
// ========================
productSchema.index({
    trendingScore: -1,
    salesCount: -1,
    views: -1,
    wishlistCount: -1,
});
exports.Product = mongoose_1.default.model("Product", productSchema);
