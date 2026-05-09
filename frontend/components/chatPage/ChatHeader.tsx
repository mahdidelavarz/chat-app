"use client";

import { User } from "@/types";

interface ChatHeaderProps {
  selectedUser: User;
  isTyping: boolean;
  isOnline: boolean;
}

export default function ChatHeader({ selectedUser, isTyping, isOnline }: ChatHeaderProps) {
  return (
    <div className="bg-linear-to-r from-[#1D2733] to-[#222E3C] p-3 sm:p-4 border-b border-gray-700/50 shadow-xl backdrop-blur-xl shrink-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pl-15">
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex justify-center items-center">
              <span className="text-white font-semibold text-sm">
                {(selectedUser.fullName || selectedUser.username).charAt(0).toUpperCase()}
              </span>
            </div>
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#222E3C]"></div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
              {selectedUser.fullName || selectedUser.username}
            </h2>
            <p className="text-xs text-gray-400 truncate">
              {isTyping ? (
                <span className="text-blue-400 animate-pulse">Typing...</span>
              ) : isOnline ? (
                <span className="text-green-400">Online</span>
              ) : (
                <span>@{selectedUser.username}</span>
              )}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors shrink-0">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}