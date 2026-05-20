"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWishlistCount = exports.addView = exports.getTrendingProducts = void 0;
const product_model_1 = require("../product/product.model");
// =======================================================
// 🔥 GET TRENDING PRODUCTS
// =======================================================
const getTrendingProducts = async (req, res) => {
    try {
        const products = await product_model_1.Product.aggregate([
            // =========================
            // 1. SAFE DEFAULT VALUES
            // =========================
            {
                $addFields: {
                    views: { $ifNull: ["$views", 0] },
                    salesCount: { $ifNull: ["$salesCount", 0] },
                    wishlistCount: { $ifNull: ["$wishlistCount", 0] },
                },
            },
            // =========================
            // 2. SCORE CALCULATION
            // =========================
            {
                $addFields: {
                    score: {
                        $add: [
                            { $multiply: ["$views", 1] },
                            { $multiply: ["$salesCount", 3] },
                            { $multiply: ["$wishlistCount", 2] },
                        ],
                    },
                },
            },
            // =========================
            // 3. SORT BY TRENDING SCORE
            // =========================
            { $sort: { score: -1 } },
            // =========================
            // 4. LIMIT RESULT
            // =========================
            { $limit: 12 },
            // =========================
            // 5. CLEAN OUTPUT
            // =========================
            {
                $project: {
                    name: 1,
                    views: 1,
                    salesCount: 1,
                    wishlistCount: 1,
                    score: 1,
                    images: 1,
                    price: 1,
                },
            },
        ]);
        // // =========================
        // // DEBUG LOG (SAFE)
        // // =========================
        // console.log(
        //   "TRENDING RESULT:",
        //   products.map((p: any) => ({
        //     name: p.name,
        //     views: p.views,
        //     wishlist: p.wishlistCount,
        //     sales: p.salesCount,
        //     score: p.score,
        //   }))
        // );
        return res.json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        console.error("TRENDING ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Trending fetch failed",
            error,
        });
    }
};
exports.getTrendingProducts = getTrendingProducts;
// =======================================================
// 👀 ADD VIEW
// =======================================================
const addView = async (req, res) => {
    try {
        const { id } = req.params;
        await product_model_1.Product.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
        return res.json({ success: true });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "View update failed",
        });
    }
};
exports.addView = addView;
// =======================================================
// ❤️ ADD WISHLIST COUNT
// =======================================================
const addWishlistCount = async (req, res) => {
    try {
        const { id } = req.params;
        await product_model_1.Product.findByIdAndUpdate(id, { $inc: { wishlistCount: 1 } }, { new: true });
        return res.json({ success: true });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Wishlist update failed",
        });
    }
};
exports.addWishlistCount = addWishlistCount;
