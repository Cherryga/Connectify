-- Complete Database Setup for SocialPulse
-- Run this in your MySQL database

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS mydevify_social;
USE mydevify_social;

-- Import the main schema
-- (Make sure mydevify_social.sql is imported first)

-- Add notifications table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fromUserId` int(11) NOT NULL,
  `toUserId` int(11) NOT NULL,
  `type` enum('like','comment','follow','message','post') NOT NULL,
  `postId` int(11) DEFAULT NULL,
  `message` varchar(500) NOT NULL,
  `read` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fromUserId` (`fromUserId`),
  KEY `toUserId` (`toUserId`),
  KEY `postId` (`postId`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`fromUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`toUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add messages table
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `senderId` int(11) NOT NULL,
  `receiverId` int(11) NOT NULL,
  `message` text NOT NULL,
  `read` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `senderId` (`senderId`),
  KEY `receiverId` (`receiverId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add saved_posts table
CREATE TABLE IF NOT EXISTS `saved_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_post` (`userId`, `postId`),
  KEY `userId` (`userId`),
  KEY `postId` (`postId`),
  CONSTRAINT `saved_posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `saved_posts_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert test users
INSERT INTO users (username, email, password, name) VALUES 
('testuser', 'test@example.com', '$2a$10$CcYmjwVjtrHMl.sYvDQc3OlkNT1pkBcorlrkUIzkyIx7pGYN/a6lG', 'Test User'),
('john_doe', 'john@example.com', '$2a$10$CcYmjwVjtrHMl.sYvDQc3OlkNT1pkBcorlrkUIzkyIx7pGYN/a6lG', 'John Doe'),
('jane_smith', 'jane@example.com', '$2a$10$CcYmjwVjtrHMl.sYvDQc3OlkNT1pkBcorlrkUIzkyIx7pGYN/a6lG', 'Jane Smith'),
('alice_wilson', 'alice@example.com', '$2a$10$CcYmjwVjtrHMl.sYvDQc3OlkNT1pkBcorlrkUIzkyIx7pGYN/a6lG', 'Alice Wilson'),
('bob_brown', 'bob@example.com', '$2a$10$CcYmjwVjtrHMl.sYvDQc3OlkNT1pkBcorlrkUIzkyIx7pGYN/a6lG', 'Bob Brown')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert test posts
INSERT INTO posts (desc, img, userid, createdAt) VALUES 
('Welcome to SocialPulse! This is a test post.', '', 1, NOW()),
('Another test post with some content.', '', 1, NOW()),
('Hello from John!', '', 2, NOW()),
('Jane here! Loving this platform.', '', 3, NOW()),
('Alice checking in! 👋', '', 4, NOW()),
('Bob says hi everyone!', '', 5, NOW()),
('Beautiful sunset today! 🌅', '1708889386896photo-1534528741775-53994a69daeb.jpg', 1, NOW()),
('Coffee time! ☕', '1708889393853photo-1534528741775-53994a69daeb.jpg', 2, NOW())
ON DUPLICATE KEY UPDATE desc = VALUES(desc);

-- Insert test stories
INSERT INTO stories (img, userid, createdAt) VALUES 
('1708889386896photo-1534528741775-53994a69daeb.jpg', 1, NOW()),
('1708889393853photo-1534528741775-53994a69daeb.jpg', 2, NOW()),
('1708889450326photo-1534528741775-53994a69daeb.jpg', 3, NOW())
ON DUPLICATE KEY UPDATE img = VALUES(img);

-- Insert some relationships (follows)
INSERT INTO relationships (followeruserid, followeduserid) VALUES 
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 3),
(3, 1),
(3, 2),
(4, 1),
(4, 2),
(5, 1),
(5, 3)
ON DUPLICATE KEY UPDATE followeruserid = VALUES(followeruserid);

-- Insert some likes
INSERT INTO likes (userid, postid) VALUES 
(1, 1),
(2, 1),
(3, 1),
(1, 2),
(2, 2),
(1, 3),
(3, 3),
(1, 4),
(2, 4)
ON DUPLICATE KEY UPDATE userid = VALUES(userid);

-- Insert some comments
INSERT INTO comments (desc, userid, postid) VALUES 
('Great post!', 2, 1),
('Thanks for sharing!', 3, 1),
('Awesome content!', 1, 2),
('Love this!', 2, 3),
('Amazing!', 3, 4),
('Keep it up!', 4, 1)
ON DUPLICATE KEY UPDATE desc = VALUES(desc);

-- Insert test messages
INSERT INTO messages (senderId, receiverId, message, createdAt) VALUES 
(1, 2, 'Hey John! How are you?', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 1, 'Hi! I\'m doing great, thanks! How about you?', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(1, 2, 'Pretty good! Want to grab coffee later?', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(2, 1, 'Sure! That sounds great! 😊', DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
(1, 3, 'Hey Jane! Loved your latest post!', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(3, 1, 'Thank you! I\'m glad you liked it!', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 4, 'Alice, are you coming to the meetup?', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(4, 1, 'Yes! I\'ll be there! Looking forward to it!', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(2, 3, 'Jane, did you see the new feature?', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(3, 2, 'Yes! It\'s amazing! 🎉', DATE_SUB(NOW(), INTERVAL 30 MINUTE))
ON DUPLICATE KEY UPDATE message = VALUES(message);

-- Insert some notifications
INSERT INTO notifications (fromUserId, toUserId, type, message, createdAt) VALUES 
(2, 1, 'like', 'liked your post', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(3, 1, 'comment', 'commented on your post', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(4, 1, 'follow', 'started following you', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 1, 'message', 'sent you a message', DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
(3, 1, 'message', 'sent you a message', DATE_SUB(NOW(), INTERVAL 1 HOUR))
ON DUPLICATE KEY UPDATE message = VALUES(message);

SELECT 'Database setup completed successfully!' as status; 