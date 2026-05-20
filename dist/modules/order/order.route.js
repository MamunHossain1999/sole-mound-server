"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const invoice_controller_1 = require("./invoice.controller");
const router = (0, express_1.Router)();
/* =========================
   CREATE ORDER (USER ONLY)
========================= */
router.post("/order", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), order_controller_1.createOrder);
/* =========================
   GET ALL ORDERS
   (ADMIN + SELLER)
========================= */
router.get("/orders", auth_middleware_1.protect, (0, role_middleware_1.authorize)("admin", "seller"), order_controller_1.getAllOrders);
/* =========================
   GET SINGLE ORDER
========================= */
router.get("/order/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), order_controller_1.getOrderById);
/* =========================
   UPDATE ORDER STATUS
========================= */
router.patch("/order/:id/status", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), order_controller_1.updateOrderStatus);
/* =========================
   UPDATE PAYMENT STATUS
   (IMPORTANT FOR STRIPE)
========================= */
router.patch("/order/:id/payment", auth_middleware_1.protect, (0, role_middleware_1.authorize)("admin", "seller"), order_controller_1.updatePaymentStatus);
// invoice route
router.get("/invoice/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), invoice_controller_1.downloadInvoice);
// order comment
router.patch("/orders/:id/comment", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), order_controller_1.updateOrderComment);
/* =========================
   DELETE ORDER
========================= */
router.delete("/order/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), order_controller_1.deleteOrder);
// return router;
router.post("/order/:returnId/return", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller"), order_controller_1.requestReturnOrder);
const orderRoutes = router;
exports.default = orderRoutes;
