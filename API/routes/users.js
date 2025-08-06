import express from "express";
import { getUser, updateUser, getSuggestedUsers, searchUsers } from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/", updateUser);
router.get("/suggested", getSuggestedUsers);
router.get("/search", searchUsers);

export default router;