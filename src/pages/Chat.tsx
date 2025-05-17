import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video, Info, Plus, Search, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import {
  ChatMessage as ChatMessageComponent,
  ChatMessage,
} from "@/components/chat/ChatMessage";
import { useChat } from "@/hooks/useChat";
import { useDebounce } from "@/hooks/useDebounce";
import { EmojiPicker } from "@/components/chat/EmojiPicker";
import { Message, MessageReaction as TypedMessageReaction } from "@/types/chat";
import socket from "@/socket";
import { fetchData } from "@/api/ClientFuntion";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  avatar: string;
  role?: string;
  online?: boolean;
}

interface ChatListResponse {
  success: boolean;
  data: Chat[];
}

const Chat = () => {
  const { user } = useAuth();
  const [inputMessage, setInputMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isLoading } = useChat("");

  const [mockChats, setMockChats] = useState<Chat[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      lastMessage: "When can you send the audition tape?",
      lastMessageTime: "10:30 AM",
      unread: 2,
      avatar: "/placeholder.svg",
      role: "Casting Director",
      online: true,
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      lastMessage: "I loved your performance in that short film!",
      lastMessageTime: "Yesterday",
      unread: 0,
      avatar: "/placeholder.svg",
      role: "Director",
      online: false,
    },
    {
      id: "3",
      name: "Emma Thompson",
      lastMessage: "Let's discuss the contract details",
      lastMessageTime: "Monday",
      unread: 0,
      avatar: "/placeholder.svg",
      role: "Producer",
      online: true,
    },
    {
      id: "4",
      name: "Film Project Team",
      lastMessage: "Hey team, I've uploaded the latest schedule",
      lastMessageTime: "08/10/2023",
      unread: 3,
      avatar: "/placeholder.svg",
    },
  ]);

  const handleAllChats = async () => {
    const res = await fetchData<ChatListResponse>(`/api/chat/list/${user.id}`);

    if (res.success && Array.isArray(res.data)) {
      // setMockChats(res.data);
      console.log(res.data);
      setMockChats(res?.data);
    } else {
      console.error("Failed to load chats");
    }
  };

  useEffect(() => {
    handleAllChats();
  }, []);

  // console.log(messages)

  const [activeChat, setActiveChat] = useState(mockChats[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputMessage((prev) => prev + emoji);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-[#121212] text-white">
      <div className="w-96 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gold">Messages</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gold hover:bg-gold/10 rounded-full"
            >
              <Plus size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gold hover:bg-gold/10 rounded-full"
            >
              <Filter size={20} />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-[#222222] border-0 text-white placeholder:text-gray-400 focus-visible:ring-gold/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`
                  flex items-center gap-3 p-3 rounded-lg cursor-pointer
                  ${
                    activeChat?.id === chat.id
                      ? "bg-gold/20 border-l-2 border-gold"
                      : "hover:bg-[#222222]"
                  }
                `}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback
                      className={`
                      ${
                        activeChat?.id === chat.id
                          ? "bg-gold/20 text-gold"
                          : "bg-[#333333] text-gray-300"
                      }
                    `}
                    >
                      {chat.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#121212] rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3
                      className={`font-medium truncate ${
                        activeChat?.id === chat.id ? "text-gold" : "text-white"
                      }`}
                    >
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-gold text-black rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  {chat.role && (
                    <span className="text-xs text-gray-500">{chat.role}</span>
                  )}
                </div>
              </div>
            ))}
            {mockChats?.length === 0 && (
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "40vh",
                  alignItems: "center",
                  fontSize: "12px",
                }}
              >
                No Recent Chats Found
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {!activeChat ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a conversation to start messaging
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
                  <AvatarFallback className="bg-gold/20 text-gold">
                    {activeChat.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-gold">
                    {activeChat.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    {activeChat.online && (
                      <>
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-sm text-gray-300">Online</span>
                      </>
                    )}
                    {activeChat.role && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-300">
                          {activeChat.role}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-gold hover:bg-gold/10"
                >
                  <Phone size={20} />
                </Button> */}
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-gold hover:bg-gold/10"
                >
                  <Video size={20} />
                </Button> */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-gold hover:bg-gold/10"
                >
                  <Info size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <span className="text-gray-400">Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center p-4">
                  <span className="text-gray-400">No messages yet</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => {
                    const typedReactions = message.reactions?.map(
                      (reaction) => ({
                        emoji: reaction.emoji,
                        user_id: reaction.userId || "",
                        count: 1,
                      })
                    );

                    const chatMessage: ChatMessage = {
                      ...message,
                      senderName:
                        message.sender_id === user?.id
                          ? user?.email?.split("@")[0]
                          : "User",
                      senderRole: message.sender_id === user?.id ? "" : "Role",
                      isMe: message.sender_id === user?.id,
                      status: "seen" as const,
                      reactions: typedReactions,
                    };

                    return (
                      <ChatMessageComponent
                        key={message.id}
                        message={chatMessage}
                        showAvatar={true}
                        isLastInGroup={true}
                      />
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="bg-[#222222] border-0 text-white placeholder:text-gray-400 focus-visible:ring-gold/30 pr-10"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <EmojiPicker onSelect={handleEmojiSelect} />
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  className="rounded-full bg-gold hover:bg-gold/90 text-black"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
