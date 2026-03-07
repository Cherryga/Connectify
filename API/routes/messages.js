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
  deleteMessage,
  markAsRead
} from "../controllers/message.js";

const router = express.Router();

router.get("/conversations", getConversations);
router.get("/unread", getUnreadCount);
router.get("/search", searchMessages);
router.get("/typing/:senderId", getTypingStatus);
router.get("/:receiverId", getMessages);
router.post("/", addMessage);
router.post("/typing", updateTypingStatus);
router.put("/:receiverId/read", markAsRead);
router.put("/delivered/:senderId", markAsDelivered);
router.delete("/:id", deleteMessage);

export default router; 
