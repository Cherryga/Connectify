import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSearch, faEllipsisVertical, faSmile, faImage, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { getProfileUrl } from "../utils/config";
import { getSocket } from "../utils/socket";

const Messages = () => {
  const { currentUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get("userId");
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: initialChatUser } = useQuery({
    queryKey: ["messageUser", initialUserId],
    queryFn: () => makeRequest.get(`/users/find/${initialUserId}`).then((res) => res.data),
    enabled: !!initialUserId,
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => makeRequest.get("/messages/conversations").then((res) => res.data),
    refetchInterval: 5000,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", selectedChat?.id],
    queryFn: () => makeRequest.get(`/messages/${selectedChat?.id}`).then((res) => res.data),
    enabled: !!selectedChat,
    refetchInterval: selectedChat ? 3000 : false,
  });

  useEffect(() => {
    if (!initialChatUser || selectedChat) return;
    setSelectedChat(initialChatUser);
  }, [initialChatUser, selectedChat]);

  useEffect(() => {
    if (!currentUser?.id) return undefined;

    const socket = getSocket();
    socket.connect();
    socket.emit("notification:join", currentUser.id);

    const handleIncomingMessage = (message) => {
      queryClient.setQueryData(["messages", message.senderId], (prev = []) => [...prev, message]);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("message:new", handleIncomingMessage);

    return () => {
      socket.off("message:new", handleIncomingMessage);
      socket.emit("notification:leave", currentUser.id);
      socket.disconnect();
    };
  }, [currentUser?.id, queryClient]);

  const sendMessageMutation = useMutation({
    mutationFn: (text) =>
      makeRequest.post("/messages", {
        receiverId: selectedChat.id,
        text,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", selectedChat?.id] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setMessageText("");
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (conversationId) => makeRequest.put(`/messages/${conversationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedChat?.id) {
      markAsReadMutation.mutate(selectedChat.id);
    }
  }, [selectedChat?.id]);

  const filteredConversations = conversations.filter((conv) =>
    [conv.username, conv.name].filter(Boolean).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;
    sendMessageMutation.mutate(messageText);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    if (diffInHours < 1) return `${Math.floor((now - date) / (1000 * 60))}m`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const emojis = ["😀", "😂", "😍", "🥰", "😎", "🤔", "😢", "😡", "👍", "👎", "❤️", "💔", "🎉", "🔥", "💯", "✨"];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      <div className="flex w-1/3 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Messages</h2>
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!filteredConversations.length ? (
            <div className="py-8 text-center">
              <div className="mb-4 text-4xl">💬</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No Conversations</h3>
              <p className="text-gray-500">Open someone&apos;s profile and tap Message to start chatting.</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation)}
                className={`flex cursor-pointer items-center space-x-3 p-4 transition-colors hover:bg-gray-50 ${
                  selectedChat?.id === conversation.id ? "border-r-2 border-blue-500 bg-blue-50" : ""
                }`}
              >
                <div className="relative">
                  <img alt="Profile" src={getProfileUrl(conversation.profilePic)} className="h-12 w-12 rounded-full object-cover" />
                  {conversation.online ? <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" /> : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="truncate font-semibold text-gray-900">{conversation.name}</div>
                    <div className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="truncate text-sm text-gray-500">{conversation.lastMessage}</div>
                    {conversation.unreadCount > 0 ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">{conversation.unreadCount}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {selectedChat ? (
          <>
            <div className="border-b border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img alt="Profile" src={getProfileUrl(selectedChat.profilePic)} className="h-10 w-10 rounded-full object-cover" />
                    {selectedChat.online ? <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" /> : null}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedChat.name}</div>
                    <div className="text-sm text-gray-500">{selectedChat.online ? "Online" : "Offline"}</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${message.senderId === currentUser?.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                    <div className="text-sm">{message.text || message.message}</div>
                    <div className={`mt-1 text-xs ${message.senderId === currentUser?.id ? "text-blue-100" : "text-gray-500"}`}>{formatTime(message.createdAt)}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 bg-white p-4">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />

                  {showEmoji ? (
                    <div className="absolute bottom-full left-0 mb-2 grid grid-cols-8 gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                      {emojis.map((emoji, index) => (
                        <button key={index} type="button" onClick={() => { setMessageText((prev) => prev + emoji); setShowEmoji(false); }} className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-2 text-gray-500 hover:text-gray-700">
                  <FontAwesomeIcon icon={faSmile} />
                </button>
                <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                  <FontAwesomeIcon icon={faImage} />
                </button>
                <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                  <FontAwesomeIcon icon={faMicrophone} />
                </button>
                <button type="submit" disabled={!messageText.trim()} className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl">💬</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Select a Conversation</h3>
              <p className="text-gray-500">Choose a conversation or open someone&apos;s profile to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
