import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import { ApiError } from "../middleware/errorHandler.js";
import { cookieOptions, signAccessToken } from "../utils/token.js";
import {
  generateOTP,
  sendOTPEmail,
  storeOTP,
  verifyOTP,
} from "../services/emailService.js";

const sanitizeUser = ({ password, ...rest }) => rest;

export const register = async (req, res) => {
  const { username, email, password, name } = req.body;

  const [existing] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
  if (existing.length) throw new ApiError(409, "User already exists!");

  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  await db.query(
    "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, name]
  );

  return res.status(201).json("User has been created.");
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  if (rows.length === 0) throw new ApiError(404, "User not found!");

  const isPasswordValid = bcrypt.compareSync(password, rows[0].password);
  if (!isPasswordValid) throw new ApiError(400, "Wrong password or username!");

  const token = signAccessToken(rows[0].id);
  return res.cookie("accessToken", token, cookieOptions).status(200).json(sanitizeUser(rows[0]));
};

export const logout = (_req, res) => {
  res
    .clearCookie("accessToken", {
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
    })
    .status(200)
    .json("User has been logged out.");
};

// Send OTP for email verification
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (rows.length === 0) throw new ApiError(404, "User not found with this email");

  const otp = generateOTP();
  const emailSent = await sendOTPEmail(email, otp);
  if (!emailSent) throw new ApiError(500, "Failed to send OTP email");

  storeOTP(email, otp);
  return res.status(200).json("OTP sent successfully");
};

// Verify OTP and login
export const verifyOTPLogin = async (req, res) => {
  const { email, otp } = req.body;

  const verification = verifyOTP(email, otp);
  if (!verification.valid) throw new ApiError(400, verification.message);

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) throw new ApiError(404, "User not found!");

  const token = signAccessToken(rows[0].id);
  return res.cookie("accessToken", token, cookieOptions).status(200).json(sanitizeUser(rows[0]));
};

// Register with OTP verification
export const registerWithOTP = async (req, res) => {
  const { username, email, password, name, otp } = req.body;

  const verification = verifyOTP(email, otp);
  if (!verification.valid) throw new ApiError(400, verification.message);

  const [existing] = await db.query(
    "SELECT id FROM users WHERE username = ? OR email = ?",
    [username, email]
  );
  if (existing.length) throw new ApiError(409, "User already exists!");

  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  await db.query(
    "INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, name]
  );

  return res.status(201).json("User has been created successfully!");
};
