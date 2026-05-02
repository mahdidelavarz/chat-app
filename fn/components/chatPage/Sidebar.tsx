"use client";

import { User } from "@/types";
import UserProfileHeader from "./UserProfileHeader";
import SearchBar from "./SearchBar";
import UsersList from "./UsersList";

interface SidebarProps {
  isOpen: boolean;
  user: User;
  users: User[];
  selectedUser?: User;
  onlineUsers: number[];
  unreadCounts: Record<number, number>;
  onLogout: () => void;
  onSelectUser: (user: User) => void;
  onClose: () => void;
}

export default function Sidebar({ isOpen, user, users, selectedUser, onlineUsers, unreadCounts, onLogout, onSelectUser, onClose }: SidebarProps) {
  return (
    <div
      className={`
        fixed lg:relative w-80 bg-[#1A2332]/95 backdrop-blur-xl border-r border-gray-700/50 flex flex-col
        transform transition-transform duration-300 ease-in-out z-50 h-[100dvh]
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <UserProfileHeader user={user} onLogout={onLogout} />
      <SearchBar />
      <UsersList
        users={users}
        selectedUserId={selectedUser?.id}
        onlineUsers={onlineUsers}
        unreadCounts={unreadCounts}
        onSelectUser={(user) => {
          onSelectUser(user);
          onClose();
        }}
      />
    </div>
  );
}