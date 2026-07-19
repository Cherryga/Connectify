import express from "express";
import { getComments, addComment } from "../controllers/comment.js";
import { authRequired } from "../middleware/authRequired.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { addCommentSchema } from "../validators/contentSchemas.js";

const router = express.Router();

router.get("/", asyncHandler(getComments));
router.post("/", authRequired, validate(addCommentSchema), asyncHandler(addComment));

export default router;
