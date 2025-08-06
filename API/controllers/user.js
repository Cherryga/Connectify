import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;

  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" }); // in case tneket show this
    }
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`bio`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.bio,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};

export const getSuggestedUsers = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Get users that the current user is not following
    const q = `
      SELECT u.*, 
             (SELECT COUNT(*) FROM relationships WHERE followeduserid = u.id) as followersCount
      FROM users u 
      WHERE u.id != ? 
      AND u.id NOT IN (
        SELECT followeduserid 
        FROM relationships 
        WHERE followeruserid = ?
      )
      ORDER BY followersCount DESC, u.id DESC
      LIMIT 10
    `;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Remove password from response
      const users = data.map(user => {
        const { password, ...userInfo } = user;
        return userInfo;
      });
      
      return res.json(users);
    });
  });
};

export const searchUsers = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const searchTerm = req.query.q;
    if (!searchTerm) return res.status(400).json("Search term is required");

    const q = `
      SELECT u.*, 
             (SELECT COUNT(*) FROM relationships WHERE followeduserid = u.id) as followersCount,
             (SELECT COUNT(*) FROM relationships WHERE followeruserid = u.id) as followingCount
      FROM users u 
      WHERE (u.username LIKE ? OR u.name LIKE ?) 
      AND u.id != ?
      ORDER BY 
        CASE WHEN u.username LIKE ? THEN 1 
             WHEN u.name LIKE ? THEN 2 
             ELSE 3 END,
        followersCount DESC
      LIMIT 20
    `;

    const searchPattern = `%${searchTerm}%`;
    db.query(q, [searchPattern, searchPattern, userInfo.id, searchPattern, searchPattern], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Remove password from response
      const users = data.map(user => {
        const { password, ...userInfo } = user;
        return userInfo;
      });
      
      return res.json(users);
    });
  });
};

