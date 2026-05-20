import express from "express";
import { createBanner, getBanners, deleteBanner } from "./banner.controller";

import cloudinary from "../../config/cloudinary";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const router = express.Router();

/* ================= CLOUDINARY STORAGE ================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "banners", // 👈 fixed (products ❌ → banners ✔)
    allowed_formats: ["jpg", "png", "jpeg", "webp, avif"],
    transformation: [{ width: 1200, height: 400, crop: "limit" }],
  }),
});

/* ================= MULTER ================= */
const upload = multer({ storage });

/* ================= ROUTES ================= */

/* CREATE BANNER (with image upload) */
router.post(
  "/banners",
  protect,
  authorize("seller", "admin"),
  upload.single("image"), // 👈 IMPORTANT FIX
  createBanner,
);

/* GET BANNERS */
router.get("/banners", getBanners);

/* DELETE BANNER */
router.delete(
  "/banners/:id",
  protect,
  authorize("seller", "admin"),
  deleteBanner,
);

const bannerRoute = router;
export default bannerRoute;
