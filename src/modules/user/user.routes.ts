import express from "express";
import { protect } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema } from "../auth/auth.validation";
import * as userController from "./user.controller";

import cloudinary from "../../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const router = express.Router();

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    return {
      folder: "avatars",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    };
  },
});

const upload = multer({ storage });

// ================= ROUTES =================

// Upload avatar
router.post(
  "/user/create/avatar",
  protect,
  upload.single("avatar"),
  userController.updateAvatar
);

// User profile
router.put(
  "/user/update-profile",
  protect,
  validate(updateProfileSchema),
  userController.updateProfile
);

router.get("/user/profile", protect, userController.getProfile);
router.get("/all/users/profile", protect, userController.getUsers);

// Admin actions
router.put("/user/:id/role", protect, userController.updateUserRole);
router.delete("/user/:id", protect, userController.deleteUser);

const userRoutes = router;
export default userRoutes;