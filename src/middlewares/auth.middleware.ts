import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser} from "../modules/user/user.interface";



export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
