import express from "express";
import { login, register, logout, sendOTP, verifyOTPLogin, registerWithOTP } from "../controllers/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpLoginSchema,
  registerWithOtpSchema,
} from "../validators/authSchemas.js";

const router = express.Router();

router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/logout", logout);
router.post("/send-otp", validate(sendOtpSchema), asyncHandler(sendOTP));
router.post("/verify-otp-login", validate(verifyOtpLoginSchema), asyncHandler(verifyOTPLogin));
router.post("/register-with-otp", validate(registerWithOtpSchema), asyncHandler(registerWithOTP));

export default router;
