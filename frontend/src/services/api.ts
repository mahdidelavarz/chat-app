import axios, { type AxiosInstance } from 'axios';
import { io, Socket } from 'socket.io-client';
import type { AuthResponse, LoginCredentials, Message, RegisterData, User } from '../types';



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

        // Add token to requests
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    // Auth endpoints
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

    // Message endpoints
    async getMessages(userId: number): Promise<Message[]> {
        const response = await this.api.get(`/messages/${userId}`);
        return response.data;
    }

    async markAsRead(messageId: number): Promise<void> {
        await this.api.put(`/messages/${messageId}/read`);
    }

    // Socket connection
    connectSocket(userId: number): Socket {
        this.socket = io('/', {
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.socket?.emit('userOnline', userId);
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