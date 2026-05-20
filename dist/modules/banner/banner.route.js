"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const banner_controller_1 = require("./banner.controller");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
/* ================= CLOUDINARY STORAGE ================= */
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (req, file) => ({
        folder: "banners", // 👈 fixed (products ❌ → banners ✔)
        allowed_formats: ["jpg", "png", "jpeg", "webp, avif"],
        transformation: [{ width: 1200, height: 400, crop: "limit" }],
    }),
});
/* ================= MULTER ================= */
const upload = (0, multer_1.default)({ storage });
/* ================= ROUTES ================= */
/* CREATE BANNER (with image upload) */
router.post("/banners", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), upload.single("image"), // 👈 IMPORTANT FIX
banner_controller_1.createBanner);
/* GET BANNERS */
router.get("/banners", banner_controller_1.getBanners);
/* DELETE BANNER */
router.delete("/banners/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), banner_controller_1.deleteBanner);
const bannerRoute = router;
exports.default = bannerRoute;
