-- Add a test user to the database
INSERT INTO users (username, email, password, name) VALUES 
('testuser', 'test@example.com', '$2a$10$CcYmjwVjtrHMl.sYvDQc3OlkNT1pkBcorlrkUIzkyIx7pGYN/a6lG', 'Test User');

-- Add some test posts
INSERT INTO posts (desc, img, userid, createdAt) VALUES 
('Welcome to SocialPulse! This is a test post.', '', 1, NOW()),
('Another test post with some content.', '', 1, NOW());

-- Add some test stories
INSERT INTO stories (img, userid, createdAt) VALUES 
('1708889386896photo-1534528741775-53994a69daeb.jpg', 1, NOW()); 