"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = express_1.default.Router();
// create review
router.post("/review/:productId", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller"), review_controller_1.createReview);
router.put("/review/update/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller"), review_controller_1.updateReview);
// get reviews
router.get("/reviews", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), review_controller_1.getAllReviews);
router.get("/review/:productId", auth_middleware_1.protect, review_controller_1.getReviewsByProduct);
// delete review
router.delete("/review/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller"), review_controller_1.deleteReview);
const reviewRoutes = router;
exports.default = reviewRoutes;
