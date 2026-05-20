"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trending_controller_1 = require("./trending.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = express_1.default.Router();
// 🔥 Trending list
router.get("/all-trending", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), trending_controller_1.getTrendingProducts);
// 👀 view count
router.patch("/view/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), trending_controller_1.addView);
// ❤️ wishlist count
router.patch("/wishlist/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), trending_controller_1.addWishlistCount);
const trendingRoutes = router;
exports.default = trendingRoutes;
