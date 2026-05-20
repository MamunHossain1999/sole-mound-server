"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const cart_controller_1 = require("./cart.controller");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Wishlist
// Cart
router.post("/cart", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), cart_controller_1.addToCart);
router.get("/cart", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), cart_controller_1.getCart);
router.put("/cart/update", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), cart_controller_1.updateCartQuantity);
router.delete("/single/cart/:productId", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), cart_controller_1.removeFromCart);
router.delete("/cart/clear", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), cart_controller_1.clearCart);
const cartRoutes = router;
exports.default = cartRoutes;
