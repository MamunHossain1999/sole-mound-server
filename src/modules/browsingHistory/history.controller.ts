import { Request, Response } from "express";
import { History } from "./history.model";

/* =========================
   🔥 Add to History (UPSERT)
========================= */
export const addToHistory = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    await History.updateOne(
      { user: req.user.id, product: productId },
      {
        $set: { viewedAt: new Date() },
        $setOnInsert: {
          user: req.user.id,
          product: productId,
        },
      },
      { upsert: true }
    );

    return res.status(201).json({
      success: true,
      message: "History saved",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   🔥 Get History
========================= */
export const getHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const history = await History.find({ user: req.user.id })
      .populate("product", "name images price")
      .sort({ viewedAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   🔥 Delete Single Item
========================= */
export const deleteHistoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await History.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "History not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "History item deleted",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   🔥 Clear All History
========================= */
export const clearHistory = async (req: Request, res: Response) => {
  try {
    await History.deleteMany({ user: req.user.id });

    return res.status(200).json({
      success: true,
      message: "All history cleared",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};