"use client";

import DoubleCheck from "@/components/DoubleCheck";
import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  onMessageClick: (message: Message) => void;
  formatTime: (date: string) => string;
}

export default function MessageBubble({ message, isOwn, senderName, onMessageClick, formatTime }: MessageBubbleProps) {
  const isReply = message.content.startsWith("[Reply to:");
  const replyContent = isReply
    ? message.content.split("\n")[0].replace("[Reply to: ", "").replace("]", "")
    : null;
  const actualContent = isReply
    ? message.content.split("\n").slice(1).join("\n")
    : message.content;

  return (
    <div
      onClick={() => onMessageClick(message)}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} cursor-pointer group`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-lg transition-all hover:shadow-xl ${
          isOwn
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
            : "bg-gradient-to-br from-gray-700 to-gray-800 text-slate-100 rounded-bl-md"
        }`}
      >
        {!isOwn && senderName && (
          <p className="text-xs font-semibold mb-1 text-blue-300">{senderName}</p>
        )}
        {isReply && (
          <div className="mb-2 p-2 bg-black/20 rounded-lg border-l-2 border-white/30">
            <p className="text-xs opacity-70 line-clamp-2">{replyContent}</p>
          </div>
        )}
        <p className="break-words text-sm leading-relaxed">{actualContent}</p>
        <div className="flex items-center justify-end gap-2 mt-1">
          <p className="text-[10px] opacity-70">{formatTime(message.createdAt)}</p>
          {isOwn && message.isRead && <DoubleCheck />}
        </div>
      </div>
    </div>
  );
}