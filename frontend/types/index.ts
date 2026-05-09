export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    isActive: boolean;
    socketId?: string;
}

export interface Message {
    id: number;
    content: string;
    senderId: number;
    receiverId: number;
    createdAt: string;
    isRead: boolean;
    readAt?: string;
    sender?: User;
    receiver?: User;
}

export interface AuthResponse {
    token: string;
    user: User;
    message: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    fullName?: string;
}