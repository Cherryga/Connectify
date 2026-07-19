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
  markAsRead,
} from "../controllers/message.js";
import { authRequired } from "../middleware/authRequired.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { addMessageSchema } from "../validators/contentSchemas.js";

const router = express.Router();

router.use(authRequired);

router.get("/conversations", asyncHandler(getConversations));
router.get("/unread", asyncHandler(getUnreadCount));
router.get("/search", asyncHandler(searchMessages));
router.get("/typing/:senderId", asyncHandler(getTypingStatus));
router.get("/:receiverId", asyncHandler(getMessages));
router.post("/", validate(addMessageSchema), asyncHandler(addMessage));
router.post("/typing", asyncHandler(updateTypingStatus));
router.put("/:receiverId/read", asyncHandler(markAsRead));
router.put("/delivered/:senderId", asyncHandler(markAsDelivered));
router.delete("/:id", asyncHandler(deleteMessage));

export default router;
