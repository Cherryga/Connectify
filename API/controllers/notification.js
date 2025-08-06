import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";

export const getNotifications = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT n.*, 
             u.username as fromUsername,
             u.profilePic as fromUserProfilePic,
             u.name as fromUserName
      FROM notifications n
      JOIN users u ON n.fromUserId = u.id
      WHERE n.toUserId = ?
      ORDER BY n.createdAt DESC
      LIMIT 50
    `;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Format the time for display
      const notifications = data.map(notification => ({
        ...notification,
        time: moment(notification.createdAt).fromNow()
      }));
      
      return res.json(notifications);
    });
  });
};

export const markAsRead = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "UPDATE notifications SET `read` = 1 WHERE `id` = ? AND `toUserId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Notification marked as read");
    });
  });
};

export const createNotification = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO notifications(`fromUserId`, `toUserId`, `type`, `postId`, `message`, `createdAt`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.toUserId,
      req.body.type,
      req.body.postId || null,
      req.body.message,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Notification created");
    });
  });
}; 