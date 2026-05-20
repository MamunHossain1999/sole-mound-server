import express from "express";
import {
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  getTopCategories,
  updateCategoryStatus,
} from "./topCategory.controller";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { getBestSellers } from "./bestSeller.controller";

const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/best-sellers", getBestSellers);
router.get("/top-categories", getTopCategories);
router.get("/all-categories", getAllCategories);

router.get("/category/:name", getSingleCategory);
/* ================= PROTECTED ================= */

// ✅ status update (FIXED)
router.put(
  "/category-status/:name",
  protect,
  authorize("seller", "admin"),
  updateCategoryStatus
);

// ✅ delete (working)
router.delete(
  "/category/:name",
  protect,
  authorize("seller", "admin"),
  deleteCategory
);

export default router;