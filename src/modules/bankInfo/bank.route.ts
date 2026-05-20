import express from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getBankInfo, saveBankInfo } from "./bankInfo.controller";
import { createWithdraw, getWithdraws, updateWithdrawStatus } from "./withdraw.controller";
import { authorize } from "../../middlewares/role.middleware";

const router = express.Router();

router.post("/bank", protect, authorize("seller", "admin"), saveBankInfo);
router.get("/bank", protect, authorize("seller", "admin"), getBankInfo);

router.post("/withdraw", protect, authorize("seller", "admin"), createWithdraw);
router.get("/withdraw", protect, authorize("seller", "admin"), getWithdraws);

router.patch("/withdraw/:id", protect, authorize("seller", "admin"), updateWithdrawStatus);

const bankRoute = router;
export default bankRoute;
