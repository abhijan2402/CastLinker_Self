# FilmCollab Chat System Architecture

## Overview

A secure, real-time chat system with end-to-end encryption, supporting both one-to-one and group conversations.

## Database Schema

```sql
-- Chat Rooms Table
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('one_to_one', 'group')),
    name VARCHAR(255), -- For group chats
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Chat Room Members Table
CREATE TABLE chat_room_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE,
    public_key TEXT NOT NULL, -- For E2E encryption
    is_active BOOLEAN DEFAULT true,
    notifications_enabled BOOLEAN DEFAULT true,
    UNIQUE(room_id, user_id)
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content_encrypted TEXT NOT NULL,
    iv TEXT NOT NULL, -- Initialization vector for encryption
    type VARCHAR(20) NOT NULL DEFAULT 'text'
        CHECK (type IN ('text', 'image', 'video', 'audio', 'document', 'system')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    reply_to_id UUID REFERENCES messages(id)
);

-- Message Receipts Table
CREATE TABLE message_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('delivered', 'read')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- Message Reactions Table
CREATE TABLE message_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- User Presence Table
CREATE TABLE user_presence (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'offline'
        CHECK (status IN ('online', 'away', 'offline')),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    typing_in_room UUID REFERENCES chat_rooms(id),
    typing_until TIMESTAMP WITH TIME ZONE
);

-- Media Attachments Table
CREATE TABLE media_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'audio', 'document')),
    url TEXT NOT NULL,
    filename VARCHAR(255),
    size_bytes BIGINT,
    mime_type VARCHAR(127),
    metadata JSONB DEFAULT '{}'::jsonb,
    encrypted_key TEXT NOT NULL, -- Encryption key encrypted with recipient's public key
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## End-to-End Encryption Implementation

### Key Generation and Exchange

```typescript
// src/utils/encryption.ts

import { generateKeyPair, box, randomBytes } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "@stablelib/base64";

export class E2EEncryption {
  private keyPair: nacl.BoxKeyPair;

  constructor() {
    this.keyPair = generateKeyPair();
  }

  // Generate a new key pair for a user
  static generateUserKeys(): { publicKey: string; privateKey: string } {
    const keyPair = generateKeyPair();
    return {
      publicKey: encodeBase64(keyPair.publicKey),
      privateKey: encodeBase64(keyPair.secretKey),
    };
  }

  // Encrypt message for a recipient
  static async encryptMessage(
    message: string,
    senderPrivateKey: string,
    recipientPublicKey: string
  ): Promise<{ encrypted: string; iv: string }> {
    const iv = randomBytes(24);
    const encrypted = box(
      decodeUTF8(message),
      iv,
      decodeBase64(recipientPublicKey),
      decodeBase64(senderPrivateKey)
    );

    return {
      encrypted: encodeBase64(encrypted),
      iv: encodeBase64(iv),
    };
  }

  // Decrypt message from a sender
  static async decryptMessage(
    encrypted: string,
    iv: string,
    senderPublicKey: string,
    recipientPrivateKey: string
  ): Promise<string> {
    const decrypted = box.open(
      decodeBase64(encrypted),
      decodeBase64(iv),
      decodeBase64(senderPublicKey),
      decodeBase64(recipientPrivateKey)
    );

    return encodeUTF8(decrypted);
  }
}
```

## Real-time Communication

### WebSocket Connection

```typescript
// src/hooks/useChat.ts

import { useEffect, useRef } from "react";
import { RealtimeClient } from "@supabase/realtime-js";
import { E2EEncryption } from "../utils/encryption";

export const useChat = (roomId: string) => {
  const supabase = useSupabaseClient();
  const encryption = useRef(new E2EEncryption());

  useEffect(() => {
    // Subscribe to room messages
    const subscription = supabase
      .channel(`room:${roomId}`)
      .on("presence", { event: "sync" }, () => {
        // Handle presence updates
      })
      .on("presence", { event: "join" }, ({ key, newPresence }) => {
        // Handle user joining
      })
      .on("presence", { event: "leave" }, ({ key, leftPresence }) => {
        // Handle user leaving
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await trackPresence(roomId);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  // Send message function
  const sendMessage = async (content: string, type: MessageType = "text") => {
    // Encrypt message for each recipient
    const encryptedMessages = await Promise.all(
      roomMembers.map(async (member) => {
        const { encrypted, iv } = await E2EEncryption.encryptMessage(
          content,
          currentUserPrivateKey,
          member.publicKey
        );
        return { userId: member.id, encrypted, iv };
      })
    );

    // Store encrypted message
    const { data, error } = await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: currentUser.id,
      content_encrypted: JSON.stringify(encryptedMessages),
      type,
    });
  };
};
```

## Chat Components

### Chat Container

```typescript
// src/components/chat/ChatContainer.tsx

import React from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import { useChat } from "../../hooks/useChat";

export const ChatContainer: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { messages, sendMessage, isTyping, onlineUsers, setTyping } =
    useChat(roomId);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader roomId={roomId} onlineUsers={onlineUsers} />
      <MessageList
        messages={messages}
        onReaction={handleReaction}
        onDelete={handleDelete}
      />
      <MessageInput
        onSend={sendMessage}
        onTyping={setTyping}
        showTypingIndicator={isTyping}
      />
    </div>
  );
};
```

## Features Implementation

### 1. Message Types

```typescript
type MessageType = "text" | "image" | "video" | "audio" | "document" | "system";

interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isDeleted: boolean;
  replyToId?: string;
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
}
```

### 2. Media Handling

```typescript
// src/utils/mediaHandler.ts

export const uploadMedia = async (
  file: File,
  roomId: string,
  recipientPublicKeys: string[]
): Promise<string> => {
  // Generate random encryption key
  const fileKey = await generateRandomKey();

  // Encrypt file
  const encryptedFile = await encryptFile(file, fileKey);

  // Encrypt file key with each recipient's public key
  const encryptedKeys = await Promise.all(
    recipientPublicKeys.map(async (publicKey) => {
      return encryptFileKey(fileKey, publicKey);
    })
  );

  // Upload to storage
  const { data, error } = await supabase.storage
    .from("chat-attachments")
    .upload(`${roomId}/${file.name}`, encryptedFile);

  return data?.path;
};
```

### 3. Read Receipts

```typescript
// src/hooks/useReadReceipts.ts

export const useReadReceipts = (roomId: string) => {
  const markAsRead = async (messageId: string) => {
    await supabase.from("message_receipts").upsert({
      message_id: messageId,
      user_id: currentUser.id,
      status: "read",
    });
  };

  const getReadStatus = (messageId: string) => {
    return supabase
      .from("message_receipts")
      .select("user_id, status")
      .eq("message_id", messageId);
  };
};
```

## Security Considerations

1. **End-to-End Encryption**

   - All messages encrypted before transmission
   - Unique keys for each chat room
   - Perfect forward secrecy implementation

2. **Authentication & Authorization**

   - JWT-based authentication
   - Room-level access control
   - Message sender verification

3. **Data Protection**

   - Encrypted media storage
   - Secure key exchange
   - Message integrity verification

4. **Privacy**
   - Minimal metadata storage
   - Regular key rotation
   - Secure deletion implementation

## Performance Optimizations

1. **Message Loading**

   - Pagination implementation
   - Infinite scroll
   - Message caching

2. **Real-time Updates**

   - WebSocket connection pooling
   - Presence optimization
   - Typing indicator throttling

3. **Media Handling**
   - Progressive image loading
   - Video streaming optimization
   - File compression

## Error Handling

1. **Network Issues**

   - Automatic reconnection
   - Message queue for offline sending
   - Sync on reconnection

2. **Encryption Errors**
   - Key verification
   - Fallback mechanisms
   - Error recovery procedures

## Testing Strategy

1. **Unit Tests**

   - Encryption/decryption
   - Message handling
   - State management

2. **Integration Tests**

   - Real-time communication
   - Media uploads
   - User interactions

3. **End-to-End Tests**
   - Complete chat flows
   - Multiple user scenarios
   - Edge cases
