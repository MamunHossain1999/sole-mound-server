"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getReviewsByProduct = exports.getAllReviews = exports.createReview = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const review_model_1 = require("./review.model");
const db_1 = __importDefault(require("../../config/db"));
const user_model_1 = require("../user/user.model");
// 🔥 1. Create Review
const createReview = async (req, res) => {
    await (0, db_1.default)();
    try {
        const { rating, comment } = req.body;
        // 🔹 Auth check
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const productId = new mongoose_1.default.Types.ObjectId(Array.isArray(req.params.productId)
            ? req.params.productId[0]
            : req.params.productId);
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }
        // 🔹 Validation
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }
        // 🔹 User exists check
        const userExists = await user_model_1.User.findById(req.user.id);
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // 🔹 One review per product
        const existing = await review_model_1.Review.findOne({
            user: req.user.id,
            product: productId,
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Already reviewed",
            });
        }
        // 🔥 Create review
        const review = await review_model_1.Review.create({
            user: req.user.id,
            product: productId,
            rating,
            comment,
        });
        // 🔥 Populate user + product
        const populatedReview = await review_model_1.Review.findById(review._id)
            .populate("user", "name email")
            .populate("product", "name price images"); // 👈 এখানে product data
        res.status(201).json({
            success: true,
            message: "Review added",
            data: populatedReview,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed",
            error: error.message,
        });
    }
};
exports.createReview = createReview;
// all revews by product
const getAllReviews = async (req, res) => {
    try {
        const reviews = await review_model_1.Review.find()
            .populate("user", "name email")
            .populate("product", "name price images")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            total: reviews.length,
            data: reviews,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch all reviews",
            error: error.message,
        });
    }
};
exports.getAllReviews = getAllReviews;
// 🔥 2. Get Reviews by Product
const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await review_model_1.Review.find({ product: productId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: reviews,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
        });
    }
};
exports.getReviewsByProduct = getReviewsByProduct;
// 🔥 3. Update Review (User can update their own review)
const updateReview = async (req, res) => {
    await (0, db_1.default)();
    try {
        const { id } = req.params; // review ID
        const { rating, comment } = req.body;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }
        const review = await review_model_1.Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        // Only the owner of the review can update
        if (review.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "You can only update your own review" });
        }
        review.rating = rating;
        review.comment = comment?.trim() || "";
        await review.save();
        const updatedReview = await review_model_1.Review.findById(review._id)
            .populate("user", "name email")
            .populate("product", "name price images");
        res.json({
            success: true,
            message: "Review updated successfully",
            data: updatedReview,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update review",
            error: error.message,
        });
    }
};
exports.updateReview = updateReview;
// 🔥 4. Delete Review (User + Seller + Admin)
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        // Populate product to get seller
        const review = await review_model_1.Review.findById(id)
            .populate("product"); // এখানে product full document আসবে
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        const isOwner = review.user.toString() === req.user.id.toString();
        const isAdmin = req.user.role === "admin";
        // Type assertion because after populate, product is no longer just ObjectId
        const product = review.product; // 👈 এখানে any বা better type ব্যবহার করা যায়
        const isSellerOfProduct = product?.seller &&
            product.seller.toString() === req.user.id.toString();
        // Authorization check
        if (!isOwner && !isAdmin && !isSellerOfProduct) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this review",
            });
        }
        await review_model_1.Review.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Review deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete review",
            error: error.message,
        });
    }
};
exports.deleteReview = deleteReview;
