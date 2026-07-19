import moment from "moment/moment.js";
import { db } from "../connect.js";
import { ApiError } from "../middleware/errorHandler.js";
import { createNotificationRecord } from "../services/notificationService.js";

const now = () => moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
const stripPassword = ({ password, ...rest }) => rest;

export const getRelationships = async (req, res) => {
  const [rows] = await db.query(
    "SELECT followerUserId FROM relationships WHERE followedUserId = ?",
    [req.query.followedUserId]
  );
  return res.status(200).json(rows.map((relationship) => relationship.followerUserId));
};

export const getRequestStatus = async (req, res) => {
  const targetUserId = Number(req.params.userId);

  const [relationshipRows] = await db.query(
    "SELECT 1 FROM relationships WHERE followerUserId = ? AND followedUserId = ? LIMIT 1",
    [req.user.id, targetUserId]
  );

  const [requestRows] = await db.query(
    `SELECT requesterId, receiverId, status
     FROM follow_requests
     WHERE ((requesterId = ? AND receiverId = ?) OR (requesterId = ? AND receiverId = ?))
       AND status = 'pending'
     LIMIT 1`,
    [req.user.id, targetUserId, targetUserId, req.user.id]
  );

  const request = requestRows[0];
  return res.status(200).json({
    following: relationshipRows.length > 0,
    outgoingPending: request ? request.requesterId === req.user.id : false,
    incomingPending: request ? request.receiverId === req.user.id : false,
  });
};

export const addRelationship = async (req, res) => {
  const receiverUserId = Number(req.body.followedUserId);
  if (!receiverUserId || receiverUserId === req.user.id) {
    throw new ApiError(400, "Invalid follow request.");
  }

  const [existing] = await db.query(
    "SELECT 1 FROM relationships WHERE followerUserId = ? AND followedUserId = ? LIMIT 1",
    [req.user.id, receiverUserId]
  );
  if (existing.length) return res.status(200).json("Already following");

  await db.query(
    `INSERT INTO follow_requests (requesterId, receiverId, status, createdAt)
     VALUES (?, ?, 'pending', ?)
     ON DUPLICATE KEY UPDATE status = 'pending', createdAt = VALUES(createdAt)`,
    [req.user.id, receiverUserId, now()]
  );

  createNotificationRecord({
    fromUserId: req.user.id,
    toUserId: receiverUserId,
    type: "follow_request",
    message: "sent you a follow request",
  }).catch((err) => console.warn("Follow request notification error:", err));

  return res.status(200).json("Follow request sent");
};

export const deleteRelationship = async (req, res) => {
  const targetUserId = Number(req.query.userId);

  await db.query("DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?", [
    req.user.id,
    targetUserId,
  ]);

  await db.query(
    "DELETE FROM follow_requests WHERE requesterId = ? AND receiverId = ? AND status = 'pending'",
    [req.user.id, targetUserId]
  );

  return res.status(200).json("Unfollow or request cancelled");
};

export const getFriends = async (req, res) => {
  const q = `
    SELECT u.*,
           (SELECT COUNT(*) FROM relationships r1
            WHERE r1.followerUserId = ? AND r1.followedUserId IN
              (SELECT r2.followedUserId FROM relationships r2 WHERE r2.followerUserId = u.id)
           ) AS mutualFriends
    FROM users u
    INNER JOIN relationships r ON (r.followerUserId = ? AND r.followedUserId = u.id)
    WHERE u.id != ?
    ORDER BY mutualFriends DESC, u.username ASC
  `;
  const [rows] = await db.query(q, [req.user.id, req.user.id, req.user.id]);
  return res.json(rows.map(stripPassword));
};

export const getFriendRequests = async (req, res) => {
  const q = `
    SELECT u.id, u.name, u.username, u.profilePic, u.verified, fr.createdAt,
           (SELECT COUNT(*) FROM relationships r1
            WHERE r1.followerUserId = ? AND r1.followedUserId IN
              (SELECT r2.followedUserId FROM relationships r2 WHERE r2.followerUserId = u.id)
           ) AS mutualFriends
    FROM follow_requests fr
    JOIN users u ON u.id = fr.requesterId
    WHERE fr.receiverId = ? AND fr.status = 'pending'
    ORDER BY fr.createdAt DESC
  `;
  const [rows] = await db.query(q, [req.user.id, req.user.id]);
  return res.json(rows);
};

export const acceptRequest = async (req, res) => {
  const requesterId = Number(req.body.userId);

  await db.query(
    "INSERT IGNORE INTO relationships (followerUserId, followedUserId) VALUES (?, ?)",
    [requesterId, req.user.id]
  );

  await db.query(
    "UPDATE follow_requests SET status = 'accepted' WHERE requesterId = ? AND receiverId = ? AND status = 'pending'",
    [requesterId, req.user.id]
  );

  createNotificationRecord({
    fromUserId: req.user.id,
    toUserId: requesterId,
    type: "follow_accept",
    message: "accepted your follow request",
  }).catch((err) => console.warn("Follow accept notification error:", err));

  return res.status(200).json("Request accepted");
};

export const rejectRequest = async (req, res) => {
  await db.query(
    "DELETE FROM follow_requests WHERE requesterId = ? AND receiverId = ? AND status = 'pending'",
    [req.params.userId, req.user.id]
  );
  return res.status(200).json("Request rejected");
};

export const getFollowers = async (req, res) => {
  const q = `
    SELECT u.id, u.name, u.username, u.profilePic, u.verified
    FROM users u
    INNER JOIN relationships r ON r.followerUserId = u.id
    WHERE r.followedUserId = ?
    ORDER BY u.username ASC
  `;
  const [rows] = await db.query(q, [req.params.userId]);
  return res.json(rows.map(stripPassword));
};

export const getFollowing = async (req, res) => {
  const q = `
    SELECT u.id, u.name, u.username, u.profilePic, u.verified
    FROM users u
    INNER JOIN relationships r ON r.followedUserId = u.id
    WHERE r.followerUserId = ?
    ORDER BY u.username ASC
  `;
  const [rows] = await db.query(q, [req.params.userId]);
  return res.json(rows.map(stripPassword));
};
