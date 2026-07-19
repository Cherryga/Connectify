import moment from "moment/moment.js";
import { db } from "../connect.js";
import { ApiError } from "../middleware/errorHandler.js";

const now = () => moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

export const getStories = async (req, res) => {
  const q = `
    SELECT s.*, u.id AS userId, u.username, u.name, u.profilePic
    FROM stories AS s
    JOIN users AS u ON u.id = s.userId
    WHERE s.userId = ?
       OR EXISTS (
         SELECT 1 FROM relationships AS r
         WHERE r.followedUserId = s.userId AND r.followerUserId = ?
       )
    ORDER BY s.createdAt DESC
  `;
  const [rows] = await db.query(q, [req.user.id, req.user.id]);
  return res.status(200).json(rows);
};

export const addStory = async (req, res) => {
  const q = "INSERT INTO stories (`img`, `userId`, `createdAt`) VALUES (?, ?, ?)";
  await db.query(q, [req.body.img, req.user.id, now()]);
  return res.status(201).json("Story has been created.");
};

export const deleteStory = async (req, res) => {
  const q = "DELETE FROM stories WHERE `id`=? AND `userId`=?";
  const [result] = await db.query(q, [req.params.id, req.user.id]);
  if (result.affectedRows > 0) return res.status(200).json("Story has been deleted.");
  throw new ApiError(403, "You can delete only your own story");
};
