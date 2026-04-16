import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from "./order.controller";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

/* =========================
   CREATE ORDER (USER ONLY)
========================= */
router.post("/order", protect, authorize("user","seller", "admin"), createOrder);

/* =========================
   GET ALL ORDERS
   (ADMIN + SELLER)
========================= */
router.get("/orders", protect, authorize("admin", "seller"), getAllOrders);

/* =========================
   GET SINGLE ORDER
========================= */
router.get("/order/:id", protect, authorize("customer", "seller", "admin"), getOrderById);

/* =========================
   UPDATE ORDER STATUS
========================= */
router.patch(
  "/order/:id/status",
  protect,
  authorize("seller", "admin"),
  updateOrderStatus,
);

/* =========================
   UPDATE PAYMENT STATUS
   (IMPORTANT FOR STRIPE)
========================= */
router.patch(
  "/order/:id/payment",
  protect,
  authorize("admin", "seller"),
  updatePaymentStatus,
);

/* =========================
   DELETE ORDER
========================= */
router.delete("/order/:id", protect, authorize("admin"), deleteOrder);
const orderRoutes = router;
export default orderRoutes;
