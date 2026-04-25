import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            
            // Reconnect socket
            const userData = JSON.parse(storedUser);
            apiService.connectSocket(userData.id);
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
    };

    const register = async (data: any) => {
        const response = await apiService.register(data);
        const { token, user } = response;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        apiService.connectSocket(user.id);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        apiService.disconnectSocket();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};