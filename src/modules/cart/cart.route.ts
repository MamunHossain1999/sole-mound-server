import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { addToCart, clearCart, getCart, removeFromCart, updateCartQuantity } from "./cart.controller";
import { authorize } from "../../middlewares/role.middleware";



const router = Router();

// Wishlist


// Cart
router.post("/cart", protect, authorize("customer", "seller", "admin"), addToCart);
router.get("/cart", protect, authorize("customer", "seller", "admin"), getCart);
router.put("/cart/update", protect, authorize("customer", "seller", "admin"), updateCartQuantity);
router.delete("/single/cart/:productId", protect, authorize("customer", "seller", "admin"), removeFromCart);

router.delete("/cart/clear", protect, authorize("customer", "seller", "admin"), clearCart);
const cartRoutes = router;
export default cartRoutes;