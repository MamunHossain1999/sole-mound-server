import jwt from "jsonwebtoken";
import { IUser } from "../modules/user/user.interface";




export const generateToken = (payload: IUser) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};
