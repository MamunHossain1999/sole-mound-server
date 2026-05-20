import mongoose, { Schema, Model } from "mongoose";
import { IProduct } from "./product.interface";

type ProductModel = Model<IProduct>;

// ========================
// Variant Schema
// ========================
const variantSchema = new Schema(
  {
    option: { type: String, required: true },
    values: { type: [String], required: true },
  },
  { _id: false }
);

// ========================
// Shipping Schema
// ========================
const shippingSchema = new Schema(
  {
    isDigital: { type: Boolean, default: false },
    weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
  },
  { _id: false }
);

// ========================
// MAIN PRODUCT SCHEMA
// ========================
const productSchema = new Schema<IProduct, ProductModel>(
  {
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
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

// ========================
// INDEX
// ========================
productSchema.index({
  trendingScore: -1,
  salesCount: -1,
  views: -1,
  wishlistCount: -1,
});

export const Product = mongoose.model<IProduct, ProductModel>(
  "Product",
  productSchema
);