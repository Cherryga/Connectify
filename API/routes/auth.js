import express from "express";
import { login, register, logout, sendOTP, verifyOTPLogin, registerWithOTP } from "../controllers/auth.js";

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.post("/logout", logout)
router.post("/send-otp", sendOTP)
router.post("/verify-otp-login", verifyOTPLogin)
router.post("/register-with-otp", registerWithOTP)

export default router