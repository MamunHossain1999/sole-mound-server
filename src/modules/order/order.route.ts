import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  requestReturnOrder,
  updateOrderComment,
} from "./order.controller";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { downloadInvoice } from "./invoice.controller";


const router = Router();

/* =========================
   CREATE ORDER (USER ONLY)
========================= */
router.post("/order", protect, authorize("customer","seller", "admin"), createOrder);

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

// invoice route
router.get("/invoice/:id", protect, authorize("customer","seller","admin"), downloadInvoice );

// order comment
router.patch("/orders/:id/comment",protect, authorize("customer","seller","admin"), updateOrderComment);

/* =========================
   DELETE ORDER
========================= */
router.delete("/order/:id", protect, authorize("seller","admin"), deleteOrder);

// return router;
router.post("/order/:returnId/return", protect, authorize("customer","seller"), requestReturnOrder);
const orderRoutes = router;
export default orderRoutes;
