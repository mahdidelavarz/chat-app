"use client";

import { User } from "@/types";
import UserListItem from "./UserListItem";


interface UsersListProps {
  users: User[];
  selectedUserId?: number;
  onlineUsers: number[];
  unreadCounts: Record<number, number>;
  onSelectUser: (user: User) => void;
}

export default function UsersList({ users, selectedUserId, onlineUsers, unreadCounts, onSelectUser }: UsersListProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          isSelected={selectedUserId === user.id}
          isOnline={onlineUsers.includes(user.id)}
          unreadCount={unreadCounts[user.id] || 0}
          onClick={() => onSelectUser(user)}
        />
      ))}
    </div>
  );
}