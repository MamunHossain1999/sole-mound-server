import { Request, Response } from "express";
import { History } from "./history.model";

/* =========================
   🔥 Add to History (UPSERT)
========================= */
export const addToHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    const userId = (req.user as any)?.id || (req.user as any)?._id;

    await History.updateOne(
      { user: userId, product: productId },
      {
        $set: { viewedAt: new Date() },
        $setOnInsert: {
          user: userId,
          product: productId,
        },
      },
      { upsert: true },
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
        message: "Unauthorized - user not found",
      });
    }

    const userId = (req.user as any)?.id || (req.user as any)?._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing in token",
      });
    }

    const history = await History.find({ user: userId })
      .populate("product", "name images price")
      .sort({ viewedAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (err: any) {
    console.log("GET HISTORY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

/* =========================
   🔥 Delete Single Item
========================= */
export const deleteHistoryItem = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = (req.user as any)?.id || (req.user as any)?._id;

    const { id } = req.params;

    const deleted = await History.findOneAndDelete({
      _id: id,
      user: userId,
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
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = (req.user as any)?.id || (req.user as any)?._id;

    await History.deleteMany({ user: userId });

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
