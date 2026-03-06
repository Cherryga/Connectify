import express from "express";
import { 
  getConversations, 
  getMessages, 
  addMessage, 
  updateTypingStatus,
  getTypingStatus,
  searchMessages,
  markAsDelivered,
  getUnreadCount,
  deleteMessage
} from "../controllers/message.js";

const router = express.Router();

router.get("/conversations", getConversations);
router.get("/unread", getUnreadCount);
router.get("/search", searchMessages);
router.get("/:receiverId", getMessages);
router.get("/typing/:senderId", getTypingStatus);
router.post("/", addMessage);
router.post("/typing", updateTypingStatus);
router.put("/delivered/:senderId", markAsDelivered);
router.delete("/:id", deleteMessage);

export default router; 