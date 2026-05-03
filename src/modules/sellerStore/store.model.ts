import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // ================= BASIC STORE INFO =================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    shopCode: {
      type: String,
    },

    location: {
      type: String,
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
    },

    // ================= EXTRA INFO =================
    address: {
      type: String,
    },

    website: {
      type: String,
    },

    rating: {
      type: Number,
      default: 4.5,
    },

    reviews: {
      type: String,
      default: "0",
    },

    yearlyRevenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Store = mongoose.model("Store", storeSchema);