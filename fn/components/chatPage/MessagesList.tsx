"use client";

import { Message, User } from "@/types";
import MessageBubble from "./MessageBubble";
import React from "react";

interface MessagesListProps {
  messages: Message[];
  currentUser: User;
  selectedUser: User;
  onMessageClick: (message: Message) => void;
  formatTime: (date: string) => string;
}

export default function MessagesList({ messages, currentUser, selectedUser, onMessageClick, formatTime }: MessagesListProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.senderId === currentUser?.id}
          senderName={selectedUser.fullName || selectedUser.username}
          onMessageClick={onMessageClick}
          formatTime={formatTime}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}