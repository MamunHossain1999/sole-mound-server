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
    console.log("📩 Incoming Order Body:", req.body);

    const userId = req.user?.id; // ✅ FIXED

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
    });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("🔥 Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* =========================
   GET ALL ORDERS
========================= */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

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
   GET SINGLE ORDER
========================= */

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log("📦 GET ORDER ID:", id);

    // ✅ 1. Check id exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // ✅ 2. Validate MongoDB ObjectId
    const idString = Array.isArray(id) ? id[0] : id;
    if (!mongoose.Types.ObjectId.isValid(idString)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    // ✅ 3. Find Order
    const order = await Order.findById(idString);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log("✅ ORDER FOUND:", order._id);

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
   UPDATE ORDER STATUS
========================= */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
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
      message: "Order updated successfully",
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
   UPDATE PAYMENT STATUS (IMPORTANT FOR STRIPE)
========================= */
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentStatus, transactionId } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
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
   DELETE ORDER
========================= */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};