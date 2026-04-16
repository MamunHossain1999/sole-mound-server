import mongoose, { Schema, Model } from "mongoose";
import { IOrder } from "./order.interface";

type OrderModel = Model<IOrder>;

/* =========================
   ORDER PRODUCT
========================= */
const orderProductSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
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
  },
  { _id: false }
);

/* =========================
   ADDRESS BASE SCHEMA
========================= */
const addressSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },

    city: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "Bangladesh" },
  },
  { _id: false }
);

/* =========================
   ORDER SCHEMA
========================= */
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    products: {
      type: [orderProductSchema],
      required: true,
      validate: {
        validator: (v: any[]) => Array.isArray(v) && v.length > 0,
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

    shippingAddress: {
      type: addressSchema,
      required: true,
    },

    billingAddress: {
      type: addressSchema,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Order = mongoose.model<IOrder, OrderModel>(
  "Order",
  orderSchema
);