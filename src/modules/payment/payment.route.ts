import { Router } from "express";
import { createCheckoutSession } from "./checkout.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

/* =========================
   CHECKOUT (Protected)
========================= */
router.post(
  "/payment/checkout",
  protect,
  authorize("customer", "seller", "admin"),
  createCheckoutSession
);

const paymentRoutes = router;
export default paymentRoutes;