import express from "express";
import { getConversations, getMessages, sendMessage, markAsRead } from "../controllers/message.js";

const router = express.Router();

router.get("/conversations", getConversations);
router.get("/:conversationId", getMessages);
router.post("/", sendMessage);
router.put("/:conversationId/read", markAsRead);

export default router; 