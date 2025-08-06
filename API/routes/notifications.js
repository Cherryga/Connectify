import express from "express";
import { getNotifications, markAsRead, createNotification } from "../controllers/notification.js";

const router = express.Router();

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.post("/", createNotification);

export default router; 