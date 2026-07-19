import express from "express";
import { getLikes, addLike, deleteLike } from "../controllers/like.js";
import { authRequired } from "../middleware/authRequired.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getLikes));
router.post("/", authRequired, asyncHandler(addLike));
router.delete("/", authRequired, asyncHandler(deleteLike));

export default router;
