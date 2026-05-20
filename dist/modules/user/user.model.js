"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
        required: function () {
            return this.role === "seller" || this.role === "both";
        },
    },
    company: {
        type: String,
        required: function () {
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
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
