import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// Get messages between two users
export const getMessages = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { receiverId } = req.params;

    const q = `
      SELECT 
        m.*,
        u.username,
        u.name,
        u.profilePic
      FROM messages m
      JOIN users u ON m.senderId = u.id
      WHERE (m.senderId = ? AND m.receiverId = ?) 
         OR (m.senderId = ? AND m.receiverId = ?)
      ORDER BY m.createdAt ASC
    `;

    db.query(q, [userInfo.id, receiverId, receiverId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Mark messages as read
      const updateQ = `
        UPDATE messages 
        SET is_read = 1 
        WHERE senderId = ? AND receiverId = ? AND is_read = 0
      `;
      
      db.query(updateQ, [receiverId, userInfo.id], (updateErr) => {
        if (updateErr) console.log("Error updating read status:", updateErr);
      });

      return res.status(200).json(data);
    });
  });
};

// Send a message
export const addMessage = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      INSERT INTO messages (senderId, receiverId, text, createdAt, is_read, is_delivered) 
      VALUES (?, ?, ?, ?, 0, 0)
    `;
    
    const values = [
      userInfo.id,
      req.body.receiverId,
      req.body.text,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Get the created message with user info
      const getMessageQ = `
        SELECT 
          m.*,
          u.username,
          u.name,
          u.profilePic
        FROM messages m
        JOIN users u ON m.senderId = u.id
        WHERE m.id = ?
      `;
      
      db.query(getMessageQ, [data.insertId], (getErr, messageData) => {
        if (getErr) return res.status(500).json(getErr);
        return res.status(200).json(messageData[0]);
      });
    });
  });
};

// Get conversations list
export const getConversations = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT 
        u.id,
        u.username,
        u.name,
        u.profilePic,
        u.status,
        lastMessage.text as lastMessage,
        lastMessage.createdAt as lastMessageTime,
        lastMessage.is_read as isRead,
        unreadCount.count as unreadCount
      FROM users u
      INNER JOIN (
        SELECT 
          CASE 
            WHEN senderId = ? THEN receiverId 
            ELSE senderId 
          END as otherUserId,
          text,
          createdAt,
          is_read
        FROM messages m1
        WHERE id = (
          SELECT MAX(id) 
          FROM messages m2 
          WHERE (m2.senderId = ? AND m2.receiverId = m1.receiverId) 
             OR (m2.senderId = m1.senderId AND m2.receiverId = ?)
        )
      ) lastMessage ON u.id = lastMessage.otherUserId
      LEFT JOIN (
        SELECT 
          senderId,
          COUNT(*) as count
        FROM messages 
        WHERE receiverId = ? AND is_read = 0
        GROUP BY senderId
      ) unreadCount ON u.id = unreadCount.senderId
      ORDER BY lastMessage.createdAt DESC
    `;

    db.query(q, [userInfo.id, userInfo.id, userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// Update typing status
export const updateTypingStatus = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { receiverId, isTyping } = req.body;

    // Store typing status in a temporary table or use Redis in production
    const q = `
      INSERT INTO typing_status (userId, receiverId, isTyping, updatedAt) 
      VALUES (?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE 
        isTyping = VALUES(isTyping), 
        updatedAt = VALUES(updatedAt)
    `;
    
    const values = [
      userInfo.id,
      receiverId,
      isTyping ? 1 : 0,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Typing status updated");
    });
  });
};

// Get typing status
export const getTypingStatus = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { senderId } = req.params;

    const q = `
      SELECT isTyping, updatedAt
      FROM typing_status 
      WHERE userId = ? AND receiverId = ? 
        AND updatedAt >= DATE_SUB(NOW(), INTERVAL 10 SECOND)
    `;

    db.query(q, [senderId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data[0] || { isTyping: false });
    });
  });
};

// Search messages
export const searchMessages = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { query, receiverId } = req.query;

    let q = `
      SELECT 
        m.*,
        u.username,
        u.name,
        u.profilePic
      FROM messages m
      JOIN users u ON m.senderId = u.id
      WHERE m.text LIKE ? 
        AND ((m.senderId = ? AND m.receiverId = ?) 
             OR (m.senderId = ? AND m.receiverId = ?))
    `;
    
    const values = [`%${query}%`, userInfo.id, receiverId, receiverId, userInfo.id];

    if (receiverId) {
      q += ` AND (m.senderId = ? OR m.receiverId = ?)`;
      values.push(receiverId, receiverId);
    }

    q += ` ORDER BY m.createdAt DESC LIMIT 50`;

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// Mark messages as delivered
export const markAsDelivered = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { senderId } = req.params;

    const q = `
      UPDATE messages 
      SET is_delivered = 1 
      WHERE senderId = ? AND receiverId = ? AND is_delivered = 0
    `;

    db.query(q, [senderId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Messages marked as delivered");
    });
  });
};

// Get unread message count
export const getUnreadCount = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT 
        senderId,
        COUNT(*) as count
      FROM messages 
      WHERE receiverId = ? AND is_read = 0
      GROUP BY senderId
    `;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      
      const totalUnread = data.reduce((sum, item) => sum + item.count, 0);
      
      return res.status(200).json({
        totalUnread,
        byUser: data
      });
    });
  });
};

// Delete a message
export const deleteMessage = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM messages WHERE `id`=? AND `senderId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Message has been deleted.");
      return res.status(403).json("You can delete only your message");
    });
  });
}; 