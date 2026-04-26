'use client';

import { useEffect, useState } from 'react';
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

    useEffect(() => {
        if (!userId) return;

        const newSocket = apiService.connectSocket(userId);
        setSocket(newSocket);

        newSocket.on('usersOnline', (users: number[]) => {
            setOnlineUsers(users);
        });

        newSocket.on('newMessage', (message: Message) => {
            onNewMessage(message);
        });

        newSocket.on('messageSent', (message: Message) => {
            onNewMessage(message);
        });

        newSocket.on('userTyping', ({ userId: typingUserId, isTyping }: { userId: number; isTyping: boolean }) => {
            if (selectedUser && selectedUser.id === typingUserId) {
                onTyping(typingUserId, isTyping);
            }
        });

        return () => {
            newSocket.off('usersOnline');
            newSocket.off('newMessage');
            newSocket.off('messageSent');
            newSocket.off('userTyping');
            apiService.disconnectSocket();
        };
    }, [userId, selectedUser]);

    const sendMessage = (senderId: number, receiverId: number, content: string) => {
        if (socket) {
            socket.emit('sendMessage', { senderId, receiverId, content });
        }
    };

    const sendTyping = (receiverId: number, isTyping: boolean) => {
        if (socket) {
            socket.emit('typing', { receiverId, isTyping });
        }
    };

    return { onlineUsers, sendMessage, sendTyping };
};