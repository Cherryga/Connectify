import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(3, "must be at least 3 characters").max(200),
  email: z.string().trim().email("must be a valid email").max(50),
  password: z.string().min(6, "must be at least 6 characters").max(200),
  name: z.string().trim().min(1, "is required").max(200),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, "is required"),
  password: z.string().min(1, "is required"),
});

export const sendOtpSchema = z.object({
  email: z.string().trim().email("must be a valid email"),
});

export const verifyOtpLoginSchema = z.object({
  email: z.string().trim().email("must be a valid email"),
  otp: z.string().trim().length(6, "must be 6 digits"),
});

export const registerWithOtpSchema = registerSchema.extend({
  otp: z.string().trim().length(6, "must be 6 digits"),
});
