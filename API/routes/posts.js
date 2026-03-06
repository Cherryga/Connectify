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
  getTrendingPosts,
  getExplorePosts,
  getFilteredPosts,
  getTrendingHashtags
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/all", getAllPosts);
router.get("/trending", getTrendingPosts);
router.get("/explore", getExplorePosts);
router.get("/filter", getFilteredPosts);
router.get("/hashtags/trending", getTrendingHashtags);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.get("/recent-activities", getRecentActivities);
router.post("/:id/saved", savePost);
router.delete("/:id/saved", unsavePost);
router.get("/saved", getSavedPosts);

export default router;