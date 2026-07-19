import moment from "moment/moment.js";
import { db } from "../connect.js";
import { ApiError } from "../middleware/errorHandler.js";
import { emitToUser } from "../socket.js";
import { createNotificationRecord } from "../services/notificationService.js";

const now = () => moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

const MESSAGE_SELECT = `
  SELECT m.id, m.senderId, m.receiverId, m.text,
         m.createdAt, m.is_read, m.is_delivered,
         u.username, u.name, u.profilePic
  FROM messages m
  JOIN users u ON m.senderId = u.id
`;

// Get messages between the current user and another user
export const getMessages = async (req, res) => {
  const { receiverId } = req.params;

  const [rows] = await db.query(
    `${MESSAGE_SELECT}
     WHERE (m.senderId = ? AND m.receiverId = ?)
        OR (m.senderId = ? AND m.receiverId = ?)
     ORDER BY m.createdAt ASC`,
    [req.user.id, receiverId, receiverId, req.user.id]
  );

  // Mark the other user's messages as read.
  await db.query(
    "UPDATE messages SET is_read = 1 WHERE senderId = ? AND receiverId = ? AND is_read = 0",
    [receiverId, req.user.id]
  );

  return res.status(200).json(rows);
};

// Send a message
export const addMessage = async (req, res) => {
  const messageText = (req.body.text ?? req.body.message ?? "").trim();
  const { receiverId } = req.body;
  if (!receiverId || !messageText) {
    throw new ApiError(400, "receiverId and message text are required.");
  }

  const [result] = await db.query(
    "INSERT INTO messages (senderId, receiverId, text, createdAt, is_read, is_delivered) VALUES (?, ?, ?, ?, 0, 0)",
    [req.user.id, receiverId, messageText, now()]
  );

  const [rows] = await db.query(`${MESSAGE_SELECT} WHERE m.id = ?`, [result.insertId]);
  const message = rows[0];

  emitToUser(receiverId, "message:new", message);

  createNotificationRecord({
    fromUserId: req.user.id,
    toUserId: receiverId,
    type: "message",
    message: "sent you a message",
  }).catch((err) => console.warn("Message notification error:", err));

  return res.status(201).json(message);
};

// Get conversation list with last message + unread counts
export const getConversations = async (req, res) => {
  const q = `
    SELECT u.id, u.username, u.name, u.profilePic, u.status,
      lastMessage.text as lastMessage,
      lastMessage.createdAt as lastMessageTime,
      lastMessage.is_read as isRead,
      COALESCE(unreadCount.count, 0) as unreadCount
    FROM users u
    INNER JOIN (
      SELECT
        CASE WHEN senderId = ? THEN receiverId ELSE senderId END as otherUserId,
        text, createdAt, is_read
      FROM messages m1
      WHERE id = (
        SELECT MAX(id) FROM messages m2
        WHERE (m2.senderId = ? AND m2.receiverId = m1.receiverId)
           OR (m2.senderId = m1.senderId AND m2.receiverId = ?)
      )
    ) lastMessage ON u.id = lastMessage.otherUserId
    LEFT JOIN (
      SELECT senderId, COUNT(*) as count
      FROM messages WHERE receiverId = ? AND is_read = 0
      GROUP BY senderId
    ) unreadCount ON u.id = unreadCount.senderId
    ORDER BY lastMessage.createdAt DESC
  `;
  const [rows] = await db.query(q, [req.user.id, req.user.id, req.user.id, req.user.id]);
  return res.status(200).json(rows);
};

// Update typing status
export const updateTypingStatus = async (req, res) => {
  const { receiverId, isTyping } = req.body;

  await db.query(
    `INSERT INTO typing_status (userId, receiverId, isTyping, updatedAt)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE isTyping = VALUES(isTyping), updatedAt = VALUES(updatedAt)`,
    [req.user.id, receiverId, isTyping ? 1 : 0, now()]
  );

  return res.status(200).json("Typing status updated");
};

// Get typing status
export const getTypingStatus = async (req, res) => {
  const { senderId } = req.params;

  const [rows] = await db.query(
    `SELECT isTyping, updatedAt FROM typing_status
     WHERE userId = ? AND receiverId = ?
       AND updatedAt >= DATE_SUB(NOW(), INTERVAL 10 SECOND)`,
    [senderId, req.user.id]
  );

  return res.status(200).json(rows[0] || { isTyping: false });
};

// Search messages within a conversation
export const searchMessages = async (req, res) => {
  const { query, receiverId } = req.query;
  if (!query || !receiverId) {
    throw new ApiError(400, "query and receiverId are required.");
  }

  const [rows] = await db.query(
    `${MESSAGE_SELECT}
     WHERE m.text LIKE ?
       AND ((m.senderId = ? AND m.receiverId = ?)
            OR (m.senderId = ? AND m.receiverId = ?))
     ORDER BY m.createdAt DESC LIMIT 50`,
    [`%${query}%`, req.user.id, receiverId, receiverId, req.user.id]
  );

  return res.status(200).json(rows);
};

// Mark messages as delivered
export const markAsDelivered = async (req, res) => {
  const { senderId } = req.params;
  await db.query(
    "UPDATE messages SET is_delivered = 1 WHERE senderId = ? AND receiverId = ? AND is_delivered = 0",
    [senderId, req.user.id]
  );
  return res.status(200).json("Messages marked as delivered");
};

// Get unread message count grouped by sender
export const getUnreadCount = async (req, res) => {
  const [rows] = await db.query(
    "SELECT senderId, COUNT(*) as count FROM messages WHERE receiverId = ? AND is_read = 0 GROUP BY senderId",
    [req.user.id]
  );

  const totalUnread = rows.reduce((sum, item) => sum + item.count, 0);
  return res.status(200).json({ totalUnread, byUser: rows });
};

// Delete a message
export const deleteMessage = async (req, res) => {
  const [result] = await db.query(
    "DELETE FROM messages WHERE `id`=? AND `senderId` = ?",
    [req.params.id, req.user.id]
  );
  if (result.affectedRows > 0) return res.status(200).json("Message has been deleted.");
  throw new ApiError(403, "You can delete only your own message");
};

// Mark a conversation's messages as read (PUT /api/messages/:receiverId/read)
export const markAsRead = async (req, res) => {
  const { receiverId } = req.params;
  await db.query(
    "UPDATE messages SET is_read = 1 WHERE senderId = ? AND receiverId = ? AND is_read = 0",
    [receiverId, req.user.id]
  );
  return res.status(200).json("Messages marked as read");
};
