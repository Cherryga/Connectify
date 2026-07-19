import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

// Access-token cookie options, shared by login/register/logout so they stay
// consistent (a mismatch is a common logout-doesn't-clear-cookie bug).
export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

export const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
