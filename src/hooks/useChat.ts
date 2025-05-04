import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./useAuth";
import { E2EEncryption } from "../utils/encryption";
import Socket from "@/socket";
import socket from "@/socket";

// Define types to match those used in the codebase
export interface Message {
  id: string;
  room_id: string;
  sender_id: number;
  receiver_id: number;
  content: string;
  type: "text" | "image" | "video" | "audio" | "document" | "system";
  metadata: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    duration?: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  is_deleted: boolean;
  reply_to_id?: string;
  reactions?: MessageReaction[];
  // Additional properties to support existing code
  timestamp?: string;
  status?: "sent" | "delivered" | "seen";
  isMe?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  messageId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
}

export interface ChatRoom {
  id: string;
  type: "one_to_one" | "group";
  name: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  metadata: {
    description?: string;
    memberCount?: number;
    last_message?: string;
    unread_count?: number;
  };
}

export interface UserPresence {
  user_id: string;
  status: "online" | "away" | "offline";
  last_active: string;
  typing_in_room?: string;
  typing_until?: string;
}

export interface OnlineUser {
  id: string;
  name: string;
  status: "online" | "away" | "offline";
}

export interface MediaAttachment {
  id: string;
  message_id: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  filename: string;
  size_bytes: number;
  mime_type: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    thumbnail_url?: string;
  };
  encrypted_key: string;
  created_at: string;
}

// Mock implementation for chat functionality
export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const encryption = new E2EEncryption();
  // console.log(user);
  // useEffect(() => {
  //   if (!roomId || !user) return;

  //   const loadMockData = async () => {
  //     setIsLoading(true);

  //     // Mock room data
  //     const mockRoom: ChatRoom = {
  //       id: roomId,
  //       type: "one_to_one",
  //       name: "Chat Room",
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString(),
  //       last_message_at: new Date().toISOString(),
  //       metadata: {
  //         description: "A chat room",
  //         memberCount: 2,
  //         last_message: "Hello",
  //         unread_count: 0,
  //       },
  //     };

  //     // Mock received message (this is your incoming message)
  //     const receivedMessage: Message = {
  //       id: "d3c9b767-a4a0-4a73-a743-0e24f8ddda12",
  //       room_id: roomId, // you should assign the current roomId here!
  //       sender_id: "e983aee4-0387-440a-99f3-c12355aa7458",
  //       content: "hlo",
  //       type: "text",
  //       metadata: {},
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString(),
  //       is_edited: false,
  //       is_deleted: false,
  //       timestamp: "Just now",
  //       status: "sent",
  //       isMe: false, // or true based on sender_id === user.id
  //     };

  //     setRoomInfo(mockRoom);
  //     setMessages([receivedMessage]); // 👈 correctly setting the message
  //     setIsLoading(false);
  //   };

  //   loadMockData();
  // }, [roomId, user]);
  useEffect(() => {
    //user whom we are chatting

    console.log(user?.id, "USER___USER");

    // if (!user?.user?.id) return;

    socket.connect();

    Socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join", { user_id: user?.id }); // Let server know this user's room
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Send message function
  const sendMessage = async (content: string, attachments: File[] = []) => {
    console.log(content);
    if (!user || !content.trim()) return;

    const newMessage: Message = {
      id: uuidv4(),
      room_id: roomId,
      sender_id: user.id,
      content,  
      type: "text",
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_edited: false,
      is_deleted: false,
      timestamp: "Just now",
      status: "sent",
      isMe: true,
    };

    // If there are attachments, add them to the message
    if (attachments.length > 0) {
      newMessage.attachments = attachments.map((file) => ({
        id: uuidv4(),
        messageId: newMessage.id,
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }));
    }

    setMessages((prev) => [...prev, newMessage]);
    console.log("Called");

    socket.emit("send_message", {
      sender_id: user?.id,
      receiver_id: 29,
      content: content,
      // You can also send attachments if needed
    });

    return true;
  };
  useEffect(() => {
    // Ensure user is defined and has a valid ID
    if (!user?.id || !socket) return;
    console.log("I__M_CALLED");

    const handleReceiveMessage = (message: Message) => {
      console.log("Incoming message:", message);

      // Check if the message is for this user
      if (message.receiver_id === user?.id) {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            isMe: message.sender_id === user?.id, // Check if sent by current user
          },
        ]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup the event listener on component unmount
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, user?.id]);

  // Update typing status
  const setTyping = async (typing: boolean) => {
    setIsTyping(typing);
    return true;
  };

  // Load more messages
  const loadMoreMessages = async () => {
    setHasMoreMessages(false);
    return true;
  };

  // Mark message as read
  const markAsRead = async () => {
    return true;
  };

  // Delete message
  const deleteMessage = async (messageId: string, forEveryone = false) => {
    if (forEveryone) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: "This message was deleted",
                is_deleted: true,
                attachments: undefined,
                reactions: undefined,
              }
            : msg
        )
      );
    } else {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    }
    return true;
  };

  // Edit message
  const editMessage = async (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent, is_edited: true }
          : msg
      )
    );
    return true;
  };

  // Add reaction to message
  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return false;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReactions = msg.reactions || [];
          const filteredReactions = existingReactions.filter(
            (r) => r.userId !== user.id
          );

          return {
            ...msg,
            reactions: [...filteredReactions, { userId: user.id, emoji }],
          };
        }
        return msg;
      })
    );

    return true;
  };

  // Remove reaction from message
  const removeReaction = async (messageId: string, emoji: string) => {
    if (!user) return false;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReactions = msg.reactions || [];
          return {
            ...msg,
            reactions: existingReactions.filter(
              (r) => !(r.userId === user.id && r.emoji === emoji)
            ),
          };
        }
        return msg;
      })
    );

    return true;
  };

  return {
    messages,
    sendMessage,
    isTyping,
    onlineUsers,
    setTyping,
    roomInfo,
    loadMoreMessages,
    hasMoreMessages,
    markAsRead,
    deleteMessage,
    editMessage,
    addReaction,
    removeReaction,
    isLoading,
  };
};
