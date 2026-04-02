import { z } from "zod";

// Register Validation
export const registerSchema = z.object({
  // Customer এর জন্য name (required)
  // Seller এর জন্য firstName + lastName (required)
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),

  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().optional(),   // frontend validation এর জন্য

  role: z.enum(["customer", "seller", "admin", "both"]).default("customer"),

  // Seller specific fields
  phone: z.string().optional(),
  company: z.string().optional(),
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
    return (
      !!data.firstName?.trim() &&
      !!data.lastName?.trim() &&
      !!data.phone?.trim() &&
      !!data.company?.trim()
    );
  } else {
    // Customer / Admin হলে name required
    return !!data.name?.trim();
  }
}, {
  message: "Required fields are missing",
  path: ["name"],   // default path, refine-এর ভিতরে আরও স্পেসিফিক করা যায়
});


// Login Validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6),
});

// Forgot Password Validation
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Reset Password Validation
export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

// Update Profile Validation
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  avatar: z.string().url("Invalid image url").optional()
});
// -------------------------
// OTP Validation Schemas
// -------------------------
export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});
