'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    token: string | null;
    username: string | null;
    isLoading: boolean;
    login: (token: string, username: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem('vt_admin_token');
        const savedUser = localStorage.getItem('vt_admin_user');
        if (savedToken) {
            setToken(savedToken);
            setUsername(savedUser);
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, newUser: string) => {
        setToken(newToken);
        setUsername(newUser);
        localStorage.setItem('vt_admin_token', newToken);
        localStorage.setItem('vt_admin_user', newUser);
        setIsLoading(false);
        router.push('/admin');
    };

    const logout = () => {
        setToken(null);
        setUsername(null);
        localStorage.removeItem('vt_admin_token');
        localStorage.removeItem('vt_admin_user');
        setIsLoading(false);
        router.push('/admin/login');
    };

    return (
        <AuthContext.Provider value={{ token, username, isLoading, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
