import { Request, Response } from "express";
import { Order } from "./order.model";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

/* =========================
   CREATE ORDER
========================= */
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { products, totalAmount, shippingAddress } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products required",
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount",
      });
    }

    const order = await Order.create({
      userId,
      products,
      totalAmount,
      shippingAddress,
      status: "pending",
      paymentStatus: "unpaid",
      returnStatus: "none",
    });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL ORDERS (ONLY USER)
========================= */
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET SINGLE ORDER (SECURE)
========================= */
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    // ✅ fix id properly
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    // 🔐 auth check
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🛑 id validation
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    // 🔐 secure query (user-specific)
    const order = await Order.findOne({
      _id: id,
      userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("🔥 GET ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE ORDER STATUS (SECURE)
========================= */
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "completed",
      "cancelled",
    ];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId }, // 🔥 SECURITY
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated",
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE PAYMENT STATUS (SECURE)
========================= */
export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { paymentStatus, transactionId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId }, // 🔥 SECURITY
      {
        paymentStatus,
        transactionId,
        status:
          paymentStatus === "paid"
            ? "processing"
            : paymentStatus === "failed"
            ? "cancelled"
            : "pending",
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment updated",
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   DELETE ORDER (SECURE)
========================= */
export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      userId, // 🔥 SECURITY
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   RETURN ORDER (SECURE)
========================= */
export const requestReturnOrder = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { returnId } = req.params;
    const { reason } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const order = await Order.findOne({
      _id: returnId,
      userId, // 🔥 SECURITY
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.returnStatus !== "none") {
      return res.status(400).json({
        success: false,
        message: "Return already requested",
      });
    }

    order.returnStatus = "requested";
    order.returnReason = reason;
    order.returnRequestedAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Return requested",
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};