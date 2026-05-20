import { Request, Response } from "express";
import { Bank } from "./bankInfo.model";

/* ================= GET BANK INFO ================= */
export const getBankInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const bank = await Bank.findOne({ userId });

    res.json({
      success: true,
      data: bank || null,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= SAVE / UPDATE BANK INFO ================= */
export const saveBankInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      bankName,
      accountNumber,
      swiftCode,
      country,
      accountName,
      email,
    } = req.body;

    if (!bankName || !accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Bank name & account number required",
      });
    }

    const bank = await Bank.findOneAndUpdate(
      { userId },
      {
        $set: {
          bankName,
          accountNumber,
          swiftCode: swiftCode || "",
          country: country || "",
          accountName: accountName || "",
          email: email || "",
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Bank info saved successfully",
      data: bank,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};