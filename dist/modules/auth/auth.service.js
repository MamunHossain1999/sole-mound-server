"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserToken = exports.deleteUser = exports.updateUserRole = exports.getAllUsers = exports.getUserById = exports.updateProfile = exports.verifyOtp = exports.generateAndSendOtp = exports.resetPasswordOTP = exports.forgotPasswordOTP = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../user/user.model");
const generateToken_1 = require("../../utils/generateToken");
const sendEmail_1 = require("../../utils/sendEmail");
// ----------------------
// Register User
// ----------------------
const registerUser = async (data) => {
    let fullName = data.name;
    // seller/admin require first + last name + confirm password
    if (data.role === "seller" || data.role === "admin") {
        if (!data.firstName || !data.lastName) {
            throw new Error("First and Last name required for seller/admin");
        }
        fullName = `${data.firstName} ${data.lastName}`;
        // confirm password check only for seller/admin
        if (data.password !== data.confirmPassword) {
            throw new Error("Password and Confirm Password do not match");
        }
    }
    // hash password
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    // create user
    const user = await user_model_1.User.create({
        ...data,
        name: fullName,
        password: hashedPassword,
    });
    // generate JWT token
    const token = (0, generateToken_1.generateToken)({
        id: user._id.toString(),
        role: user.role,
    });
    return { user, token };
};
exports.registerUser = registerUser;
// ----------------------
// Login User
// ----------------------
const loginUser = async (email, password) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error("Invalid credentials");
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const token = (0, generateToken_1.generateToken)({
        id: user._id.toString(),
        role: user.role,
    });
    return { user, token };
};
exports.loginUser = loginUser;
// ----------------------
// Forgot Password OTP
// ----------------------
const forgotPasswordOTP = async (email) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await (0, sendEmail_1.sendEmail)(user.email, "Password Reset OTP", `Your OTP is ${otp}. It expires in 10 minutes.`);
    return { message: "OTP sent successfully" };
};
exports.forgotPasswordOTP = forgotPasswordOTP;
// ----------------------
// Reset Password using OTP
// ----------------------
const resetPasswordOTP = async (email, otp, newPassword) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    if (!user.otp || user.otp !== otp)
        throw new Error("Invalid OTP");
    if (!user.otpExpire || user.otpExpire < new Date())
        throw new Error("OTP expired");
    user.password = await bcryptjs_1.default.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    return { message: "Password reset successfully" };
};
exports.resetPasswordOTP = resetPasswordOTP;
// ----------------------
// Generate & Send OTP (Resend)
// ----------------------
const generateAndSendOtp = async (email) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    await user.save();
    const message = `Your OTP for password reset is ${otp}. It expires in 10 minutes.`;
    await (0, sendEmail_1.sendEmail)(user.email, "Password Reset OTP", message);
    return { message: "OTP sent successfully" };
};
exports.generateAndSendOtp = generateAndSendOtp;
// ----------------------
// Verify OTP
// ----------------------
const verifyOtp = async (email, otp) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    if (user.otp !== otp || !user.otpExpire || user.otpExpire < new Date()) {
        throw new Error("Invalid or expired OTP");
    }
    return { message: "OTP verified successfully", user };
};
exports.verifyOtp = verifyOtp;
// ----------------------
// Update Profile
// ----------------------
const updateProfile = async (userId, data) => {
    if (data.password) {
        data.password = await bcryptjs_1.default.hash(data.password, 10);
    }
    const user = await user_model_1.User.findByIdAndUpdate(userId, data, { new: true });
    if (!user)
        throw new Error("User not found");
    return user;
};
exports.updateProfile = updateProfile;
// ----------------------
// Get User
// ----------------------
const getUserById = async (userId) => {
    const user = await user_model_1.User.findById(userId).select("-password");
    if (!user)
        throw new Error("User not found");
    return user;
};
exports.getUserById = getUserById;
// ----------------------
// Get All Users
// ----------------------
const getAllUsers = async () => {
    return await user_model_1.User.find().select("-password");
};
exports.getAllUsers = getAllUsers;
// ----------------------
// Update User Role
// ----------------------
const updateUserRole = async (id, role) => {
    const user = await user_model_1.User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    if (!user)
        throw new Error("User not found");
    return user;
};
exports.updateUserRole = updateUserRole;
// ----------------------
// Delete User
// ----------------------
const deleteUser = async (id) => {
    const user = await user_model_1.User.findByIdAndDelete(id);
    if (!user)
        throw new Error("User not found");
    return user;
};
exports.deleteUser = deleteUser;
// ----------------------
// Verify User Token
// ----------------------
const verifyUserToken = async (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = await user_model_1.User.findById(decoded.id).select("-password");
    if (!user)
        throw new Error("User not found");
    return user;
};
exports.verifyUserToken = verifyUserToken;
