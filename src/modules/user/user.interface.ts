type UserRole = "customer" | "seller" | "admin" | "both";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;

  // optional by default
  phone?: string;
  company?: string;

  avatar?: string;

  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  otp?: string;
  otpExpire?: Date;
}

