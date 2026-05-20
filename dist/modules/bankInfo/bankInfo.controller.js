"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveBankInfo = exports.getBankInfo = void 0;
const bankInfo_model_1 = require("./bankInfo.model");
/* ================= GET BANK INFO ================= */
const getBankInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const bank = await bankInfo_model_1.Bank.findOne({ userId });
        res.json({
            success: true,
            data: bank || null,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.getBankInfo = getBankInfo;
/* ================= SAVE / UPDATE BANK INFO ================= */
const saveBankInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const { bankName, accountNumber, swiftCode, country, accountName, email, } = req.body;
        if (!bankName || !accountNumber) {
            return res.status(400).json({
                success: false,
                message: "Bank name & account number required",
            });
        }
        const bank = await bankInfo_model_1.Bank.findOneAndUpdate({ userId }, {
            $set: {
                bankName,
                accountNumber,
                swiftCode: swiftCode || "",
                country: country || "",
                accountName: accountName || "",
                email: email || "",
            },
        }, { new: true, upsert: true });
        res.status(200).json({
            success: true,
            message: "Bank info saved successfully",
            data: bank,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.saveBankInfo = saveBankInfo;
