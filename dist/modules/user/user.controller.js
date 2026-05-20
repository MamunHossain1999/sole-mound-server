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
exports.updateAvatar = exports.deleteUser = exports.updateUserRole = exports.getUserById = exports.getUsers = exports.getProfile = exports.updateProfile = void 0;
const db_1 = __importDefault(require("../../config/db"));
const authService = __importStar(require("../auth/auth.service"));
const user_model_1 = require("./user.model");
const updateProfile = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        const user = await authService.updateProfile(req.user.id, req.body);
        res.json(user);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateProfile = updateProfile;
// Get current logged-in user
const getProfile = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const user = await authService.getUserById(req.user.id);
        res.json(user);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getProfile = getProfile;
// Get all users (admin only)
const getUsers = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        const users = await authService.getAllUsers();
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getUsers = getUsers;
// profile details
const getUserById = async (req, res) => {
    try {
        await (0, db_1.default)();
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const user = await authService.getUserById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getUserById = getUserById;
// ----------------------
// Update User Role
// ----------------------
const updateUserRole = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { role } = req.body;
        const updatedUser = await authService.updateUserRole(id, role); // ✅ service method
        res.status(200).json({ success: true, user: updatedUser });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateUserRole = updateUserRole;
// ----------------------
// Delete User
// ----------------------
const deleteUser = async (req, res) => {
    try {
        await (0, db_1.default)(); // Ensure DB connection before querying
        const { id } = req.params;
        const user = await user_model_1.User.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteUser = deleteUser;
const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const avatarUrl = req.file.path;
        // 👉 protect middleware থেকে user id ধরো
        const userId = req.user.id;
        // ✅ DB update
        const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });
        return res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            data: updatedUser,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.updateAvatar = updateAvatar;
