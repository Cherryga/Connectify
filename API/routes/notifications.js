import express from "express";
import { getNotifications, markAsRead, createNotification } from "../controllers/notification.js";
import { authRequired } from "../middleware/authRequired.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.use(authRequired);

router.get("/", asyncHandler(getNotifications));
router.put("/:id/read", asyncHandler(markAsRead));
router.post("/", asyncHandler(createNotification));

export default router;
