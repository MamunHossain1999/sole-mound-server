import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { forgotPasswordSchema, loginSchema, registerSchema, resendOtpSchema, resetPasswordSchema, verifyOtpSchema } from "./auth.validation";


const router = Router();

// Auth routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);

// Password reset & OTP
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.put("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// OTP verification
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), authController.resendOtp);



const authRoutes = router;
export default authRoutes;