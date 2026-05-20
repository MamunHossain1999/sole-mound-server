"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.getBanners = exports.createBanner = void 0;
const banner_model_1 = require("./banner.model");
/* ================= CREATE BANNER ================= */
const createBanner = async (req, res) => {
    try {
        console.log(req.file);
        console.log(req.body);
        if (!req.file) {
            return res.status(400).json({ message: "Image missing" });
        }
        const newBanner = await banner_model_1.Banner.create({
            title: req.body.title,
            image: req.file.path, // cloudinary URL
            link: req.body.link,
            description: req.body.description,
        });
        return res.status(201).json(newBanner);
    }
    catch (error) {
        console.log("CREATE BANNER ERROR:", error.message);
        return res.status(500).json({ message: error.message });
    }
};
exports.createBanner = createBanner;
/* ================= GET ALL ================= */
const getBanners = async (req, res) => {
    try {
        const banners = await banner_model_1.Banner.find({});
        res.status(200).json(banners);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "Failed to get banners",
        });
    }
};
exports.getBanners = getBanners;
/* ================= DELETE ================= */
const deleteBanner = async (req, res) => {
    try {
        await banner_model_1.Banner.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};
exports.deleteBanner = deleteBanner;
