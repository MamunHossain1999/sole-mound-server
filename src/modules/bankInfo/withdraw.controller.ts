import { Request, Response } from "express";
import { Withdraw } from "./withdraw.model";
import { Order } from "../order/order.model";


// create withdhraw
export const createWithdraw = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { amount } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // ✅ Calculate user balance (only paid + completed orders)
    const orders = await Order.find({
      userId,
      paymentStatus: "paid",
      status: "completed",
    });

    const totalIncome = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    const withdrawals = await Withdraw.find({ userId });

    const totalWithdrawn = withdrawals.reduce(
      (sum, w) => sum + w.amount,
      0
    );

    const availableBalance = totalIncome - totalWithdrawn;

    // ❗ Balance check
    if (amount > availableBalance) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const withdraw = await Withdraw.create({
      userId,
      amount,
    });

    res.json({ success: true, data: withdraw });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get withdraws
export const getWithdraws = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const data = await Withdraw.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// update withdraw
export const updateWithdrawStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "approved", "rejected"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updated = await Withdraw.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};