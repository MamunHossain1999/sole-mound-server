"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.getWishlist = exports.addToWishlist = void 0;
const wishlist_mode_1 = require("./wishlist.mode");
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const exists = await wishlist_mode_1.Wishlist.findOne({
            user: req.user.id,
            product: productId,
        });
        if (exists) {
            return res.json({ success: false, message: "Already in wishlist" });
        }
        await wishlist_mode_1.Wishlist.create({
            user: req.user.id,
            product: productId,
        });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
};
exports.addToWishlist = addToWishlist;
const getWishlist = async (req, res) => {
    const data = await wishlist_mode_1.Wishlist.find({ user: req.user.id }).populate("product");
    res.json({ success: true, data });
};
exports.getWishlist = getWishlist;
const removeFromWishlist = async (req, res) => {
    await wishlist_mode_1.Wishlist.findOneAndDelete({
        user: req.user.id,
        product: req.params.productId,
    });
    res.json({ success: true });
};
exports.removeFromWishlist = removeFromWishlist;
