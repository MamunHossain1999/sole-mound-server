"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const product_controller_1 = require("./product.controller");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const router = express_1.default.Router();
// ✅ Cloudinary Storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: async (req, file) => ({
        folder: "products",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    }),
});
// ✅ Multer
const upload = (0, multer_1.default)({ storage });
// ================= ROUTES =================
// 🔥 CREATE PRODUCT
router.post("/create/product", auth_middleware_1.protect, // 🔥 FIRST
(0, role_middleware_1.authorize)("seller", "admin"), // 🔥 SECOND
upload.array("photos"), // 🔥 LAST
product_controller_1.createProduct);
// 🔥 GET ALL PRODUCTS
router.get("/all/products", product_controller_1.getProducts);
router.get("/product/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("customer", "seller", "admin"), product_controller_1.getSingleProduct);
// 🔥 APPROVE / REJECT
router.patch("/product/:id/approve", auth_middleware_1.protect, (0, role_middleware_1.authorize)("admin"), product_controller_1.approveProduct);
router.patch("/product/:id/reject", auth_middleware_1.protect, (0, role_middleware_1.authorize)("admin"), product_controller_1.rejectProduct);
// 🔥 UPDATE PRODUCT (Partial + Image)
router.patch("/product/update/:id", upload.array("photos"), auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), product_controller_1.updateProduct);
// 🔥 DELETE PRODUCT
router.delete("/product/delete/:id", auth_middleware_1.protect, (0, role_middleware_1.authorize)("seller", "admin"), product_controller_1.deleteProduct);
const productRoutes = router;
exports.default = productRoutes;
