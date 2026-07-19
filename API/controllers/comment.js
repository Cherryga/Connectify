import { db } from "../connect.js";
import moment from "moment";
import { createNotificationRecord } from "../services/notificationService.js";

const now = () => moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

export const getComments = async (req, res) => {
  const q = `SELECT c.*, username, u.id AS userId, name, profilePic
             FROM comments AS c JOIN users AS u ON (u.id = c.userId)
             WHERE c.postId = ? ORDER BY c.createdAt DESC`;
  const [rows] = await db.query(q, [req.query.postId]);
  return res.status(200).json(rows);
};

export const addComment = async (req, res) => {
  const { desc, postId } = req.body;

  await db.query(
    "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?, ?, ?, ?)",
    [desc, now(), req.user.id, postId]
  );

  // Notify the post owner (fire-and-forget; failure shouldn't fail the request).
  const [postRows] = await db.query("SELECT userId FROM posts WHERE id = ?", [postId]);
  const postOwnerId = postRows[0]?.userId;
  if (postOwnerId && postOwnerId !== req.user.id) {
    createNotificationRecord({
      fromUserId: req.user.id,
      toUserId: postOwnerId,
      type: "comment",
      postId,
      message: "commented on your post",
    }).catch((err) => console.warn("Comment notification error:", err));
  }

  return res.status(201).json("Comment has been added.");
};
