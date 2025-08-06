import express from "express";
import { getPosts, getAllPosts, addPost, deletePost, getRecentActivities, savePost, unsavePost, getSavedPosts } from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/all", getAllPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.get("/recent-activities", getRecentActivities);
router.post("/:id/saved", savePost);
router.delete("/:id/saved", unsavePost);
router.get("/saved", getSavedPosts);

export default router;