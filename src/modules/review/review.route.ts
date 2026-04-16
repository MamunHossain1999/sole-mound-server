import express from "express";
import { createReview,  deleteReview,  getAllReviews,  getReviewsByProduct, updateReview } from "./review.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = express.Router();

// create review
router.post("/review/:productId", protect,authorize("customer","seller"), createReview);
router.put("/review/update/:id", protect, authorize("customer", "seller"), updateReview);

// get reviews
router.get("/reviews", protect, authorize("customer","seller", "admin"), getAllReviews);
router.get("/review/:productId",protect, getReviewsByProduct);

// delete review
router.delete("/review/:id", protect,authorize("customer","seller"), deleteReview);

const reviewRoutes = router;
export default reviewRoutes;