# SocialPulse - Enhanced Social Media Platform Setup Guide

## 🚀 Overview

This is a fully functional Instagram-like social media platform built with React, Node.js, and MySQL. The platform now includes:

### ✨ New Features Added:
- **Real-time Search**: Search users with instant results
- **Notifications System**: Like, comment, follow, and message notifications
- **Direct Messaging**: Real-time chat with conversation management
- **Enhanced Rightbar**: Suggested friends, trending topics, recent activities
- **Friends Management**: Friend requests, suggestions, and mutual friends
- **Post Interactions**: Like, comment, save posts with notifications
- **Modern UI**: Instagram-like interface with responsive design

## 📋 Database Setup

### 1. Create the Database
```sql
CREATE DATABASE mydevify_social;
USE mydevify_social;
```

### 2. Import Base Schema
Import the existing `mydevify_social.sql` file.

### 3. Add New Tables
Run these SQL commands to add the new features:

```sql
-- Notifications table
CREATE TABLE `notifications` (
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

-- Messages table
CREATE TABLE `messages` (
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

-- Saved posts table
CREATE TABLE `saved_posts` (
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
```

## 🛠️ Installation

### Backend Setup
```bash
cd API
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 🚀 Running the Application

### 1. Start the Backend
```bash
cd API
npm start
```
The backend will run on `http://localhost:8800`

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## 🎯 Key Features

### 🔍 Search & Discovery
- **Real-time User Search**: Search users by username or name
- **Suggested Friends**: AI-powered friend suggestions
- **Trending Topics**: Popular hashtags and topics

### 💬 Messaging
- **Direct Messages**: Real-time chat with any user
- **Conversation Management**: View all conversations
- **Message Notifications**: Get notified of new messages

### 👥 Social Features
- **Friend Requests**: Send and accept friend requests
- **Follow/Unfollow**: Follow users and see their posts
- **Mutual Friends**: See how many mutual friends you have
- **Activity Feed**: See recent activities from friends

### 📱 Post Interactions
- **Like Posts**: Like posts with real-time updates
- **Comment System**: Comment on posts with notifications
- **Save Posts**: Save posts to view later
- **Post Notifications**: Get notified when someone interacts with your posts

### 🔔 Notifications
- **Real-time Notifications**: Instant notifications for all activities
- **Notification Types**: Like, comment, follow, and message notifications
- **Mark as Read**: Mark notifications as read

### 🎨 Modern UI
- **Instagram-like Design**: Clean, modern interface
- **Responsive Layout**: Works on all devices
- **Dark/Light Mode**: Toggle between themes
- **Smooth Animations**: Smooth transitions and interactions

## 📁 File Structure

```
SocialPulse/
├── API/
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── comment.js
│   │   ├── like.js
│   │   ├── message.js          # NEW: Messaging functionality
│   │   ├── notification.js     # NEW: Notifications system
│   │   ├── post.js
│   │   ├── relationship.js
│   │   ├── story.js
│   │   └── user.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── comments.js
│   │   ├── likes.js
│   │   ├── messages.js         # NEW: Message routes
│   │   ├── notifications.js    # NEW: Notification routes
│   │   ├── posts.js
│   │   ├── relationships.js
│   │   ├── stories.js
│   │   └── users.js
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Leftbar.jsx     # Enhanced with navigation
│   │   │   ├── Navbar.jsx      # NEW: Search & notifications
│   │   │   ├── Post.jsx        # Enhanced with interactions
│   │   │   ├── Posts.jsx
│   │   │   ├── Rightbar.jsx    # NEW: Suggested friends & trends
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Friends.jsx     # NEW: Friends management
│   │   │   ├── Messages.jsx    # NEW: Messaging system
│   │   │   └── ...
│   │   └── ...
│   └── ...
└── ...
```

## 🔧 Configuration

### Database Connection
Update `API/connect.js` with your MySQL credentials:
```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "mydevify_social",
});
```

### Environment Variables
Create `.env` files if needed for sensitive data.

## 🎉 Getting Started

1. **Register/Login**: Create an account or login
2. **Complete Profile**: Add profile picture and bio
3. **Find Friends**: Search for users or browse suggestions
4. **Start Posting**: Share photos and updates
5. **Engage**: Like, comment, and save posts
6. **Message**: Start conversations with friends
7. **Stay Updated**: Check notifications for new activities

## 🚀 Advanced Features

### Real-time Updates
- Posts update in real-time
- Notifications appear instantly
- Messages sync across devices
- Like counts update live

### Social Algorithms
- Friend suggestions based on mutual connections
- Trending topics calculation
- Activity feed prioritization
- Smart search with relevance scoring

### Performance Optimizations
- Lazy loading for images
- Pagination for posts
- Caching for frequently accessed data
- Optimized database queries

## 🐛 Troubleshooting

### Common Issues:
1. **Database Connection**: Ensure MySQL is running and credentials are correct
2. **Port Conflicts**: Check if ports 8800 and 5173 are available
3. **CORS Issues**: Backend CORS is configured for localhost:5173
4. **File Uploads**: Ensure uploads directory has write permissions

### Debug Mode:
- Backend: Add `console.log()` statements in controllers
- Frontend: Use browser developer tools
- Database: Check MySQL logs for query errors

## 📈 Future Enhancements

- **Real-time Video Calls**: WebRTC integration
- **Stories Feature**: 24-hour disappearing posts
- **Live Streaming**: Real-time video streaming
- **E-commerce**: Marketplace integration
- **AI Recommendations**: Machine learning for content
- **Mobile App**: React Native version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**🎉 Congratulations!** You now have a fully functional Instagram-like social media platform with real-time features, modern UI, and comprehensive social networking capabilities. 