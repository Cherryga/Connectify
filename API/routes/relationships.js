import express from "express";
import {getRelationships, addRelationship, deleteRelationship, getFriends, getFriendRequests, acceptRequest, rejectRequest} from "../controllers/relationship.js";

const router = express.Router();

router.get("/", getRelationships);
router.post("/", addRelationship);
router.delete("/", deleteRelationship);
router.get("/friends", getFriends);
router.get("/requests", getFriendRequests);
router.post("/accept", acceptRequest);
router.delete("/reject/:userId", rejectRequest);

export default router;