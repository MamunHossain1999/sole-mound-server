"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_controller_1 = require("./checkout.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
/* =========================
   CHECKOUT (Protected)
========================= */
router.post("/payment/checkout", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), checkout_controller_1.createCheckoutSession);
const paymentRoutes = router;
exports.default = paymentRoutes;
