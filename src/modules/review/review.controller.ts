import { Request, Response } from "express";
import mongoose from "mongoose";
import { Review } from "./review.model";
import connectDB from "../../config/db";
import { User } from "../user/user.model";

interface AuthRequest extends Request {
  user?: any;
}

// 🔥 1. Create Review

export const createReview = async (req: AuthRequest, res: Response) => {
  await connectDB();

  try {
    const { rating, comment } = req.body;

    // 🔹 Auth check
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const productId = new mongoose.Types.ObjectId(
      Array.isArray(req.params.productId)
        ? req.params.productId[0]
        : req.params.productId
    );

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
    const userExists = await User.findById(req.user.id);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔹 One review per product
    const existing = await Review.findOne({
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
    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });

    // 🔥 Populate user + product
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("product", "name price images"); // 👈 এখানে product data

    res.status(201).json({
      success: true,
      message: "Review added",
      data: populatedReview,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed",
      error: error.message,
    });
  }
};

// all revews by product
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name price images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: reviews.length,
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all reviews",
      error: error.message,
    });
  }
};

// 🔥 2. Get Reviews by Product
export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};


// 🔥 3. Update Review (User can update their own review)
export const updateReview = async (req: AuthRequest, res: Response) => {
  await connectDB();

  try {
    const { id } = req.params; // review ID
    const { rating, comment } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const review = await Review.findById(id);

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

    const updatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("product", "name price images");

    res.json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// 🔥 4. Delete Review (User + Seller + Admin)
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Populate product to get seller
    const review = await Review.findById(id)
      .populate("product");   // এখানে product full document আসবে

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const isOwner = review.user.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";

    // Type assertion because after populate, product is no longer just ObjectId
    const product = review.product as any;   // 👈 এখানে any বা better type ব্যবহার করা যায়
    const isSellerOfProduct = product?.seller && 
      product.seller.toString() === req.user.id.toString();

    // Authorization check
    if (!isOwner && !isAdmin && !isSellerOfProduct) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};