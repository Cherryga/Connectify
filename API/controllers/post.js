import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
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
            ORDER BY p.createdAt DESC
            LIMIT ? OFFSET ?`;
      values = [userId, limit, offset];
    } else {
      // Get posts from followed users and current user
      q = `SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId 
            FROM posts AS p 
            JOIN users AS u ON (u.id = p.userId)
            LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) 
            WHERE r.followerUserId = ? OR p.userId = ?
            ORDER BY p.createdAt DESC
            LIMIT ? OFFSET ?`;
      values = [userInfo.id, userInfo.id, limit, offset];
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

// New: Trending Feed - Posts with most likes/comments in last 24h
export const getTrendingPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); 

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT 
        p.*, 
        u.username, 
        u.name, 
        u.profilePic, 
        u.id AS userId,
        COUNT(DISTINCT l.id) as likeCount,
        COUNT(DISTINCT c.id) as commentCount,
        (COUNT(DISTINCT l.id) + COUNT(DISTINCT c.id) * 2) as engagementScore
      FROM posts AS p 
      JOIN users AS u ON (u.id = p.userId)
      LEFT JOIN likes AS l ON (p.id = l.postId)
      LEFT JOIN comments AS c ON (p.id = c.postId)
      WHERE p.createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY p.id
      HAVING engagementScore > 0
      ORDER BY engagementScore DESC, p.createdAt DESC
      LIMIT 20
    `;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// New: Explore Feed - Random posts from users you don't follow
export const getExplorePosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); 

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT 
        p.*, 
        u.username, 
        u.name, 
        u.profilePic, 
        u.id AS userId,
        COUNT(DISTINCT l.id) as likeCount,
        COUNT(DISTINCT c.id) as commentCount
      FROM posts AS p 
      JOIN users AS u ON (u.id = p.userId)
      LEFT JOIN likes AS l ON (p.id = l.postId)
      LEFT JOIN comments AS c ON (p.id = c.postId)
      WHERE p.userId NOT IN (
        SELECT followedUserId 
        FROM relationships 
        WHERE followerUserId = ?
      ) AND p.userId != ?
      GROUP BY p.id
      ORDER BY RAND()
      LIMIT 15
    `;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// New: Filter Feed - By hashtag, post type
export const getFilteredPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); 

  const { hashtag, postType, userId } = req.query;

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    let q = `
      SELECT 
        p.*, 
        u.username, 
        u.name, 
        u.profilePic, 
        u.id AS userId,
        COUNT(DISTINCT l.id) as likeCount,
        COUNT(DISTINCT c.id) as commentCount
      FROM posts AS p 
      JOIN users AS u ON (u.id = p.userId)
      LEFT JOIN likes AS l ON (p.id = l.postId)
      LEFT JOIN comments AS c ON (p.id = c.postId)
      WHERE 1=1
    `;
    
    const values = [];

    // Filter by hashtag
    if (hashtag) {
      q += ` AND p.desc LIKE ?`;
      values.push(`%${hashtag}%`);
    }

    // Filter by post type
    if (postType) {
      switch (postType) {
        case 'images':
          q += ` AND p.img != '' AND p.img IS NOT NULL AND p.img NOT LIKE '%.mp4' AND p.img NOT LIKE '%.avi' AND p.img NOT LIKE '%.mov'`;
          break;
        case 'videos':
          q += ` AND (p.img LIKE '%.mp4' OR p.img LIKE '%.avi' OR p.img LIKE '%.mov')`;
          break;
        case 'text':
          q += ` AND (p.img = '' OR p.img IS NULL)`;
          break;
      }
    }

    // Filter by user
    if (userId && userId !== "undefined") {
      q += ` AND p.userId = ?`;
      values.push(userId);
    }

    q += ` GROUP BY p.id ORDER BY p.createdAt DESC LIMIT 20`;

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// New: Get hashtags for trending
export const getTrendingHashtags = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); 

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT 
        hashtag,
        COUNT(*) as postCount,
        COUNT(DISTINCT p.userId) as userCount
      FROM (
        SELECT 
          SUBSTRING_INDEX(SUBSTRING_INDEX(p.desc, '#', -1), ' ', 1) as hashtag,
          p.id,
          p.userId
        FROM posts p 
        WHERE p.desc LIKE '%#%' 
        AND p.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ) hashtags
      JOIN posts p ON p.id = hashtags.id
      WHERE hashtag != ''
      GROUP BY hashtag
      ORDER BY postCount DESC, userCount DESC
      LIMIT 10
    `;

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

    const q = `
      SELECT 
        'like' as type,
        l.createdAt,
        u.username,
        u.name,
        u.profilePic,
        p.desc as postDesc,
        p.img as postImg
      FROM likes l
      JOIN users u ON l.userId = u.id
      JOIN posts p ON l.postId = p.id
      WHERE p.userId = ?
      UNION ALL
      SELECT 
        'comment' as type,
        c.createdAt,
        u.username,
        u.name,
        u.profilePic,
        p.desc as postDesc,
        p.img as postImg
      FROM comments c
      JOIN users u ON c.userId = u.id
      JOIN posts p ON c.postId = p.id
      WHERE p.userId = ?
      ORDER BY createdAt DESC
      LIMIT 10
    `;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const savePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO saved_posts (`userId`, `postId`) VALUES (?)";
    const values = [userInfo.id, req.params.id];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been saved.");
    });
  });
};

export const unsavePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM saved_posts WHERE `userId`=? AND `postId`=?";

    db.query(q, [userInfo.id, req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been unsaved.");
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