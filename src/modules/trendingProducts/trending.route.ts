import express from "express";
import {
  getTrendingProducts,
  addView,
  addWishlistCount,
} from "./trending.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = express.Router();

// 🔥 Trending list
router.get("/all-trending", protect, authorize("customer","seller","admin"), getTrendingProducts);

// 👀 view count
router.patch("/view/:id", protect, authorize("customer","seller","admin"), addView);

// ❤️ wishlist count
router.patch("/wishlist/:id", protect, authorize("customer","seller","admin"), addWishlistCount);

const trendingRoutes = router;
export default trendingRoutes;