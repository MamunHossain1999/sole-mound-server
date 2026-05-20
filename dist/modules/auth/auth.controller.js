"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.resetPassword = exports.forgotPassword = exports.resendOtp = exports.verifyOtp = exports.logout = exports.login = exports.register = void 0;
const authService = __importStar(require("./auth.service"));
const db_1 = __importDefault(require("../../config/db"));
const register = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        const { user, token } = await authService.registerUser(req.body);
        res.cookie("token", token, { httpOnly: true });
        res.status(201).json({
            message: "User registered. OTP sent to email",
            user,
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        const { user, token } = await authService.loginUser(req.body.email, req.body.password);
        // res.cookie("token", token, { httpOnly: true });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only HTTPS in prod
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.json(user);
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};
exports.logout = logout;
// VERIFY OTP
const verifyOtp = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        const { email, otp } = req.body;
        const user = await authService.verifyOtp(email, otp);
        res.json({
            message: "OTP verified successfully",
            user,
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.verifyOtp = verifyOtp;
// RESEND OTP
const resendOtp = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email is required" });
        const result = await authService.generateAndSendOtp(email);
        return res.json(result);
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: err.message || "Something went wrong" });
    }
};
exports.resendOtp = resendOtp;
const forgotPassword = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        await authService.forgotPasswordOTP(req.body.email);
        res.json({ message: "Email sent" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        const { email, otp, newPassword } = req.body;
        const user = await authService.resetPasswordOTP(email, otp, newPassword);
        res.json(user);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.resetPassword = resetPassword;
// verify user profile
const verifyToken = async (req, res) => {
    try {
        await (0, db_1.default)();
        const token = req.body.token || req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token" });
        }
        const user = await authService.verifyUserToken(token);
        return res.json({
            success: true,
            user,
        });
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};
exports.verifyToken = verifyToken;
