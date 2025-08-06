import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req,res)=>{
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    db.query(q, [req.query.followedUserId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map(relationship=>relationship.followerUserId));
    });
}

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.followedUserId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Create notification for follow
      const notificationQuery = "INSERT INTO notifications(`fromUserId`, `toUserId`, `type`, `message`, `createdAt`) VALUES (?)";
      const notificationValues = [
        userInfo.id,
        req.body.followedUserId,
        "follow",
        "started following you",
        new Date().toISOString().slice(0, 19).replace('T', ' '),
      ];
      
      db.query(notificationQuery, [notificationValues], (notifErr) => {
        if (notifErr) console.log("Error creating notification:", notifErr);
      });
      
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};

export const getFriends = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT u.*, 
             (SELECT COUNT(*) FROM relationships r1 
              WHERE r1.followerUserId = ? AND r1.followedUserId IN 
                (SELECT r2.followedUserId FROM relationships r2 WHERE r2.followerUserId = u.id)
             ) as mutualFriends
      FROM users u
      INNER JOIN relationships r ON (r.followerUserId = ? AND r.followedUserId = u.id)
      WHERE u.id != ?
      ORDER BY mutualFriends DESC, u.username ASC
    `;

    db.query(q, [userInfo.id, userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Remove password from response
      const friends = data.map(friend => {
        const { password, ...friendInfo } = friend;
        return friendInfo;
      });
      
      return res.json(friends);
    });
  });
};

export const getFriendRequests = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT u.*, 
             (SELECT COUNT(*) FROM relationships r1 
              WHERE r1.followerUserId = ? AND r1.followedUserId IN 
                (SELECT r2.followedUserId FROM relationships r2 WHERE r2.followerUserId = u.id)
             ) as mutualFriends
      FROM users u
      INNER JOIN relationships r ON (r.followerUserId = u.id AND r.followedUserId = ?)
      WHERE u.id != ?
      ORDER BY u.username ASC
    `;

    db.query(q, [userInfo.id, userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      
      // Remove password from response
      const requests = data.map(request => {
        const { password, ...requestInfo } = request;
        return requestInfo;
      });
      
      return res.json(requests);
    });
  });
};

export const acceptRequest = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.userId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Request accepted");
    });
  });
};

export const rejectRequest = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [req.params.userId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Request rejected");
    });
  });
};