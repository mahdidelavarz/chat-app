"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Message, User } from "@/types";
import * as chatHandlers from "@/handlers/chatHandlers";
import LoadingSpinner from "@/components/chatPage/LoadingSpinner";
import MobileMenuButton from "@/components/chatPage/MobileMenuBtn";
import SidebarOverlay from "@/components/chatPage/SidebarOverlay";
import Sidebar from "@/components/chatPage/Sidebar";
import ChatArea from "@/components/chatPage/ChatArea";
import EmptyChatState from "@/components/chatPage/EmptyChatState";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // Fix viewport height for mobile browsers
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user:", error);
      window.location.href = "/login";
    }

    setLoading(false);
  }, []);

  // Wrapper for handleNewMessage to pass required parameters
  const onNewMessage = useCallback(
    (message: Message) => {
      chatHandlers.handleNewMessage(
        message,
        selectedUser,
        user,
        setMessages,
        setUnreadCounts,
      );
    },
    [selectedUser, user],
  );

  // Wrapper for handleTyping
  const onTyping = useCallback(
    (typingUserId: number, typing: boolean) => {
      chatHandlers.handleTyping(
        typingUserId,
        typing,
        selectedUser,
        setIsTyping,
      );
    },
    [selectedUser],
  );

  const { onlineUsers, sendMessage, sendTyping } = useSocket(
    user?.id,
    selectedUser,
    onNewMessage,
    onTyping,
  );

  // Fetch users when user is available
  useEffect(() => {
    if (user) {
      chatHandlers.fetchUsers(user, setUsers);
    }
  }, [user]);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      chatHandlers.fetchMessages(selectedUser.id, setMessages, setLoading);
      setUnreadCounts((prev) => ({
        ...prev,
        [selectedUser.id]: 0,
      }));
    }
  }, [selectedUser]);

  // Wrapper for handleSendMessage
  const onSendMessage = useCallback(
    (messageContent: string) => {
      chatHandlers.handleSendMessage(
        messageContent,
        selectedUser,
        user,
        replyingTo,
        sendMessage,
        setReplyingTo,
      );
    },
    [selectedUser, user, replyingTo, sendMessage],
  );

  // Wrapper for handleTypingStart
  const onTypingStart = useCallback(() => {
    chatHandlers.handleTypingStart(selectedUser, sendTyping, typingTimeoutRef);
  }, [selectedUser, sendTyping]);

  // Wrapper for handleMessageClick
  const onMessageClick = useCallback((message: Message) => {
    chatHandlers.handleMessageClick(
      message,
      setSelectedMessage,
      setModalIsOpen,
    );
  }, []);

  // Wrapper for handleReply
  const onReply = useCallback(() => {
    chatHandlers.handleReply(selectedMessage, setReplyingTo, setModalIsOpen);
  }, [selectedMessage]);

  // Wrapper for handleCopy
  const onCopy = useCallback(() => {
    chatHandlers.handleCopy(selectedMessage, setModalIsOpen);
  }, [selectedMessage]);

  // Wrapper for handleDelete
  const onDelete = useCallback(() => {
    chatHandlers.handleDeleteWithConfirmation(
      selectedMessage,
      setMessages,
      setModalIsOpen,
      setDeleteConfirmOpen,
    );
  }, [selectedMessage]);

  const onConfirmDelete = useCallback(() => {
    chatHandlers.confirmDelete(
      selectedMessage,
      setMessages,
      setDeleteConfirmOpen,
      setSelectedMessage,
    );
  }, [selectedMessage]);

  // Wrapper for closeModal
  const onCloseModal = useCallback(() => {
    chatHandlers.closeModal(setModalIsOpen);
  }, []);

  // Wrapper for handleLogout
  const onLogout = useCallback(() => {
    chatHandlers.handleLogout();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-dvh bg-linear-to-br from-[#0F1419] via-[#151E27] to-[#1A2332] overflow-hidden">
      <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)} />

      {sidebarOpen && <SidebarOverlay onClick={() => setSidebarOpen(false)} />}

      <Sidebar
        isOpen={sidebarOpen}
        user={user}
        users={users}
        selectedUser={selectedUser || undefined}
        onlineUsers={onlineUsers}
        unreadCounts={unreadCounts}
        onLogout={onLogout}
        onSelectUser={setSelectedUser}
        onClose={() => setSidebarOpen(false)}
      />

      {deleteConfirmOpen && (
        <DeleteConfirmationModal
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={onConfirmDelete}
          messageContent={selectedMessage?.content}
        />
      )}

      {selectedUser ? (
        <ChatArea
          selectedUser={selectedUser}
          currentUser={user}
          messages={messages}
          isTyping={isTyping}
          isOnline={onlineUsers.includes(selectedUser.id)}
          replyingTo={replyingTo}
          selectedMessage={selectedMessage}
          modalIsOpen={modalIsOpen}
          onSendMessage={onSendMessage}
          onTypingStart={onTypingStart}
          onCancelReply={() => setReplyingTo(null)}
          onMessageClick={onMessageClick}
          onCloseModal={onCloseModal}
          onReply={onReply}
          onCopy={onCopy}
          onDelete={onDelete}
          formatTime={chatHandlers.formatTime}
        />
      ) : (
        <EmptyChatState />
      )}
    </div>
  );
}
