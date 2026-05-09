// handlers/chatHandlers.ts
import { Message, User } from "@/types";
import apiService from "@/services/api";

export const fetchUsers = async (
    user: User | null,
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
    try {
        const fetchedUsers = await apiService.getUsers();
        setUsers(fetchedUsers.filter((u) => u.id !== user?.id));
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

export const fetchMessages = async (
    userId: number,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setLoading(true);
    try {
        const fetchedMessages = await apiService.getMessages(userId);
        setMessages(fetchedMessages);
    } catch (error) {
        console.error("Error fetching messages:", error);
    } finally {
        setLoading(false);
    }
};

export const handleNewMessage = (
    message: Message,
    selectedUser: User | null,
    user: User | null,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setUnreadCounts: React.Dispatch<React.SetStateAction<Record<number, number>>>
) => {
    if (selectedUser && message.senderId === selectedUser.id) {
        setMessages((prev) => [...prev, message]);
    } else if (message.senderId === user?.id) {
        setMessages((prev) => [...prev, message]);
    } else {
        setUnreadCounts((prev) => ({
            ...prev,
            [message.senderId]: (prev[message.senderId] || 0) + 1,
        }));
    }
};

export const handleTyping = (
    typingUserId: number,
    typing: boolean,
    selectedUser: User | null,
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (selectedUser && selectedUser.id === typingUserId) {
        setIsTyping(typing);
    }
};

export const handleSendMessage = (
    messageContent: string,
    selectedUser: User | null,
    user: User | null,
    replyingTo: Message | null,
    sendMessage: (senderId: number, receiverId: number, content: string) => void,
    setReplyingTo: React.Dispatch<React.SetStateAction<Message | null>>
) => {
    if (!selectedUser || !user) return;

    const content = replyingTo
        ? `[Reply to: ${replyingTo.content}]\n${messageContent}`
        : messageContent;

    sendMessage(user.id, selectedUser.id, content);
    setReplyingTo(null);
};

export const handleTypingStart = (
    selectedUser: User | null,
    sendTyping: (receiverId: number, isTyping: boolean) => void,
    typingTimeoutRef: React.MutableRefObject<NodeJS.Timeout | undefined>
) => {
    if (selectedUser) {
        sendTyping(selectedUser.id, true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            if (selectedUser) {
                sendTyping(selectedUser.id, false);
            }
        }, 1000);
    }
};

export const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    apiService.disconnectSocket();
    window.location.href = "/login";
};

export const handleMessageClick = (
    message: Message,
    setSelectedMessage: React.Dispatch<React.SetStateAction<Message | null>>,
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setSelectedMessage(message);
    setModalIsOpen(true);
};

export const handleReply = (
    selectedMessage: Message | null,
    setReplyingTo: React.Dispatch<React.SetStateAction<Message | null>>,
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (selectedMessage) {
        setReplyingTo(selectedMessage);
        setModalIsOpen(false);
    }
};

export const handleCopy = (
    selectedMessage: Message | null,
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (selectedMessage) {
        navigator.clipboard.writeText(selectedMessage.content);
        setModalIsOpen(false);
    }
};

export const handleDelete = async (
    selectedMessage: Message | null,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (selectedMessage) {
        try {
            await apiService.deleteMessage(selectedMessage.id);
            setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
            setModalIsOpen(false);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    }
};

export const closeModal = (
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setModalIsOpen(false);
};

export const handleDeleteWithConfirmation = async (
    selectedMessage: Message | null,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (selectedMessage) {
        // Close the options modal and open confirmation modal
        setModalIsOpen(false);
        setDeleteConfirmOpen(true);
    }
};

export const confirmDelete = async (
    selectedMessage: Message | null,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedMessage: React.Dispatch<React.SetStateAction<Message | null>>
) => {
    if (selectedMessage) {
        try {
            await apiService.deleteMessage(selectedMessage.id);
            setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
            setDeleteConfirmOpen(false);
            setSelectedMessage(null);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    }
};

export const handleMessagesRead = (
  data: { userId: number; messageIds: number[] },
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  setMessages(prev => prev.map(msg => {
    if (msg.senderId === data.userId && (data.messageIds.length === 0 || data.messageIds.includes(msg.id))) {
      return { ...msg, isRead: true };
    }
    return msg;
  }));
};

export const markConversationMessagesAsRead = (
  selectedUser: User | null,
  messages: Message[],
  markAsRead: (messageId: number) => void,
  markConversationAsRead: (otherUserId: number) => void
) => {
  if (!selectedUser) return;
  
  // Mark all unread messages from selected user as read
  const unreadMessages = messages.filter(
    msg => msg.senderId === selectedUser.id && !msg.isRead
  );
  
  if (unreadMessages.length > 0) {
    unreadMessages.forEach(msg => {
      markAsRead(msg.id);
    });
    
    // Also mark conversation as read via socket
    markConversationAsRead(selectedUser.id);
  }
};