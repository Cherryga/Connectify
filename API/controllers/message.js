import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";

export const getConversations = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT DISTINCT 
        u.id,
        u.username,
        u.name,
        u.profilePic,
        (
          SELECT m.message 
          FROM messages m 
          WHERE (m.senderId = ? AND m.receiverId = u.id) 
             OR (m.senderId = u.id AND m.receiverId = ?)
          ORDER BY m.createdAt DESC 
          LIMIT 1
        ) as lastMessage,
        (
          SELECT m.createdAt 
          FROM messages m 
          WHERE (m.senderId = ? AND m.receiverId = u.id) 
             OR (m.senderId = u.id AND m.receiverId = ?)
          ORDER BY m.createdAt DESC 
          LIMIT 1
        ) as lastMessageTime,
        (
          SELECT COUNT(*) 
          FROM messages m 
          WHERE m.senderId = u.id 
            AND m.receiverId = ? 
            AND m.read = 0
        ) as unreadCount
      FROM users u
      INNER JOIN messages m ON (m.senderId = ? AND m.receiverId = u.id) 
                           OR (m.senderId = u.id AND m.receiverId = ?)
      WHERE u.id != ?
      ORDER BY lastMessageTime DESC
    `;

    db.query(q, [userInfo.id, userInfo.id, userInfo.id, userInfo.id, userInfo.id, userInfo.id, userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Remove duplicates and format
      const conversations = data.filter((conv, index, self) => 
        index === self.findIndex(c => c.id === conv.id)
      );
      
      return res.json(conversations);
    });
  });
};

export const getMessages = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const conversationId = req.params.conversationId;

    const q = `
      SELECT m.*, 
             s.username as senderUsername,
             s.profilePic as senderProfilePic,
             r.username as receiverUsername,
             r.profilePic as receiverProfilePic
      FROM messages m
      JOIN users s ON m.senderId = s.id
      JOIN users r ON m.receiverId = r.id
      WHERE (m.senderId = ? AND m.receiverId = ?) 
         OR (m.senderId = ? AND m.receiverId = ?)
      ORDER BY m.createdAt ASC
    `;

    db.query(q, [userInfo.id, conversationId, conversationId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Mark messages as read
      const markAsReadQuery = `
        UPDATE messages 
        SET read = 1 
        WHERE senderId = ? AND receiverId = ? AND read = 0
      `;
      
      db.query(markAsReadQuery, [conversationId, userInfo.id], (markErr) => {
        if (markErr) console.log("Error marking messages as read:", markErr);
      });
      
      return res.json(data);
    });
  });
};

export const sendMessage = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO messages(`senderId`, `receiverId`, `message`, `createdAt`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.receiverId,
      req.body.message,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Create notification for new message
      const notificationQuery = "INSERT INTO notifications(`fromUserId`, `toUserId`, `type`, `message`, `createdAt`) VALUES (?)";
      const notificationValues = [
        userInfo.id,
        req.body.receiverId,
        "message",
        "sent you a message",
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      ];
      
      db.query(notificationQuery, [notificationValues], (notifErr) => {
        if (notifErr) console.log("Error creating notification:", notifErr);
      });
      
      return res.json("Message sent successfully");
    });
  });
};

export const markAsRead = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const conversationId = req.params.conversationId;

    const q = "UPDATE messages SET `read` = 1 WHERE `senderId` = ? AND `receiverId` = ? AND `read` = 0";

    db.query(q, [conversationId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Messages marked as read");
    });
  });
}; 