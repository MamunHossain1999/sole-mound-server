import { Request, Response } from "express";
import * as authService from "./auth.service";
import connectDB from "../../config/db";

export const register = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const { user, token } = await authService.registerUser(req.body);

    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({
      message: "User registered. OTP sent to email",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const { user, token } = await authService.loginUser(
      req.body.email,
      req.body.password,
    );

    // res.cookie("token", token, { httpOnly: true });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
   
    });

    res.json(user);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

// VERIFY OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const { email, otp } = req.body;

    const user = await authService.verifyOtp(email, otp);

    res.json({
      message: "OTP verified successfully",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// RESEND OTP
export const resendOtp = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const result = await authService.generateAndSendOtp(email);
    return res.json(result);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: err.message || "Something went wrong" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    await authService.forgotPasswordOTP(req.body.email);
    res.json({ message: "Email sent" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    await connectDB(); // Ensure DB connection before querying
    const { email, otp, newPassword } = req.body;

    const user = await authService.resetPasswordOTP(email, otp, newPassword);

    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// verify user profile
export const verifyToken = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const token = req.body.token || req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const user = await authService.verifyUserToken(token);

    return res.json({
      success: true,
      user,
    });
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};