import { db } from "../connect.js";
import { createNotificationRecord } from "../services/notificationService.js";

export const getLikes = async (req, res) => {
  const [rows] = await db.query("SELECT userId FROM likes WHERE postId = ?", [req.query.postId]);
  return res.status(200).json(rows.map((like) => like.userId));
};

export const addLike = async (req, res) => {
  const { postId } = req.body;

  await db.query("INSERT INTO likes (`userId`, `postId`) VALUES (?, ?)", [req.user.id, postId]);

  // Notify the post owner (fire-and-forget).
  const [postRows] = await db.query("SELECT userId FROM posts WHERE id = ?", [postId]);
  const postOwnerId = postRows[0]?.userId;
  if (postOwnerId && postOwnerId !== req.user.id) {
    createNotificationRecord({
      fromUserId: req.user.id,
      toUserId: postOwnerId,
      type: "like",
      postId,
      message: "liked your post",
    }).catch((err) => console.warn("Like notification error:", err));
  }

  return res.status(201).json("Post has been liked.");
};

export const deleteLike = async (req, res) => {
  await db.query("DELETE FROM likes WHERE `userId` = ? AND `postId` = ?", [
    req.user.id,
    req.query.postId,
  ]);
  return res.status(200).json("Like has been removed.");
};
