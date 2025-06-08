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
import { useChat, Message } from "@/hooks/useChat";
import { useDebounce } from "@/hooks/useDebounce";
import { EmojiPicker } from "@/components/chat/EmojiPicker";
import { format } from "date-fns";
import socket from "@/socket";
import { fetchData, postData } from "@/api/ClientFuntion";
import { Action } from "@radix-ui/react-toast";

interface Chat {
  id: number;
  name: string;
  receiver_id: number;
  sender_id: number;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  avatar: string;
  role?: string;
  online?: boolean;
}

const Chat = () => {
  const { user } = useAuth();
  console.log(user);
  const [inputMessage, setInputMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [chatAccepted, setChatAccepted] = useState<boolean | null>(null);

  const { messages, setMessages, sendMessage, isLoading } = useChat("");

  const firstMessage = messages.length > 0 ? messages[0] : null;
  const isFirstChat =
    firstMessage &&
    firstMessage.sender_id !== user?.id &&
    messages.length === 1;

  const [mockChats, setMockChats] = useState<Chat[]>([]);
  console.log(mockChats);
  const handleAllChats = async () => {
    const res = await fetchData<any>(`/api/chat/list/${user.id}`);

    if (res.success && Array.isArray(res.data)) {
      const formattedChats: Chat[] = res.data.map((chat: any) => ({
        id: chat.id,
        name: chat.user?.username || "Unknown User",
        lastMessage: chat.content,
        lastMessageTime: format(new Date(chat.created_at), "MMM d, h:mm a"),
        unread: 0,
        avatar: chat.user?.profile_image || "",
        receiver_id: chat.receiver_id,
        sender_id: chat.sender_id,
      }));

      setMockChats(formattedChats);
    } else {
      console.error("Failed to load chats");
    }
  };

  useEffect(() => {
    handleAllChats();
  }, []);

  console.log(messages);

  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  const loadMessages = async () => {
    try {
      const resp = await fetchData(
        `/api/chat/conversation/${activeChat.sender_id}/${activeChat.receiver_id}`
      );

      const chatResponse = resp as {
        success: boolean;
        data: any[]; // You can define a proper APIRawMessage interface too
      };

      if (chatResponse.success) {
        const fullMessages: Message[] = chatResponse.data.map((msg) => {
          return {
            id: msg.id,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            content: msg.content || "",
            room_id: 0, // default value or derive it
            type: "text", // or derive from msg.type if available
            metadata: {},
            created_at: msg.created_at,
            updated_at: msg.updated_at,
            is_edited: false,
            is_deleted: false,
            reactions: [],
            attachments: [],
            timestamp: msg.created_at,
            status: "sent",
            isMe: msg.sender_id === user?.id,
            reply_to_id: undefined,
          };
        });

        setMessages(fullMessages); // ✅ This will now work
      }
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };
  useEffect(() => {
    loadMessages();
  }, [user, activeChat, inputMessage]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(activeChat);
  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      // sendMessage(inputMessage, null, activeChat?.receiver_id);
      const payload = {
        sender_id: activeChat?.receiver_id,
        receiver_id: activeChat?.sender_id,
        content: inputMessage,
      };
      console.log(payload);
      const res: any = await postData("/api/chat/send", payload);
      if (res.success) {
        loadMessages();
        setInputMessage("");
      }
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
                      {"NA"}
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
              {isLoading === false ? (
                <div className="flex justify-center p-4">
                  <span className="text-gray-400">Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center p-4">
                  <span className="text-gray-400">No messages yet</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {isFirstChat && chatAccepted === null && (
                    <div className="text-center mb-4">
                      <p className="mb-2 text-sm text-gray-300">
                        Do you want to accept this chat?
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          className="bg-green-500 text-sm text-white px-4 py-1 rounded hover:bg-green-600"
                          onClick={() => setChatAccepted(true)}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-sm text-white px-4 py-1 rounded hover:bg-red-600"
                          onClick={() => setChatAccepted(false)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

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
                        message.receiver_id === user?.id
                          ? user?.username
                          : "User",
                      senderRole:
                        message.  receiver_id === user?.id
                          ? user?.user_role
                          : "Role",
                      isMe: message.receiver_id === user?.id, // Ensure user?.id is 47 if you're testing as receiver
                      status: "seen",
                      reactions: typedReactions,
                    };
                    return (
                      <ChatMessage
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

            {(chatAccepted || messages.length > 1) && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
