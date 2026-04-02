import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },

    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },

    password: { 
      type: String, 
      required: true,
      minlength: 6 
    },

    role: { 
      type: String, 
      enum: ["customer", "seller", "admin", "both"], 
      default: "customer" 
    },

    // ✅ seller + admin required
 phone: {
  type: String,
  required: function (this: IUser) {
    return this.role === "seller" || this.role === "both";
  },
},

company: {
  type: String,
  required: function (this: IUser) {
    return this.role === "seller" || this.role === "both";
  },
},

    avatar: {
      type: String,
      default: "",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    otp: String,
    otpExpire: Date,
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);