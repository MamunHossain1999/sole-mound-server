"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtpSchema = exports.verifyOtpSchema = exports.updateProfileSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// Register Validation
exports.registerSchema = zod_1.z.object({
    // Customer এর জন্য name (required)
    // Seller এর জন্য firstName + lastName (required)
    name: zod_1.z.string().min(3, "Name must be at least 3 characters").optional(),
    firstName: zod_1.z.string().min(1, "First name is required").optional(),
    lastName: zod_1.z.string().min(1, "Last name is required").optional(),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod_1.z.string().optional(), // frontend validation এর জন্য
    role: zod_1.z.enum(["customer", "seller", "admin", "both"]).default("customer"),
    // Seller specific fields
    phone: zod_1.z.string().optional(),
    company: zod_1.z.string().optional(),
})
    // Password match validation
    .refine((data) => {
    if (data.confirmPassword) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})
    // Conditional validation for Seller/Both
    .refine((data) => {
    const isSeller = data.role === "seller" || data.role === "both";
    if (isSeller) {
        // Seller হলে firstName, lastName, phone, company সব required
        return (!!data.firstName?.trim() &&
            !!data.lastName?.trim() &&
            !!data.phone?.trim() &&
            !!data.company?.trim());
    }
    else {
        // Customer / Admin হলে name required
        return !!data.name?.trim();
    }
}, {
    message: "Required fields are missing",
    path: ["name"], // default path, refine-এর ভিতরে আরও স্পেসিফিক করা যায়
});
// Login Validation
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6),
});
// Forgot Password Validation
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
// Reset Password Validation
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
    newPassword: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
// Update Profile Validation
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must be at least 3 characters").optional(),
    email: zod_1.z.string().email("Invalid email address").optional(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters").optional(),
    avatar: zod_1.z.string().url("Invalid image url").optional()
});
// -------------------------
// OTP Validation Schemas
// -------------------------
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
});
exports.resendOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
