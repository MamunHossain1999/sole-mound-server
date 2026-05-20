import mongoose, { Schema } from "mongoose";

const bankSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bankName: String,
    accountNumber: String,
    swiftCode: String,
    country: String,
    accountName: String,
    email: String,
  },
  { timestamps: true }
);

export const Bank = mongoose.model("Bank", bankSchema);