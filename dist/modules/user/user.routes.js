"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_validation_1 = require("../auth/auth.validation");
const userController = __importStar(require("./user.controller"));
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// Cloudinary Storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: (req, file) => {
        return {
            folder: "avatars",
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
        };
    },
});
const upload = (0, multer_1.default)({ storage });
// ================= ROUTES =================
// Upload avatar
router.post("/user/create/avatar", auth_middleware_1.protect, upload.single("avatar"), userController.updateAvatar);
// User profile
router.put("/user/update-profile", auth_middleware_1.protect, (0, validate_middleware_1.validate)(auth_validation_1.updateProfileSchema), userController.updateProfile);
router.get("/user/profile", auth_middleware_1.protect, userController.getProfile);
router.get("/all/users/profile", auth_middleware_1.protect, userController.getUsers);
// 👉 get single user by id
router.get("/users/:id", auth_middleware_1.protect, userController.getUserById);
// Admin actions
router.put("/user/:id/role", auth_middleware_1.protect, userController.updateUserRole);
router.delete("/user/:id", auth_middleware_1.protect, userController.deleteUser);
const userRoutes = router;
exports.default = userRoutes;
