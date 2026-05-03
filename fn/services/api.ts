import axios, { type AxiosInstance } from 'axios';
import { io, Socket } from 'socket.io-client';
import type { AuthResponse, LoginCredentials, Message, RegisterData, User } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiService {
    private api: AxiosInstance;
    private socket: Socket | null = null;

    constructor() {
        this.api = axios.create({
            baseURL: '/api',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.api.interceptors.request.use((config) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        });
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await this.api.post('/auth/login', credentials);
        return response.data;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await this.api.post('/auth/register', data);
        return response.data;
    }

    async getUsers(): Promise<User[]> {
        const response = await this.api.get('/auth/users');
        return response.data;
    }

    async getMessages(userId: number): Promise<Message[]> {
        const response = await this.api.get(`/messages/${userId}`);
        return response.data;
    }

    async markAsRead(messageId: number): Promise<void> {
        await this.api.put(`/messages/${messageId}/read`);
    }

    // Fixed delete methods - removed extra options
    async deleteMessage(messageId: number): Promise<void> {
        await this.api.delete(`/messages/${messageId}`);
    }

    async deleteConversation(userId: number): Promise<void> {
        await this.api.delete(`/messages/conversation/${userId}`);
    }

    connectSocket(userId: number): Socket {
        if (typeof window === 'undefined') return null as any;

        this.socket = io(API_URL, {
            transports: ['websocket'],
            path: '/socket.io',
            reconnection: true, 
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.socket?.emit('userOnline', userId);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        return this.socket;
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    disconnectSocket(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const apiService = new ApiService();
export default apiService;