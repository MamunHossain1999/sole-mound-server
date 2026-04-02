import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import {
  createProduct,
  getProducts,
  approveProduct,
  rejectProduct,
  deleteProduct,
  updateProduct,
  getSingleProduct,
} from "./product.controller";

import cloudinary from "../../config/cloudinary";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { get } from "node:http";

const router = express.Router();

// ✅ Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  }),
});

// ✅ Multer
const upload = multer({ storage });

// ================= ROUTES =================

// 🔥 CREATE PRODUCT
router.post(
  "/create/product",
  protect, // 🔥 FIRST
  authorize("seller", "admin"), // 🔥 SECOND
  upload.array("photos"), // 🔥 LAST
  createProduct
);

// 🔥 GET ALL PRODUCTS
router.get("/all/products",protect, authorize("customer", "seller", "admin"), getProducts);
router.get("/product/:id", protect, authorize("customer", "seller", "admin"),getSingleProduct);
// 🔥 APPROVE / REJECT
router.patch("/product/:id/approve",protect, authorize("admin"), approveProduct);
router.patch("/product/:id/reject", protect, authorize("admin"), rejectProduct);

// 🔥 UPDATE PRODUCT (Partial + Image)
router.patch(
  "/product/:id",
  upload.array("photos"),
  protect,
  authorize("seller", "admin"),
  updateProduct
);

// 🔥 DELETE PRODUCT
router.delete("/product/delete/:id", protect, authorize("seller", "admin"), deleteProduct);

const productRoutes = router;
export default productRoutes;