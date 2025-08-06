import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faRobot, 
  faTimes, 
  faPaperPlane, 
  faMicrophone,
  faSmile,
  faLightbulb,
  faQuestionCircle,
  faCog
} from "@fortawesome/free-solid-svg-icons";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today? 😊",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced AI responses with context awareness
  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greeting patterns
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Great to see you! How can I assist you today? 😊";
    }
    
    // Help patterns
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! I can assist with:\n• Posting content\n• Managing your profile\n• Using features\n• Troubleshooting\nWhat do you need help with?";
    }
    
    // Posting patterns
    if (lowerMessage.includes('post') || lowerMessage.includes('upload') || lowerMessage.includes('share')) {
      return "To create a post:\n1. Click the 'Share' button\n2. Add your text and media\n3. Choose post type (Post/Story)\n4. Click 'Share' to publish! 📝";
    }
    
    // Profile patterns
    if (lowerMessage.includes('profile') || lowerMessage.includes('edit') || lowerMessage.includes('update')) {
      return "To edit your profile:\n1. Go to your profile page\n2. Click 'Edit Profile'\n3. Update your information\n4. Save changes! ✏️";
    }
    
    // Features patterns
    if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('how to')) {
      return "Our platform features:\n• 📱 Instagram-like feed\n• 🎬 Reels with videos\n• 💬 Real-time chat system\n• 📸 Stories\n• 👥 User profiles\n• 🤖 AI assistant (that's me!)\nWhat interests you most?";
    }
    
    // Technical patterns
    if (lowerMessage.includes('error') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
      return "I'm sorry you're experiencing issues! Try:\n1. Refreshing the page\n2. Checking your internet connection\n3. Clearing browser cache\nIf the problem persists, please describe it in detail.";
    }
    
    // General conversation
    if (lowerMessage.includes('how are you')) {
      return "I'm doing great, thank you for asking! I'm excited to help you explore our social media platform. What would you like to know? 😄";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're very welcome! I'm here to help anytime. Is there anything else you'd like to know? 😊";
    }
    
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Goodbye! Have a wonderful day! Feel free to chat with me anytime. 👋";
    }
    
    // Default responses for unknown queries
    const defaultResponses = [
      "That's an interesting question! Let me help you with that. Could you provide more details?",
      "I'd love to help you with that! What specific aspect would you like to know more about?",
      "Great question! I'm here to assist you. Can you tell me more about what you're looking for?",
      "I'm excited to help! Could you clarify what you'd like to know about our platform?",
      "That sounds interesting! I'm here to guide you. What would you like to explore?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: "How to post?", icon: faLightbulb },
    { text: "Edit profile", icon: faCog },
    { text: "Features", icon: faQuestionCircle }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action.text);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faRobot} className="text-xl" />
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faRobot} className="text-sm" />
                </div>
                <div>
                  <span className="font-semibold">AI Assistant</span>
                  <div className="text-xs text-blue-100">Online • Ready to help</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-gray-500 mb-2">Quick actions:</div>
              <div className="flex space-x-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={action.icon} className="text-xs" />
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <FontAwesomeIcon icon={faMicrophone} className="text-gray-600 text-sm" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <FontAwesomeIcon icon={faSmile} className="text-gray-600 text-sm" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 