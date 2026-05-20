"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategoryStatus = exports.getSingleCategory = exports.getAllCategories = exports.getTopCategories = void 0;
const product_model_1 = require("../product/product.model");
const order_model_1 = require("../order/order.model");
/* =========================
   🔥 TOP CATEGORIES
========================= */
const getTopCategories = async (req, res) => {
    try {
        const categories = await product_model_1.Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: { $sum: 1 },
                    totalPrice: { $sum: "$price" }, // ✅ ADD THIS
                    image: { $first: "$images" },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 6 },
        ]);
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};
exports.getTopCategories = getTopCategories;
/* =========================
   🔥 ALL CATEGORIES
========================= */
const getAllCategories = async (req, res) => {
    try {
        const categories = await product_model_1.Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    added: { $sum: 1 },
                    stock: { $sum: "$quantity" },
                    date: { $max: "$createdAt" },
                    image: { $first: "$images" },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const orders = await order_model_1.Order.find().populate("products.productId");
        const salesMap = {};
        orders.forEach((order) => {
            order.products?.forEach((p) => {
                const product = p.productId;
                if (!product || !product.category)
                    return;
                const category = product.category;
                const qty = p.quantity || 1;
                salesMap[category] = (salesMap[category] || 0) + qty;
            });
        });
        const result = categories.map((cat) => ({
            id: String(cat._id), // frontend এর জন্য
            name: String(cat._id), // category name
            image: Array.isArray(cat.image)
                ? cat.image[0]
                : cat.image || "",
            added: cat.added || 0,
            stock: cat.stock || 0,
            date: cat.date,
            sales: salesMap[cat._id] || 0,
            // 🔥 auto status
            status: cat.stock === 0 ? "inactive" : "active",
        }));
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};
exports.getAllCategories = getAllCategories;
// sigle category
const getSingleCategory = async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }
        // 1. category base data
        const categoryData = await product_model_1.Product.aggregate([
            {
                $match: { category: name },
            },
            {
                $group: {
                    _id: "$category",
                    added: { $sum: 1 },
                    stock: { $sum: "$quantity" },
                    date: { $max: "$createdAt" },
                    image: { $first: "$images" },
                },
            },
        ]);
        if (!categoryData.length) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        // 2. sales calculation
        const orders = await order_model_1.Order.find().populate("products.productId");
        let sales = 0;
        orders.forEach((order) => {
            order.products?.forEach((p) => {
                const product = p.productId;
                if (product?.category === name) {
                    sales += p.quantity || 1;
                }
            });
        });
        const cat = categoryData[0];
        return res.status(200).json({
            success: true,
            data: {
                id: String(cat._id),
                name: String(cat._id),
                image: Array.isArray(cat.image) ? cat.image[0] : cat.image || "",
                added: cat.added || 0,
                stock: cat.stock || 0,
                date: cat.date,
                sales,
                status: cat.stock === 0 ? "inactive" : "active",
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category",
        });
    }
};
exports.getSingleCategory = getSingleCategory;
/* =========================
   🔥 UPDATE CATEGORY STATUS
========================= */
const updateCategoryStatus = async (req, res) => {
    try {
        const { name } = req.params;
        const { status } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name required" });
        }
        const updated = await product_model_1.Product.updateMany({ category: name }, { categoryStatus: status });
        res.json({
            success: true,
            message: "Category status updated",
            modifiedCount: updated.modifiedCount,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update category" });
    }
};
exports.updateCategoryStatus = updateCategoryStatus;
/* =========================
   🔥 DELETE CATEGORY
========================= */
const deleteCategory = async (req, res) => {
    try {
        const rawName = req.params.name;
        if (!rawName) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }
        const categoryName = Array.isArray(rawName)
            ? rawName[0]
            : rawName;
        const cleanName = categoryName.trim();
        console.log("Deleting category:", cleanName);
        const deleted = await product_model_1.Product.deleteMany({
            category: cleanName,
        });
        return res.status(200).json({
            success: true,
            message: `Category "${cleanName}" deleted successfully`,
            deletedCount: deleted.deletedCount || 0,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete category",
        });
    }
};
exports.deleteCategory = deleteCategory;
