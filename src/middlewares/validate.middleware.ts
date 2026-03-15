import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape, ZodError } from "zod";

export const validate = (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const errorMessage = err.issues[0]?.message || "Validation Error";
        res.status(400).json({ message: errorMessage });
      } else {
        res.status(400).json({ message: "Validation Error" });
      }
    }
  };
