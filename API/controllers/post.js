import moment from "moment/moment.js";
import { db } from "../connect.js";
import { ApiError } from "../middleware/errorHandler.js";

const now = () => moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

export const getPosts = async (req, res) => {
  const userId = req.query.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let q;
  let values;

  if (userId && userId !== "undefined") {
    q = `SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId,
          (SELECT COUNT(*) FROM likes WHERE postId = p.id) AS likes,
          (SELECT COUNT(*) FROM comments WHERE postId = p.id) AS comments
          FROM posts AS p
          JOIN users AS u ON (u.id = p.userId)
          WHERE p.userId = ?
          ORDER BY p.createdAt DESC
          LIMIT ? OFFSET ?`;
    values = [userId, limit, offset];
  } else {
    q = `SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId,
          (SELECT COUNT(*) FROM likes WHERE postId = p.id) AS likes,
          (SELECT COUNT(*) FROM comments WHERE postId = p.id) AS comments
          FROM posts AS p
          JOIN users AS u ON (u.id = p.userId)
          WHERE p.userId = ?
             OR EXISTS (
               SELECT 1 FROM relationships AS r
               WHERE r.followedUserId = p.userId AND r.followerUserId = ?
             )
          ORDER BY p.createdAt DESC
          LIMIT ? OFFSET ?`;
    values = [req.user.id, req.user.id, limit, offset];
  }

  const [rows] = await db.query(q, values);
  return res.status(200).json(rows);
};

export const getAllPosts = async (_req, res) => {
  const q = `SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId,
              (SELECT COUNT(*) FROM likes WHERE postId = p.id) AS likes,
              (SELECT COUNT(*) FROM comments WHERE postId = p.id) AS comments
              FROM posts AS p
              JOIN users AS u ON (u.id = p.userId)
              ORDER BY p.createdAt DESC`;
  const [rows] = await db.query(q);
  return res.status(200).json(rows);
};

// Trending Feed - Posts with the highest engagement score
export const getTrendingPosts = async (_req, res) => {
  const q = `
    SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId,
      COUNT(DISTINCT l.id) AS likes,
      COUNT(DISTINCT c.id) AS comments,
      (COUNT(DISTINCT l.id) + COUNT(DISTINCT c.id) * 2) AS engagementScore
    FROM posts AS p
    JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN likes AS l ON (p.id = l.postId)
    LEFT JOIN comments AS c ON (p.id = c.postId)
    GROUP BY p.id
    ORDER BY engagementScore DESC, p.createdAt DESC
    LIMIT 20
  `;
  const [rows] = await db.query(q);
  return res.status(200).json(rows);
};

// Explore Feed - Posts from users you don't follow
export const getExplorePosts = async (req, res) => {
  const q = `
    SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId,
      COUNT(DISTINCT l.id) as likes,
      COUNT(DISTINCT c.id) as comments
    FROM posts AS p
    JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN likes AS l ON (p.id = l.postId)
    LEFT JOIN comments AS c ON (p.id = c.postId)
    WHERE p.userId NOT IN (
      SELECT followedUserId FROM relationships WHERE followerUserId = ?
    ) AND p.userId != ?
    GROUP BY p.id
    ORDER BY RAND()
    LIMIT 15
  `;
  const [rows] = await db.query(q, [req.user.id, req.user.id]);
  return res.status(200).json(rows);
};

// Filter Feed - by hashtag, post type, or user
export const getFilteredPosts = async (req, res) => {
  const { hashtag, postType, userId } = req.query;

  let q = `
    SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId,
      COUNT(DISTINCT l.id) as likes,
      COUNT(DISTINCT c.id) as comments
    FROM posts AS p
    JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN likes AS l ON (p.id = l.postId)
    LEFT JOIN comments AS c ON (p.id = c.postId)
    WHERE 1=1
  `;
  const values = [];

  if (hashtag) {
    q += " AND p.desc LIKE ?";
    values.push(`%${hashtag}%`);
  }

  if (postType) {
    switch (postType) {
      case "images":
        q += " AND p.img != '' AND p.img IS NOT NULL AND p.img NOT LIKE '%.mp4' AND p.img NOT LIKE '%.avi' AND p.img NOT LIKE '%.mov'";
        break;
      case "videos":
        q += " AND (p.img LIKE '%.mp4' OR p.img LIKE '%.avi' OR p.img LIKE '%.mov')";
        break;
      case "text":
        q += " AND (p.img = '' OR p.img IS NULL)";
        break;
    }
  }

  if (userId && userId !== "undefined") {
    q += " AND p.userId = ?";
    values.push(userId);
  }

  q += " GROUP BY p.id ORDER BY p.createdAt DESC LIMIT 20";

  const [rows] = await db.query(q, values);
  return res.status(200).json(rows);
};

// Trending hashtags
export const getTrendingHashtags = async (_req, res) => {
  const q = `
    SELECT hashtag, COUNT(*) AS postCount, COUNT(DISTINCT userId) AS userCount
    FROM (
      SELECT
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(desc, '#', numbers.n), ' ', 1)) AS hashtag,
        userId
      FROM posts
      JOIN (
        SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
      ) numbers
        ON CHAR_LENGTH(desc) - CHAR_LENGTH(REPLACE(desc, '#', '')) >= numbers.n - 1
      WHERE desc LIKE '%#%'
    ) hashtags
    WHERE hashtag <> '' AND hashtag NOT LIKE '#%'
    GROUP BY hashtag
    ORDER BY postCount DESC, userCount DESC
    LIMIT 10
  `;
  const [rows] = await db.query(q);
  return res.status(200).json(rows);
};

export const addPost = async (req, res) => {
  const q = "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?, ?, ?, ?)";
  await db.query(q, [req.body.desc || "", req.body.img || "", now(), req.user.id]);
  return res.status(201).json("Post has been created.");
};

export const deletePost = async (req, res) => {
  const q = "DELETE FROM posts WHERE `id`=? AND `userId`=?";
  const [result] = await db.query(q, [req.params.id, req.user.id]);
  if (result.affectedRows > 0) return res.status(200).json("Post has been deleted.");
  throw new ApiError(403, "You can delete only your own post");
};

export const getRecentActivities = async (req, res) => {
  const q = `
    SELECT 'like' as type, p.createdAt as createdAt, u.username, u.name,
           u.profilePic, p.desc as postDesc, p.img as postImg, p.id as postId
    FROM likes l
    JOIN users u ON l.userId = u.id
    JOIN posts p ON l.postId = p.id
    WHERE p.userId = ?
    UNION ALL
    SELECT 'comment' as type, c.createdAt, u.username, u.name,
           u.profilePic, p.desc as postDesc, p.img as postImg, p.id as postId
    FROM comments c
    JOIN users u ON c.userId = u.id
    JOIN posts p ON c.postId = p.id
    WHERE p.userId = ?
    ORDER BY createdAt DESC
    LIMIT 10
  `;
  const [rows] = await db.query(q, [req.user.id, req.user.id]);
  return res.status(200).json(rows);
};

export const savePost = async (req, res) => {
  const q = "INSERT INTO saved_posts (`userId`, `postId`) VALUES (?, ?)";
  await db.query(q, [req.user.id, req.params.id]);
  return res.status(201).json("Post has been saved.");
};

export const unsavePost = async (req, res) => {
  const q = "DELETE FROM saved_posts WHERE `userId`=? AND `postId`=?";
  await db.query(q, [req.user.id, req.params.id]);
  return res.status(200).json("Post has been unsaved.");
};

export const getSavedPosts = async (req, res) => {
  const q = `
    SELECT p.*, u.username, u.name, u.profilePic, u.id AS userId,
           (SELECT COUNT(*) FROM likes WHERE postId = p.id) AS likes,
           (SELECT COUNT(*) FROM comments WHERE postId = p.id) AS comments
    FROM saved_posts sp
    JOIN posts p ON sp.postId = p.id
    JOIN users u ON p.userId = u.id
    WHERE sp.userId = ?
    ORDER BY sp.createdAt DESC
  `;
  const [rows] = await db.query(q, [req.user.id]);
  return res.status(200).json(rows);
};

export const getSavedPostStatus = async (req, res) => {
  const q = "SELECT 1 FROM saved_posts WHERE `userId`=? AND `postId`=? LIMIT 1";
  const [rows] = await db.query(q, [req.user.id, req.params.id]);
  return res.status(200).json(rows.length > 0);
};
