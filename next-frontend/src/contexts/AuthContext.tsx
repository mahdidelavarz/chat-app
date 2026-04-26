'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../services/api';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if we're in browser environment
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            
            if (storedToken && storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    setToken(storedToken);
                    setUser(userData);
                    
                    // Reconnect socket
                    apiService.connectSocket(userData.id);
                } catch (error) {
                    console.error('Error parsing stored user:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        }
        
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        const response = await apiService.login({ username, password });
        const { token, user } = response;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        apiService.connectSocket(user.id);
        router.push('/chat');
    };

    const register = async (data: any) => {
        const response = await apiService.register(data);
        const { token, user } = response;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        apiService.connectSocket(user.id);
        router.push('/chat');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        apiService.disconnectSocket();
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};