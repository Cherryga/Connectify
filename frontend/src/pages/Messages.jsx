import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSearch, faEllipsisVertical, faSmile, faImage, faMicrophone } from "@fortawesome/free-solid-svg-icons";

const Messages = () => {
  const { currentUser } = useContext(AuthContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Get conversations
  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => makeRequest.get("/messages/conversations").then((res) => res.data),
  });

  // Get messages for selected chat
  const { data: messages } = useQuery({
    queryKey: ['messages', selectedChat?.id],
    queryFn: () => makeRequest.get(`/messages/${selectedChat?.id}`).then((res) => res.data),
    enabled: !!selectedChat,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageText) => 
      makeRequest.post("/messages", {
        receiverId: selectedChat.id,
        message: messageText,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedChat?.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setMessageText("");
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (conversationId) => 
      makeRequest.put(`/messages/${conversationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedChat) {
      markAsReadMutation.mutate(selectedChat.id);
    }
  }, [selectedChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;
    
    sendMessageMutation.mutate(messageText);
  };

  const handleChatSelect = (conversation) => {
    setSelectedChat(conversation);
  };

  const filteredConversations = conversations?.filter(conv => 
    conv.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const emojis = ["😀", "😂", "😍", "🥰", "😎", "🤔", "😢", "😡", "👍", "👎", "❤️", "💔", "🎉", "🎂", "🎁", "🔥", "💯", "✨", "🌟", "💫"];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Conversations List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
          
          {/* Search */}
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations?.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Conversations</h3>
              <p className="text-gray-500">Start a conversation with someone!</p>
            </div>
          ) : (
            filteredConversations?.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleChatSelect(conversation)}
                className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === conversation.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full">
                    <img
                      alt="Profile"
                      src={
                        conversation.profilePic
                          ? `http://localhost:5173/uploads/posts/${conversation.profilePic}`
                          : "http://localhost:5173/default/default_profile.png"
                      }
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900 truncate">
                      {conversation.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full">
                      <img
                        alt="Profile"
                        src={
                          selectedChat.profilePic
                            ? `http://localhost:5173/uploads/posts/${selectedChat.profilePic}`
                            : "http://localhost:5173/default/default_profile.png"
                        }
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    {selectedChat.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedChat.name}</div>
                    <div className="text-sm text-gray-500">
                      {selectedChat.online ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
                <div className="dropdown dropdown-left">
                  <button className="btn btn-ghost btn-sm">
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </button>
                  <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                    <li><button>View Profile</button></li>
                    <li><button>Block</button></li>
                    <li><button>Report</button></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === currentUser?.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="text-sm">{message.message}</div>
                    <div className={`text-xs mt-1 ${
                      message.senderId === currentUser?.id ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {formatTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  
                  {/* Emoji Picker */}
                  {showEmoji && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-8 gap-1">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setMessageText(prev => prev + emoji);
                            setShowEmoji(false);
                          }}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faSmile} />
                </button>
                
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faImage} />
                </button>
                
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faMicrophone} />
                </button>
                
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Conversation</h3>
              <p className="text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;