import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";

// Verifies the JWT access-token cookie and attaches the decoded payload to
// req.user. Replaces the token/verify boilerplate that used to be duplicated
// in every controller.
export const authRequired = (req, _res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(new ApiError(401, "Not authenticated!"));

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return next(new ApiError(403, "Token is not valid!"));
    req.user = userInfo;
    next();
  });
};
