import bcrypt from "bcryptjs";
import { User } from "../user/user.model";
import { IUser } from "../user/user.interface";
import { generateToken } from "../../utils/generateToken";
import { sendEmail } from "../../utils/sendEmail";


// ----------------------
// Register User
// ----------------------
export const registerUser = async (data: IUser) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
  });

  return { user, token };
};

// ----------------------
// Login User
// ----------------------
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken({
    id: user._id.toString(),
    role: user.role,
  });

  return { user, token };
};

// ----------------------
// Send OTP (Forgot Password)
// ----------------------
export const forgotPasswordOTP = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
  user.otp = otp;

  await user.save();

  const message = `Your OTP for password reset is ${otp}. It expires in 10 minutes`;

  await sendEmail(user.email, "Password Reset OTP", message);

  return {
    message: "OTP sent to email",
  };
};

// ----------------------
// Reset Password using OTP
// ----------------------
export const resetPasswordOTP = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  if (!user.otp || user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (!user.otpExpire || user.otpExpire < new Date()) {
    throw new Error("OTP expired");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  // Clear OTP fields
  user.otp = undefined;
  user.otpExpire = undefined;

  await user.save();

  return {
    message: "Password reset successfully",
  };
};

// ----------------------
// Verify OTP
// ----------------------
export const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (user.otp !== otp || !user.otpExpire || user.otpExpire < new Date()) {
    throw new Error("Invalid or expired OTP");
  }

  return { message: "OTP verified successfully", user };
};
// ----------------------
// Resend OTP
// ----------------------
export const generateAndSendOtp = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
  await user.save();

  const message = `Your OTP for password reset is ${otp}. It expires in 10 minutes.`;

  await sendEmail(user.email, "Password Reset OTP", message);

  return { message: "OTP sent successfully" };
};
// ----------------------
// Update Profile
// ----------------------
export const updateProfile = async (userId: string, data: Partial<IUser>) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
  });

  return user;
};

// ----------------------
// Get User
// ----------------------
export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) throw new Error("User not found");

  return user;
};
// ----------------------
// Get All Users
// ----------------------
export const getAllUsers = async () => {
  const users = await User.find().select("-password");

  return users;
};



// ----------------------
// Update User Role
// ----------------------
export const updateUserRole = async (id: string, role: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  ).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};


// ----------------------
// Delete User
// ----------------------
export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return user;
};