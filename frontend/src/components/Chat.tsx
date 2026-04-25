import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import apiService from '../services/api';
import type { User, Message } from '../types';

export const Chat: React.FC = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const typingTimeoutRef = useRef<number>(undefined);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleNewMessage = useCallback((message: Message) => {
        if (selectedUser && message.senderId === selectedUser.id) {
            setMessages(prev => [...prev, message]);
        } else if (message.senderId === user?.id) {
            setMessages(prev => [...prev, message]);
        }
    }, [selectedUser, user]);

    const handleTyping = useCallback((typingUserId: number, typing: boolean) => {
        if (selectedUser && selectedUser.id === typingUserId) {
            setIsTyping(typing);
        }
    }, [selectedUser]);

    const { onlineUsers, sendMessage, sendTyping } = useSocket(
        user?.id,
        selectedUser,
        handleNewMessage,
        handleTyping
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await apiService.getUsers();
            setUsers(fetchedUsers.filter(u => u.id !== user?.id));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchMessages = async (userId: number) => {
        setLoading(true);
        try {
            const fetchedMessages = await apiService.getMessages(userId);
            setMessages(fetchedMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || !user) return;
        
        sendMessage(user.id, selectedUser.id, newMessage);
        setNewMessage('');
    };

    const handleTypingStart = () => {
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r flex flex-col">
                <div className="p-4 border-b bg-blue-500 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold">{user?.fullName || user?.username}</h2>
                            <p className="text-sm opacity-90">{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="px-3 py-1 bg-white text-blue-500 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {users.map((u) => (
                        <div
                            key={u.id}
                            onClick={() => setSelectedUser(u)}
                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b ${
                                selectedUser?.id === u.id ? 'bg-blue-50' : ''
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">
                                        {u.fullName || u.username}
                                    </p>
                                    <p className="text-sm text-gray-500">@{u.username}</p>
                                </div>
                                {onlineUsers.includes(u.id) && (
                                    <div className="relative">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Chat Area */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-white p-4 border-b shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {selectedUser.fullName || selectedUser.username}
                                </h2>
                                <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                            </div>
                            {isTyping && (
                                <div className="text-sm text-gray-500 animate-pulse">
                                    Typing...
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-gray-500">Loading messages...</div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                                                msg.senderId === user?.id
                                                    ? 'bg-blue-500 text-white rounded-br-sm'
                                                    : 'bg-white text-gray-800 rounded-bl-sm shadow'
                                            }`}
                                        >
                                            <p className="break-words">{msg.content}</p>
                                            <p className={`text-xs mt-1 ${
                                                msg.senderId === user?.id ? 'text-blue-100' : 'text-gray-400'
                                            }`}>
                                                {formatTime(msg.createdAt)}
                                                {msg.senderId === user?.id && msg.isRead && ' ✓✓'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>
                    
                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyUp={handleTypingStart}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-semibold"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Select a user to start chatting
                        </h3>
                        <p className="text-gray-400">
                            Choose someone from the sidebar
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};