import { db } from "../connect.js";
import moment from "moment/moment.js";
import { createNotificationRecord, normalizeNotification } from "../services/notificationService.js";

export const getNotifications = async (req, res) => {
  const q = `
    SELECT n.*, u.username as fromUsername, u.profilePic as fromUserProfilePic, u.name as fromUserName
    FROM notifications n
    JOIN users u ON n.fromUserId = u.id
    WHERE n.toUserId = ?
    ORDER BY n.createdAt DESC
    LIMIT 50
  `;
  const [rows] = await db.query(q, [req.user.id]);

  const notifications = rows.map((notification) =>
    normalizeNotification({
      ...notification,
      time: moment(notification.createdAt).fromNow(),
    })
  );

  return res.json(notifications);
};

export const markAsRead = async (req, res) => {
  const q = "UPDATE notifications SET `read` = 1 WHERE `id` = ? AND `toUserId` = ?";
  await db.query(q, [req.params.id, req.user.id]);
  return res.json("Notification marked as read");
};

export const createNotification = async (req, res) => {
  const notification = await createNotificationRecord({
    fromUserId: req.user.id,
    toUserId: req.body.toUserId,
    type: req.body.type,
    postId: req.body.postId || null,
    message: req.body.message,
  });
  return res.json(notification);
};
