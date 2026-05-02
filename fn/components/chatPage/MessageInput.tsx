"use client";

import { useState, useRef, useEffect } from "react";
import EmojiPicker from "@/components/EmogiPicker";
import { SolarArrowDown } from "@/components/icons/Icons";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTypingStart: () => void;
}

export default function MessageInput({ onSendMessage, onTypingStart }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-gradient-to-r from-[#1D2733] to-[#222E3C] border-t border-gray-700/50 p-2 sm:p-3 md:p-4 shrink-0 safe-area-bottom">
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 sm:gap-2">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 sm:p-2.5 bg-[#222E3C] hover:bg-gray-700 rounded-xl transition-all border border-gray-700/50"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {showEmojiPicker && (
            <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUp={onTypingStart}
          placeholder="Type a message..."
          className="flex-1 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-[#222E3C] text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/50 transition-all min-w-0"
        />

        <button type="button" className="shrink-0 p-2 sm:p-2.5 bg-[#222E3C] hover:bg-gray-700 rounded-xl transition-all border border-gray-700/50">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="shrink-0 p-2 sm:p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <SolarArrowDown width={20} height={20} className="text-white rotate-180 sm:w-6 sm:h-6" />
        </button>
      </form>
    </div>
  );
}