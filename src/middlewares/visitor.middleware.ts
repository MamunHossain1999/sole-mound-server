import { Request, Response, NextFunction } from "express";
import Stats from "../modules/vistor/stats.model";

export const visitorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ip = req.ip; // user IP
    

    // check already visited or not
    const exists = await Stats.findOne({
      visitedIPs: ip,
    });

    if (!exists) {
      await Stats.findOneAndUpdate(
        {},
        {
          $inc: { visitors: 1 },
          $addToSet: { visitedIPs: ip }, // duplicate prevent
        },
        {
          upsert: true,
          new: true,
        }
      );
    }

    next();
  } catch (error) {
    console.error("Visitor middleware error:", error);
    next();
  }
};