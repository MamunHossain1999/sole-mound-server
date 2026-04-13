import { Request, Response } from "express";
import { Product } from "../product/product.model";
import { IProduct } from "../product/product.interface";

// 🔥 Weekly Deals
export const getWeeklyDeals = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const products: IProduct[] = await Product.find({
      dealType: "weekly",
      endDate: { $gt: now },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ⚡ Today Deals
export const getTodayDeals = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const products: IProduct[] = await Product.find({
      dealType: "today",
      endDate: { $gt: now },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
