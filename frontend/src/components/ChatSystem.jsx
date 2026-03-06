import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, 
  faPaperPlane, 
  faPhone, 
  faVideo, 
  faEllipsisVertical,
  faSearch,
  faSmile,
  faPaperclip,
  faMicrophone,
  faCheck,
  faCheckDouble,
  faClock
} from "@fortawesome/free-solid-svg-icons";

const ChatSystem = () => {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Enhanced AI users with more realistic data
  const aiUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "sarah_travels",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      status: "online",
      verified: true,
      type: "travel_blogger",
      lastSeen: "2 minutes ago"
    },
    {
      id: 2,
      name: "Mike Chen",
      username: "mike_photography",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      status: "online",
      verified: true,
      type: "photographer",
      lastSeen: "5 minutes ago"
    },
    {
      id: 3,
      name: "Emma Davis",
      username: "emma_fitness",
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      status: "away",
      verified: false,
      type: "fitness_trainer",
      lastSeen: "10 minutes ago"
    },
    {
      id: 4,
      name: "Alex Thompson",
      username: "alex_tech",
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      status: "online",
      verified: true,
      type: "software_developer",
      lastSeen: "1 minute ago"
    },
    {
      id: 5,
      name: "Lisa Wang",
      username: "lisa_creative",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      status: "offline",
      verified: false,
      type: "artist",
      lastSeen: "1 hour ago"
    },
    {
      id: 6,
      name: "David Kim",
      username: "david_foodie",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      status: "online",
      verified: false,
      type: "chef",
      lastSeen: "3 minutes ago"
    },
    {
      id: 7,
      name: "Maria Garcia",
      username: "maria_yoga",
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      status: "away",
      verified: true,
      type: "yoga_instructor",
      lastSeen: "15 minutes ago"
    },
    {
      id: 8,
      name: "James Wilson",
      username: "james_music",
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      status: "online",
      verified: false,
      type: "musician",
      lastSeen: "just now"
    }
  ];

  // Enhanced messages with more realistic conversations
  const [messages, setMessages] = useState({
    1: [
      { id: 1, senderId: 1, text: "Hey! How's your day going? 😊", timestamp: new Date(Date.now() - 300000), isRead: true, isDelivered: true },
      { id: 2, senderId: currentUser?.id, text: "Hi Sarah! It's going great, thanks for asking. How about yours?", timestamp: new Date(Date.now() - 240000), isRead: true, isDelivered: true },
      { id: 3, senderId: 1, text: "Amazing! Just got back from a beautiful hike in the mountains. The views were incredible! 🏔️", timestamp: new Date(Date.now() - 180000), isRead: true, isDelivered: true },
      { id: 4, senderId: currentUser?.id, text: "That sounds wonderful! Which trail did you take?", timestamp: new Date(Date.now() - 120000), isRead: false, isDelivered: true },
      { id: 5, senderId: 1, text: "The Eagle Peak trail - highly recommend it! Perfect weather today too.", timestamp: new Date(Date.now() - 60000), isRead: false, isDelivered: true }
    ],
    2: [
      { id: 1, senderId: 2, text: "Hey! I saw your latest photo post. The composition is fantastic! 📸", timestamp: new Date(Date.now() - 600000), isRead: true, isDelivered: true },
      { id: 2, senderId: currentUser?.id, text: "Thank you Mike! I've been practicing a lot with the new camera.", timestamp: new Date(Date.now() - 540000), isRead: true, isDelivered: true },
      { id: 3, senderId: 2, text: "It really shows! What settings did you use for that shot?", timestamp: new Date(Date.now() - 480000), isRead: true, isDelivered: true }
    ],
    3: [
      { id: 1, senderId: 3, text: "Good morning! Ready for today's workout? 💪", timestamp: new Date(Date.now() - 900000), isRead: true, isDelivered: true },
      { id: 2, senderId: currentUser?.id, text: "Morning Emma! Yes, I'm excited for it!", timestamp: new Date(Date.now() - 840000), isRead: true, isDelivered: true },
      { id: 3, senderId: 3, text: "Perfect! We're doing a HIIT session today. Get ready to sweat! 🔥", timestamp: new Date(Date.now() - 780000), isRead: false, isDelivered: true }
    ],
    4: [
      { id: 1, senderId: 4, text: "Hey! I checked out that coding tutorial you recommended. It's really helpful!", timestamp: new Date(Date.now() - 1200000), isRead: true, isDelivered: true },
      { id: 2, senderId: currentUser?.id, text: "Great to hear Alex! Which part did you find most useful?", timestamp: new Date(Date.now() - 1140000), isRead: true, isDelivered: true },
      { id: 3, senderId: 4, text: "The React hooks section was exactly what I needed. Thanks again!", timestamp: new Date(Date.now() - 1080000), isRead: true, isDelivered: true }
    ]
  });

  // Filter chats based on search query
  const filteredChats = aiUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (selectedChat && isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping, selectedChat]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUser?.id,
      text: message,
      timestamp: new Date(),
      isRead: false,
      isDelivered: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        const aiResponses = [
          "That's interesting! Tell me more about that.",
          "I completely agree with you on that!",
          "Thanks for sharing that with me! 😊",
          "That sounds amazing! I'd love to hear more details.",
          "You're absolutely right about that!",
          "That's a great point! What made you think of that?",
          "I'm so glad you mentioned that!",
          "That's really insightful! Thanks for the perspective.",
          "I can totally relate to that!",
          "That's wonderful! How did that make you feel?"
        ];

        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        const aiMessage = {
          id: Date.now() + 1,
          senderId: selectedChat.id,
          text: randomResponse,
          timestamp: new Date(),
          isRead: false,
          isDelivered: true
        };

        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: [...(prev[selectedChat.id] || []), aiMessage]
        }));

        setIsTyping(false);
      }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }, 500 + Math.random() * 1000); // Random delay between 0.5-1.5 seconds
  };

  const handleQuickReaction = (emoji) => {
    if (!selectedChat) return;

    const reactionMessage = {
      id: Date.now(),
      senderId: currentUser?.id,
      text: emoji,
      timestamp: new Date(),
      isRead: false,
      isDelivered: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), reactionMessage]
    }));
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return messageTime.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {Object.values(unreadCounts).some(count => count > 0) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-2xl">
            <h3 className="font-semibold text-lg">Messages</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {!selectedChat ? (
            /* Chat List */
            <div className="flex-1 overflow-hidden">
              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.map((user) => {
                  const userMessages = messages[user.id] || [];
                  const lastMessage = userMessages[userMessages.length - 1];
                  const unreadCount = userMessages.filter(m => !m.isRead && m.senderId !== currentUser?.id).length;
                  
                  return (
                    <div
                      key={user.id}
                      onClick={() => setSelectedChat(user)}
                      className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                    >
                      <div className="relative">
                        <img
                          src={user.profilePic}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
                        {user.verified && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 truncate flex items-center gap-1">
                            {user.name}
                            {user.verified && <span className="text-blue-500 text-sm">✓</span>}
                          </h4>
                          {lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTime(lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {lastMessage ? lastMessage.text : "Start a conversation"}
                          </p>
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Chat Conversation */
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                  </button>
                  <div className="relative">
                    <img
                      src={selectedChat.profilePic}
                      alt={selectedChat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedChat.status)}`}></div>
                    {selectedChat.verified && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-1">
                      {selectedChat.name}
                      {selectedChat.verified && <span className="text-blue-500 text-sm">✓</span>}
                    </h4>
                    <p className="text-sm text-gray-500">{selectedChat.status} • {selectedChat.lastSeen}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-600 text-sm" />
                  </button>
                  <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <FontAwesomeIcon icon={faVideo} className="text-gray-600 text-sm" />
                  </button>
                  <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600 text-sm" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(messages[selectedChat.id] || []).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.senderId === currentUser?.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        msg.senderId === currentUser?.id ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{formatTime(msg.timestamp)}</span>
                        {msg.senderId === currentUser?.id && (
                          <FontAwesomeIcon 
                            icon={msg.isRead ? faCheckDouble : msg.isDelivered ? faCheck : faClock} 
                            className="text-xs" 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reactions */}
              <div className="px-4 py-2 border-t border-gray-200">
                <div className="flex space-x-2 mb-2">
                  {['😊', '❤️', '👍', '🎉', '🔥', '👏'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleQuickReaction(emoji)}
                      className="text-lg hover:scale-110 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <FontAwesomeIcon icon={faPaperclip} className="text-gray-600 text-sm" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                      <FontAwesomeIcon icon={faSmile} className="text-gray-600 text-xs" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                  </button>
                  <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <FontAwesomeIcon icon={faMicrophone} className="text-gray-600 text-sm" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatSystem; 