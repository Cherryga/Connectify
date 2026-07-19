-- Enhanced Messaging Tables for Connectify

-- Update messages table to include read/delivered status
ALTER TABLE messages 
ADD COLUMN is_read TINYINT(1) DEFAULT 0,
ADD COLUMN is_delivered TINYINT(1) DEFAULT 0,
ADD COLUMN text TEXT NOT NULL,
CHANGE COLUMN message text;

-- Create typing_status table for real-time typing indicators
CREATE TABLE IF NOT EXISTS typing_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  receiverId INT NOT NULL,
  isTyping TINYINT(1) DEFAULT 0,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_typing (userId, receiverId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE
);

-- Add status column to users table for online/offline status
ALTER TABLE users 
ADD COLUMN status ENUM('online', 'offline', 'away') DEFAULT 'offline',
ADD COLUMN lastSeen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create message_search table for better message search functionality
CREATE TABLE IF NOT EXISTS message_search (
  id INT AUTO_INCREMENT PRIMARY KEY,
  messageId INT NOT NULL,
  searchText TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (messageId) REFERENCES messages(id) ON DELETE CASCADE,
  FULLTEXT(searchText)
);

-- Add indexes for better performance
CREATE INDEX idx_messages_sender_receiver ON messages(senderId, receiverId);
CREATE INDEX idx_messages_created_at ON messages(createdAt);
CREATE INDEX idx_messages_read_status ON messages(is_read, is_delivered);
CREATE INDEX idx_typing_status_user ON typing_status(userId, receiverId);
CREATE INDEX idx_users_status ON users(status, lastSeen);

-- Insert sample data for testing
INSERT INTO typing_status (userId, receiverId, isTyping) VALUES 
(1, 2, 0),
(2, 1, 0);

-- Update existing messages to have proper text content
UPDATE messages SET text = COALESCE(message, 'Hello!') WHERE text IS NULL OR text = '';

-- Add some sample messages for testing
INSERT INTO messages (senderId, receiverId, text, createdAt, is_read, is_delivered) VALUES
(1, 2, 'Hey! How are you doing?', NOW() - INTERVAL 10 MINUTE, 1, 1),
(2, 1, 'I\'m doing great! Thanks for asking.', NOW() - INTERVAL 8 MINUTE, 1, 1),
(1, 2, 'That\'s awesome! What have you been up to?', NOW() - INTERVAL 5 MINUTE, 0, 1),
(2, 1, 'Just working on some new projects. How about you?', NOW() - INTERVAL 2 MINUTE, 0, 0);

-- Update user statuses
UPDATE users SET status = 'online', lastSeen = NOW() WHERE id IN (1, 2);
