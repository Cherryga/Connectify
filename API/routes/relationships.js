import express from "express";
import {getRelationships, addRelationship, deleteRelationship, getFriends, getFriendRequests, acceptRequest, rejectRequest, getFollowers, getFollowing} from "../controllers/relationship.js";

const router = express.Router();

router.get("/", getRelationships);
router.post("/", addRelationship);
router.delete("/", deleteRelationship);
router.get("/friends", getFriends);
router.get("/requests", getFriendRequests);
router.post("/accept", acceptRequest);
router.delete("/reject/:userId", rejectRequest);
router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);

export default router;