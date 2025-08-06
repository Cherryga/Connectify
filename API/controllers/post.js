import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); 

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    let q, values;
    
    if (userId && userId !== "undefined") {
      // Get posts for specific user
      q = `SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId 
            FROM posts AS p 
            JOIN users AS u ON (u.id = p.userId) 
            WHERE p.userId = ? 
            ORDER BY p.createdAt DESC`;
      values = [userId];
    } else {
      // Get posts from followed users and current user
      q = `SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId 
            FROM posts AS p 
            JOIN users AS u ON (u.id = p.userId)
            LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) 
            WHERE r.followerUserId = ? OR p.userId = ?
            ORDER BY p.createdAt DESC`;
      values = [userInfo.id, userInfo.id];
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getAllPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); 

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Get all posts (like Instagram feed)
    const q = `SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId 
                FROM posts AS p 
                JOIN users AS u ON (u.id = p.userId)
                ORDER BY p.createdAt DESC`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc || "",
      req.body.img || "",
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};

export const getRecentActivities = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Get recent activities from posts, comments, likes, and relationships
    const q = `
      (SELECT 
        u.username,
        'posted' as action,
        p.createdAt as time,
        p.desc as content
      FROM posts p
      JOIN users u ON p.userId = u.id
      WHERE p.userId IN (
        SELECT followedUserId FROM relationships WHERE followerUserId = ?
      ) OR p.userId = ?
      ORDER BY p.createdAt DESC
      LIMIT 5)
      
      UNION ALL
      
      (SELECT 
        u.username,
        'commented' as action,
        c.createdAt as time,
        c.desc as content
      FROM comments c
      JOIN users u ON c.userId = u.id
      JOIN posts p ON c.postId = p.id
      WHERE (c.userId IN (
        SELECT followedUserId FROM relationships WHERE followerUserId = ?
      ) OR c.userId = ?) AND p.userId != c.userId
      ORDER BY c.createdAt DESC
      LIMIT 3)
      
      UNION ALL
      
      (SELECT 
        u.username,
        'liked' as action,
        l.createdAt as time,
        'a post' as content
      FROM likes l
      JOIN users u ON l.userId = u.id
      JOIN posts p ON l.postId = p.id
      WHERE (l.userId IN (
        SELECT followedUserId FROM relationships WHERE followerUserId = ?
      ) OR l.userId = ?) AND p.userId != l.userId
      ORDER BY l.createdAt DESC
      LIMIT 2)
      
      ORDER BY time DESC
      LIMIT 10
    `;

    db.query(q, [userInfo.id, userInfo.id, userInfo.id, userInfo.id, userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Format the time for display
      const activities = data.map(activity => ({
        ...activity,
        time: moment(activity.time).fromNow()
      }));
      
      return res.status(200).json(activities);
    });
  });
};

export const savePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO saved_posts(`userId`, `postId`, `createdAt`) VALUES (?)";
    const values = [
      userInfo.id,
      req.params.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post saved successfully.");
    });
  });
};

export const unsavePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM saved_posts WHERE `userId` = ? AND `postId` = ?";

    db.query(q, [userInfo.id, req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post unsaved successfully.");
    });
  });
};

export const getSavedPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId
      FROM saved_posts sp
      JOIN posts p ON sp.postId = p.id
      JOIN users u ON p.userId = u.id
      WHERE sp.userId = ?
      ORDER BY sp.createdAt DESC
    `;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};