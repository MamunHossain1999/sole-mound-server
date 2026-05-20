"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestSellers = void 0;
const product_model_1 = require("../product/product.model");
const getBestSellers = async (req, res) => {
    try {
        const products = await product_model_1.Product.find()
            .sort({ sold: -1 })
            .limit(8);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch best sellers" });
    }
};
exports.getBestSellers = getBestSellers;
