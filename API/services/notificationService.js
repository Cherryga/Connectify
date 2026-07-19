import moment from "moment/moment.js";
import { db } from "../connect.js";
import { emitToUser } from "../socket.js";

const mapNotificationRow = (row) => ({
  ...row,
  time: moment(row.createdAt).fromNow(),
  fromUser: {
    id: row.fromUserId,
    username: row.fromUsername,
    name: row.fromUserName,
    profilePic: row.fromUserProfilePic,
  },
});

export const createNotificationRecord = async ({
  fromUserId,
  toUserId,
  type,
  postId = null,
  message,
}) => {
  const [result] = await db.query(
    "INSERT INTO notifications (`fromUserId`, `toUserId`, `type`, `postId`, `message`, `createdAt`) VALUES (?, ?, ?, ?, ?, ?)",
    [fromUserId, toUserId, type, postId, message, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")]
  );

  const [rows] = await db.query(
    `SELECT n.*, u.username as fromUsername, u.profilePic as fromUserProfilePic, u.name as fromUserName
     FROM notifications n
     JOIN users u ON n.fromUserId = u.id
     WHERE n.id = ?
     LIMIT 1`,
    [result.insertId]
  );

  const notification = mapNotificationRow(rows[0]);
  emitToUser(toUserId, "notification:new", notification);
  return notification;
};

export const normalizeNotification = mapNotificationRow;
