import { db } from "../connect.js";
import { ApiError } from "../middleware/errorHandler.js";

const sanitizeUser = ({ password, ...rest }) => rest;

export const getUser = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.userId]);
  if (rows.length === 0) throw new ApiError(404, "User not found");
  return res.json(sanitizeUser(rows[0]));
};

export const updateUser = async (req, res) => {
  const [result] = await db.query(
    "UPDATE users SET `name`=?, `bio`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?",
    [
      req.body.name,
      req.body.bio,
      req.body.website,
      req.body.profilePic,
      req.body.coverPic,
      req.user.id,
    ]
  );

  if (result.affectedRows > 0) return res.json("Updated!");
  throw new ApiError(403, "You can update only your own profile!");
};

export const getSuggestedUsers = async (req, res) => {
  const q = `
    SELECT u.*,
           (SELECT COUNT(*) FROM relationships WHERE followedUserId = u.id) AS followersCount
    FROM users u
    WHERE u.id != ?
      AND u.id NOT IN (
        SELECT followedUserId FROM relationships WHERE followerUserId = ?
      )
      AND u.id NOT IN (
        SELECT receiverId FROM follow_requests WHERE requesterId = ? AND status = 'pending'
      )
    ORDER BY followersCount DESC, u.id DESC
    LIMIT 10
  `;

  const [rows] = await db.query(q, [req.user.id, req.user.id, req.user.id]);
  return res.json(rows.map(sanitizeUser));
};

export const searchUsers = async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) throw new ApiError(400, "Search term is required");

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

  const pattern = `%${searchTerm}%`;
  const [rows] = await db.query(q, [pattern, pattern, req.user.id, pattern, pattern]);
  return res.json(rows.map(sanitizeUser));
};
