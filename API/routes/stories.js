import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/story.js";
import { authRequired } from "../middleware/authRequired.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.use(authRequired);

router.get("/", asyncHandler(getStories));
router.post("/", asyncHandler(addStory));
router.delete("/:id", asyncHandler(deleteStory));

export default router;
