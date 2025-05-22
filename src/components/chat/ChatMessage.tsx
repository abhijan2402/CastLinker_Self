import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { Message } from "@/types/chat";
import { format } from "date-fns";

// Define MediaAttachment from types
export interface Attachment {
  id: number;
  messageId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
}

// Custom reaction type that works with different formats
export interface MessageReaction {
  emoji: string;
  user_id: number | string;
  count: number;
}

// Define ChatMessage type without extending Message to avoid type conflicts
export interface ChatMessage {
  id: number;
  room_id: string;
  sender_id: string;
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
  senderName?: string;
  senderRole?: string;
  isMe?: boolean;
  status?: "sent" | "delivered" | "seen";
}

type MessageProps = {
  message: ChatMessage;
  onEdit?: (messageId: string, content: string) => Promise<boolean>;
  onDelete?: (messageId: string, forEveryone: boolean) => Promise<boolean>;
  onReact?: (messageId: string, emoji: string) => Promise<boolean>;
  showAvatar?: boolean;
  isLastInGroup?: boolean;
};

export function ChatMessage({
  message,
  onEdit,
  onDelete,
  onReact,
  showAvatar = true,
  isLastInGroup = true,
}: MessageProps) {
  // console.log(message);
  return (
    <div
      className={`flex ${message.isMe ? "justify-end" : "justify-start"} mb-2`}
    >
      {/* RECEIVER (other user) Avatar */}
      {!message.isMe && showAvatar && (
        <Avatar className="h-10 w-10 mr-2">
          <AvatarImage
            src="/placeholder.svg"
            alt={message.senderName || "User"}
          />
          <AvatarFallback>
            {(message.senderName ?? "U").charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}

      {/* MESSAGE BUBBLE */}
      <div className="max-w-[75%]">
        {/* Optional Sender Name & Role */}
        {!message.isMe && showAvatar && (
          <div className="mb-1 text-sm text-gold/80">
            <span className="font-medium">{message.senderName}</span>
            {message.senderRole && (
              <span className="text-xs ml-2 text-gold/60">
                {message.senderRole}
              </span>
            )}
          </div>
        )}

        {/* Message Content */}
        <div
          className={`rounded-2xl p-3 text-sm ${
            message.isMe
              ? "bg-gold/20 text-white rounded-tr-none"
              : "bg-[#222222] text-white rounded-tl-none"
          }`}
        >
          <p>{message.content}</p>
          {message.is_edited && (
            <span className="text-xs text-gold/40 mt-1 inline-block">
              (edited)
            </span>
          )}
        </div>

        {/* Timestamp and Status */}
        <div
          className={`text-xs mt-1 flex items-center gap-1 ${
            message.isMe ? "justify-end" : "justify-start"
          } text-gray-400`}
        >
          <span>
            {message.created_at &&
              format(new Date(message.created_at), "h:mm a")}
          </span>
          {message.isMe && message.status === "seen" && (
            <Check size={14} className="text-blue-400" />
          )}
        </div>
      </div>

      {/* SENDER (self) Avatar */}
      {message.isMe && showAvatar && (
        <Avatar className="h-10 w-10 ml-2">
          <AvatarImage src="/placeholder.svg" alt="You" />
          <AvatarFallback>
            {(message.senderName ?? "Y").charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
