"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlist_controller_1 = require("./wishlist.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Wishlist
router.post("/wishlist", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), wishlist_controller_1.addToWishlist);
router.get("/wishlist", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), wishlist_controller_1.getWishlist);
router.delete("/wishlist/:productId", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), wishlist_controller_1.removeFromWishlist);
const wishlistRoutes = router;
exports.default = wishlistRoutes;
