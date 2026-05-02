"use client";

import { User } from "@/types";

interface UserListItemProps {
  user: User;
  isSelected: boolean;
  isOnline: boolean;
  unreadCount: number;
  onClick: () => void;
}

export default function UserListItem({ user, isSelected, isOnline, unreadCount, onClick }: UserListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-3 sm:p-4 cursor-pointer hover:bg-[#222E3C]/50 transition-all border-b border-gray-700/30 ${
        isSelected
          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-l-blue-500"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex justify-center items-center">
            <span className="text-white font-semibold text-sm">
              {(user.fullName || user.username).charAt(0).toUpperCase()}
            </span>
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#1A2332]"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-slate-100 text-sm truncate">
              {user.fullName || user.username}
            </p>
            {unreadCount > 0 && (
              <span className="shrink-0 px-1.5 sm:px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">@{user.username}</p>
        </div>
      </div>
    </div>
  );
}