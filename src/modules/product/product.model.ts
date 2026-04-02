import mongoose, { Schema, Model } from "mongoose";
import { IProduct } from "./product.interface";

// 🔹 Model Type
type ProductModel = Model<IProduct>;

// 🔹 Variant Schema
const variantSchema = new Schema(
  {
    option: { type: String, required: true },
    values: { type: [String], required: true },
  },
  { _id: false },
);

// 🔹 Shipping Schema
const shippingSchema = new Schema(
  {
    isDigital: { type: Boolean, default: false },
    weight: Number,
    height: Number,
    length: Number,
  },
  { _id: false },
);

// 🔹 Main Product Schema
const productSchema = new Schema<IProduct, ProductModel>(
  {
    name: { type: String, required: true },
    category: String,
    tags: [String],
    description: String,

    status: {
      type: String,
      enum: ["Low Stock", "Published", "Draft", "Out of Stock"],
      default: "Draft",
    },

    images: [String],
    video: String,

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Boolean, default: false },

    // 🔥 SKU (auto generate hobe)
    sku: { type: String, unique: true, sparse: true },

    barcode: String,
    quantity: { type: Number, default: 0 },

    variants: [variantSchema],
    shipping: shippingSchema,

    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt auto
  },
);

//
export const Product = mongoose.model<IProduct, ProductModel>(
  "Product",
  productSchema,
);
