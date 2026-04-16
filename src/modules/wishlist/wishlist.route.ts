import { Router } from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "./wishlist.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";


const router = Router();

// Wishlist
router.post("/wishlist", protect, authorize("customer", "seller", "admin"), addToWishlist);
router.get("/wishlist", protect, authorize("customer", "seller", "admin"), getWishlist);
router.delete("/wishlist/:productId", protect, authorize("customer", "seller", "admin"), removeFromWishlist);

const wishlistRoutes = router;
export default wishlistRoutes;