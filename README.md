# 🌟 Connectify - Full-Stack Social Media Platform

A modern, Instagram-inspired social media platform built with React.js, Node.js, and MySQL. Connectify features real-time interactions, AI-powered assistance, and a beautiful, responsive design.

## ✨ Features

### 📱 Core Social Media Features
- **Instagram-like Feed** - Dynamic post display with image/video support
- **Real-time Interactions** - Like, comment, and share functionality
- **Advanced Reels System** - Vertical video content with music integration
- **Stories Feature** - 24-hour temporary content sharing
- **User Profiles** - Customizable profiles with bio and social links
- **Follow System** - Connect with other users

### 🤖 AI-Powered Features
- **Smart Chatbot Assistant** - Context-aware AI help system
- **AI-Generated Conversations** - Realistic chat with AI users
- **Quick Action Buttons** - Instant help for common tasks
- **Intelligent Responses** - Natural language processing

### 💬 Advanced Communication
- **Real-time Chat System** - Multi-user messaging with AI conversations
- **Message History** - Persistent chat conversations
- **Online Status** - Real-time user presence indicators
- **Search Functionality** - Find users and conversations

### 🎨 Modern UI/UX
- **Beautiful Gradients** - Purple to pink gradient theme
- **Glassmorphism Design** - Modern backdrop blur effects
- **Responsive Layout** - Works perfectly on all devices
- **Smooth Animations** - Hover effects and transitions
- **Dark/Light Mode Ready** - Extensible theme system

### 🔗 Social Integration
- **Share to Social Media** - Twitter, Facebook, WhatsApp integration
- **Copy Link Feature** - Easy content sharing
- **External Platform Support** - Connect with other social networks

## 🚀 Tech Stack

### Frontend
- **React.js 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **React Router DOM** - Client-side routing
- **FontAwesome** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **JWT** - Authentication and authorization
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie parsing middleware

### Database
- **MySQL 8.0** - Primary database
- **Relational Schema** - Users, posts, comments, likes, relationships
- **Optimized Queries** - Fast data retrieval
- **Data Integrity** - Foreign key constraints

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup
```bash
# Navigate to API directory
cd API

# Install dependencies
npm install

# Create MySQL database
mysql -u root -p
CREATE DATABASE mydevify_social;

# Import database schema
mysql -u root -p mydevify_social < mydevify_social.sql

# Configure database connection in connect.js
# Update host, user, password as needed

# Start backend server
npm start
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Key Features in Detail

### 1. Instagram-like Feed System
- Dynamic post loading with React Query
- Image and video support
- Like, comment, and share functionality
- Real-time content updates
- Responsive design for all screen sizes

### 2. Advanced Reels & Stories
- Vertical video reels similar to TikTok
- Interactive story viewing with swipe gestures
- Video controls with play/pause functionality
- Music integration and engagement metrics
- 24-hour story expiration

### 3. Real-time Chat System
- Multi-user chat interface with AI-generated conversations
- Real-time messaging with typing indicators
- User status tracking (online/offline)
- Message history and search functionality
- Beautiful chat UI with gradients

### 4. AI-Powered Assistant
- Intelligent chatbot with context-aware responses
- Quick action buttons for common queries
- Advanced profile editing with image upload
- User authentication and session management
- Natural language processing capabilities

### 5. Social Media Integration
- Share posts to Twitter, Facebook, WhatsApp
- Copy link functionality
- External platform support
- Beautiful share modal design

## 🎨 Design Highlights

### Beautiful UI/UX
- **Gradient Backgrounds** - Purple to pink gradients throughout
- **Glassmorphism Effects** - Modern backdrop blur design
- **Smooth Animations** - Hover effects and transitions
- **Responsive Design** - Mobile-first approach
- **Accessibility** - Proper contrast and readable text

### Modern Components
- **Enhanced Navbar** - Glassmorphism with gradient logo
- **Improved Feed** - Better shadows and hover effects
- **Advanced Modals** - Beautiful share and comment modals
- **Interactive Buttons** - Scale and color transitions

## 📊 Database Schema

### Core Tables
- **users** - User profiles and authentication
- **posts** - Main content storage
- **comments** - Post comments and replies
- **likes** - Post and comment likes
- **relationships** - User follow/following system
- **stories** - Temporary content storage
- **notifications** - User activity notifications
- **messages** - Chat system messages

## 🔧 Configuration

### Environment Variables
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mydevify_social

# JWT Secret
JWT_SECRET=your_jwt_secret

# Server Configuration
PORT=8800
```

### File Upload Configuration
- Supported formats: JPG, PNG, GIF, MP4, AVI, MOV
- Maximum file size: 10MB
- Storage location: `frontend/public/uploads/`

## 🚀 Deployment

### Backend Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files
npm run preview
```
---

**Connectify** - Connecting people through beautiful social experiences! 🌟
