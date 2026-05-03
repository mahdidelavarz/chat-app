'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import apiService from '../services/api';
import type { Message, User } from '../types';

export const useSocket = (
    userId: number | undefined,
    selectedUser: User | null,
    onNewMessage: (message: Message) => void,
    onTyping: (userId: number, isTyping: boolean) => void
) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
    
    // Use refs to avoid unnecessary re-renders and stale closures
    const onNewMessageRef = useRef(onNewMessage);
    const onTypingRef = useRef(onTyping);
    const selectedUserRef = useRef(selectedUser);

    // Update refs when callbacks change
    useEffect(() => {
        onNewMessageRef.current = onNewMessage;
        onTypingRef.current = onTyping;
        selectedUserRef.current = selectedUser;
    }, [onNewMessage, onTyping, selectedUser]);

    useEffect(() => {
        if (!userId) return;

        const newSocket = apiService.connectSocket(userId);
        setSocket(newSocket);

        // Handle online users
        const handleUsersOnline = (users: number[]) => {
            setOnlineUsers(users);
        };

        // Handle new messages
        const handleNewMessage = (message: Message) => {
            console.log('New message received:', message);
            onNewMessageRef.current(message);
        };

        // Handle message sent confirmation
        const handleMessageSent = (message: Message) => {
            console.log('Message sent confirmation:', message);
            onNewMessageRef.current(message);
        };

        // Handle typing indicators
        const handleUserTyping = ({ userId: typingUserId, isTyping }: { userId: number; isTyping: boolean }) => {
            if (selectedUserRef.current && selectedUserRef.current.id === typingUserId) {
                onTypingRef.current(typingUserId, isTyping);
            }
        };

        // Handle message deletion
        const handleMessageDeleted = ({ messageId }: { messageId: number }) => {
            console.log('Message deleted:', messageId);
            // You can implement a callback for message deletion if needed
        };

        // Handle conversation deletion
        const handleConversationDeleted = ({ userId: deletedByUserId }: { userId: number }) => {
            console.log('Conversation deleted by user:', deletedByUserId);
            // You can implement a callback for conversation deletion if needed
        };

        // Register event listeners
        newSocket.on('usersOnline', handleUsersOnline);
        newSocket.on('newMessage', handleNewMessage);
        newSocket.on('messageSent', handleMessageSent);
        newSocket.on('userTyping', handleUserTyping);
        newSocket.on('messageDeleted', handleMessageDeleted);
        newSocket.on('conversationDeleted', handleConversationDeleted);

        // Cleanup function
        return () => {
            newSocket.off('usersOnline', handleUsersOnline);
            newSocket.off('newMessage', handleNewMessage);
            newSocket.off('messageSent', handleMessageSent);
            newSocket.off('userTyping', handleUserTyping);
            newSocket.off('messageDeleted', handleMessageDeleted);
            newSocket.off('conversationDeleted', handleConversationDeleted);
            
            // Don't disconnect if there are other components using the socket
            // apiService.disconnectSocket();
        };
    }, [userId]); // Remove selectedUser from dependencies to avoid reconnection

    const sendMessage = useCallback((senderId: number, receiverId: number, content: string) => {
        if (socket && socket.connected) {
            socket.emit('sendMessage', { senderId, receiverId, content });
        } else {
            console.error('Socket not connected');
        }
    }, [socket]);

    const sendTyping = useCallback((receiverId: number, isTyping: boolean) => {
        if (socket && socket.connected) {
            socket.emit('typing', { receiverId, isTyping });
        }
    }, [socket]);

    const deleteMessage = useCallback((messageId: number) => {
        if (socket && socket.connected) {
            socket.emit('deleteMessage', { messageId, userId });
        } else {
            console.error('Socket not connected');
        }
    }, [socket, userId]);

    const markAsRead = useCallback((messageId: number) => {
        if (socket && socket.connected) {
            socket.emit('markAsRead', { messageId, userId });
        }
    }, [socket, userId]);

    return { 
        onlineUsers, 
        sendMessage, 
        sendTyping,
        deleteMessage,
        markAsRead,
        isConnected: socket?.connected || false 
    };
};