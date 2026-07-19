import express from "express";
import {
  getRelationships,
  addRelationship,
  deleteRelationship,
  getFriends,
  getFriendRequests,
  acceptRequest,
  rejectRequest,
  getFollowers,
  getFollowing,
  getRequestStatus,
} from "../controllers/relationship.js";
import { authRequired } from "../middleware/authRequired.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

// Public reads
router.get("/", asyncHandler(getRelationships));
router.get("/followers/:userId", asyncHandler(getFollowers));
router.get("/following/:userId", asyncHandler(getFollowing));

// Authenticated actions
router.get("/request-status/:userId", authRequired, asyncHandler(getRequestStatus));
router.get("/friends", authRequired, asyncHandler(getFriends));
router.get("/requests", authRequired, asyncHandler(getFriendRequests));
router.post("/", authRequired, asyncHandler(addRelationship));
router.delete("/", authRequired, asyncHandler(deleteRelationship));
router.post("/accept", authRequired, asyncHandler(acceptRequest));
router.delete("/reject/:userId", authRequired, asyncHandler(rejectRequest));

export default router;
