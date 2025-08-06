import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPaperPlane, 
  faTimes, 
  faSearch, 
  faEllipsisVertical,
  faCircle,
  faImage,
  faSmile
} from "@fortawesome/free-solid-svg-icons";

const ChatSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const messagesEndRef = useRef(null);

  // AI-generated users for realistic conversations
  const aiUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "sarah_travels",
      profilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      status: "online",
      lastMessage: "That sunset was absolutely breathtaking!",
      lastTime: "2m ago",
      messages: [
        { id: 1, text: "Hey! How's your day going?", sender: "them", time: "10:30 AM" },
        { id: 2, text: "Pretty good! Just finished editing some travel photos", sender: "me", time: "10:32 AM" },
        { id: 3, text: "Oh nice! Where did you go recently?", sender: "them", time: "10:35 AM" },
        { id: 4, text: "Just got back from Bali! The beaches were incredible", sender: "me", time: "10:37 AM" },
        { id: 5, text: "That sounds amazing! I've always wanted to visit Bali", sender: "them", time: "10:40 AM" },
        { id: 6, text: "You should definitely go! The sunsets are magical", sender: "me", time: "10:42 AM" },
        { id: 7, text: "That sunset was absolutely breathtaking!", sender: "them", time: "10:45 AM" }
      ]
    },
    {
      id: 2,
      name: "Mike Chen",
      username: "mike_fitness",
      profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      status: "online",
      lastMessage: "Great workout today! 💪",
      lastTime: "5m ago",
      messages: [
        { id: 1, text: "Hey! Ready for our workout session?", sender: "them", time: "9:00 AM" },
        { id: 2, text: "Absolutely! What's on the agenda today?", sender: "me", time: "9:02 AM" },
        { id: 3, text: "Thinking about some HIIT training", sender: "them", time: "9:05 AM" },
        { id: 4, text: "Perfect! I love high-intensity workouts", sender: "me", time: "9:07 AM" },
        { id: 5, text: "Great workout today! 💪", sender: "them", time: "9:30 AM" }
      ]
    },
    {
      id: 3,
      name: "Emma Davis",
      username: "emma_foodie",
      profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      status: "offline",
      lastMessage: "That recipe looks delicious!",
      lastTime: "1h ago",
      messages: [
        { id: 1, text: "Hi! I saw your food post, it looks amazing!", sender: "them", time: "8:00 AM" },
        { id: 2, text: "Thank you! It's my grandmother's recipe", sender: "me", time: "8:05 AM" },
        { id: 3, text: "Would you mind sharing the recipe?", sender: "them", time: "8:10 AM" },
        { id: 4, text: "Of course! I'll send it to you", sender: "me", time: "8:15 AM" },
        { id: 5, text: "That recipe looks delicious!", sender: "them", time: "8:20 AM" }
      ]
    },
    {
      id: 4,
      name: "Alex Thompson",
      username: "alex_tech",
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      status: "online",
      lastMessage: "The new features look great!",
      lastTime: "30m ago",
      messages: [
        { id: 1, text: "Hey! I checked out your latest project", sender: "them", time: "11:00 AM" },
        { id: 2, text: "Thanks! What did you think?", sender: "me", time: "11:05 AM" },
        { id: 3, text: "Really impressive work! The UI is so clean", sender: "them", time: "11:10 AM" },
        { id: 4, text: "I appreciate that! Took a lot of iterations", sender: "me", time: "11:15 AM" },
        { id: 5, text: "The new features look great!", sender: "them", time: "11:20 AM" }
      ]
    }
  ];

  useEffect(() => {
    setChats(aiUsers);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: message,
          lastTime: "now"
        };
      }
      return chat;
    }));

    setMessage("");

    // Simulate AI response after 2 seconds
    setTimeout(() => {
      const responses = [
        "That's really interesting! Tell me more about that.",
        "I totally agree with you! That's a great perspective.",
        "Thanks for sharing that with me! I love hearing about your experiences.",
        "That sounds amazing! I'd love to hear more details.",
        "I'd love to hear more about that! It sounds fascinating.",
        "That's a great point! You always have such thoughtful insights.",
        "Thanks for the update! I'm always excited to hear from you.",
        "That's awesome! 😊 You have such a positive energy.",
        "I'm really impressed by that! You're doing great things.",
        "That's such a beautiful way to look at it! Thank you for sharing."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "them",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prev => prev.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, aiMessage],
            lastMessage: randomResponse,
            lastTime: "now"
          };
        }
        return chat;
      }));
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faPaperPlane} className="text-xl" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                </div>
                <span className="font-semibold">Messages</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          {/* Chat List or Chat View */}
          {!selectedChat ? (
            // Chat List
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                </div>
                
                <div className="space-y-2">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={chat.profilePic}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          chat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500">{chat.lastTime}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chat View
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                  </button>
                  <div className="relative">
                    <img
                      src={selectedChat.profilePic}
                      alt={selectedChat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      selectedChat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">@{selectedChat.username}</p>
                  </div>
                </div>
                <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.sender === 'me'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'me' ? 'text-purple-100' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <FontAwesomeIcon icon={faImage} className="text-gray-600" />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <FontAwesomeIcon icon={faSmile} className="text-gray-600" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
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