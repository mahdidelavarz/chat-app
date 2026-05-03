"use client";

import { useEffect, useRef } from "react";
import DoubleCheck from "@/components/DoubleCheck";
import { Message } from "@/types";
import { isPersianText } from "@/utils/isPersianText";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  onMessageClick: (message: Message) => void;
  formatTime: (date: string) => string;
  onMessageVisible?: (messageId: number) => void;
}

export default function MessageBubble({ 
  message, 
  isOwn, 
  senderName, 
  onMessageClick, 
  formatTime,
  onMessageVisible 
}: MessageBubbleProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  
  const isReply = message.content.startsWith("[Reply to:");
  const replyContent = isReply
    ? message.content.split("\n")[0].replace("[Reply to: ", "").replace("]", "")
    : null;
  const actualContent = isReply
    ? message.content.split("\n").slice(1).join("\n")
    : message.content;

  // Detect Persian text
  const hasPersian = isPersianText(actualContent);
  const textDirection = hasPersian ? 'rtl' : 'ltr';
  const textAlign = hasPersian ? 'right' : 'left';

  // Mark message as read when visible
  useEffect(() => {
    if (!isOwn && !message.isRead && onMessageVisible && messageRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onMessageVisible(message.id);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );
      
      observer.observe(messageRef.current);
      
      return () => observer.disconnect();
    }
  }, [isOwn, message.id, message.isRead, onMessageVisible]);

  return (
    <div
      ref={messageRef}
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
        <p 
          className="break-words text-sm leading-relaxed"
          style={{ 
            direction: textDirection,
            textAlign: textAlign as 'right' | 'left',
            fontFamily: hasPersian ? "Vazir, sans-serif" : "inherit"
          }}
        >
          {actualContent}
        </p>
        <div className={`flex items-center gap-2 mt-1 ${hasPersian ? 'flex-row-reverse' : 'flex-row'}`}>
          <p className="text-[10px] opacity-70">{formatTime(message.createdAt)}</p>
          {isOwn && message.isRead && <DoubleCheck />}
        </div>
      </div>
    </div>
  );
}