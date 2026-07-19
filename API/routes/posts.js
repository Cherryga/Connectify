import express from "express";
import {
  getPosts,
  getAllPosts,
  addPost,
  deletePost,
  getRecentActivities,
  savePost,
  unsavePost,
  getSavedPosts,
  getSavedPostStatus,
  getTrendingPosts,
  getExplorePosts,
  getFilteredPosts,
  getTrendingHashtags,
} from "../controllers/post.js";
import { authRequired } from "../middleware/authRequired.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { addPostSchema } from "../validators/contentSchemas.js";

const router = express.Router();

// Every posts endpoint requires an authenticated user.
router.use(authRequired);

router.get("/", asyncHandler(getPosts));
router.get("/all", asyncHandler(getAllPosts));
router.get("/trending", asyncHandler(getTrendingPosts));
router.get("/explore", asyncHandler(getExplorePosts));
router.get("/filter", asyncHandler(getFilteredPosts));
router.get("/hashtags/trending", asyncHandler(getTrendingHashtags));
router.post("/", validate(addPostSchema), asyncHandler(addPost));
router.delete("/:id", asyncHandler(deletePost));
router.get("/recent-activities", asyncHandler(getRecentActivities));
router.post("/:id/saved", asyncHandler(savePost));
router.delete("/:id/saved", asyncHandler(unsavePost));
router.get("/:id/saved", asyncHandler(getSavedPostStatus));
router.get("/saved", asyncHandler(getSavedPosts));

export default router;
