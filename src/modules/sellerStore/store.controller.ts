import { Request, Response } from "express";
import mongoose from "mongoose";
import { Store } from "./store.model";
import { Product } from "../product/product.model";
import { Order } from "../order/order.model";

/* ================= STORE INFO ================= */
export const getStore = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const role = (req as any).user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (role !== "seller" && role !== "both") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can access store",
      });
    }

    const store = await Store.findOne({ userId });

    res.json({
      success: true,
      data: store || null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= SAVE STORE ================= */
export const saveStore = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const role = (req as any).user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (role !== "seller" && role !== "both") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can create store",
      });
    }

    const store = await Store.findOneAndUpdate(
      { userId },
      { ...req.body, userId },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    res.json({
      success: true,
      data: store,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= STORE STATS ================= */
export const getStoreStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const role = (req as any).user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (role !== "seller" && role !== "both") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can access stats",
      });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const stockAgg = await Product.aggregate([
      { $match: { sellerId: objectId } },
      {
        $group: {
          _id: null,
          itemsStock: { $sum: "$quantity" },
        },
      },
    ]);

    const itemsStock = stockAgg?.[0]?.itemsStock || 0;

    const salesAgg = await Order.aggregate([
      { $match: { userId: objectId } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
    ]);

    const revenue = salesAgg?.[0]?.revenue || 0;
    const sells = salesAgg?.[0]?.orders || 0;

    res.json({
      success: true,
      data: {
        itemsStock,
        sells,
        happyClient: sells,
        revenue,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};