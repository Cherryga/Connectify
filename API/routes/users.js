import express from "express";
import { getUser, updateUser, getSuggestedUsers, searchUsers } from "../controllers/user.js";
import { authRequired } from "../middleware/authRequired.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/find/:userId", asyncHandler(getUser));
router.get("/suggested", authRequired, asyncHandler(getSuggestedUsers));
router.get("/search", authRequired, asyncHandler(searchUsers));
router.put("/", authRequired, asyncHandler(updateUser));

export default router;
