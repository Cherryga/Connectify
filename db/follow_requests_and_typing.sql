-- Tables that were previously created lazily at request time in the API layer.
-- Run this once as part of database setup instead.

CREATE TABLE IF NOT EXISTS follow_requests (
  id INT NOT NULL AUTO_INCREMENT,
  requesterId INT NOT NULL,
  receiverId INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  createdAt DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY unique_request_pair (requesterId, receiverId),
  KEY idx_receiver_status (receiverId, status),
  KEY idx_requester_status (requesterId, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS typing_status (
  userId INT NOT NULL,
  receiverId INT NOT NULL,
  isTyping TINYINT(1) NOT NULL DEFAULT 0,
  updatedAt DATETIME NOT NULL,
  PRIMARY KEY (userId, receiverId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
