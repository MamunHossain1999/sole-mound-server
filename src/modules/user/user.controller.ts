import { Request, Response } from "express";
import connectDB from "../../config/db";
import * as authService from "../auth/auth.service";
import { User } from "./user.model";
import { aw } from "react-router/dist/development/register-COAKzST_";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const user = await authService.updateProfile(req.user!.id, req.body);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get current logged-in user
export const getProfile = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await authService.getUserById(req.user.id);

    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get all users (admin only)
export const getUsers = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const users = await authService.getAllUsers();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ----------------------
// Update User Role
// ----------------------
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { role } = req.body;

    const updatedUser = await authService.updateUserRole(id, role); // ✅ service method
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ----------------------
// Delete User
// ----------------------
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const avatarUrl = req.file.path;

    // 👉 protect middleware থেকে user id ধরো
    const userId = (req as any).user.id;

    // ✅ DB update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};