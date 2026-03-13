'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    token: string | null;
    username: string | null;
    login: (token: string, username: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem('vt_admin_token');
        const savedUser = localStorage.getItem('vt_admin_user');
        if (savedToken) {
            setToken(savedToken);
            setUsername(savedUser);
        }
    }, []);

    const login = (newToken: string, newUser: string) => {
        setToken(newToken);
        setUsername(newUser);
        localStorage.setItem('vt_admin_token', newToken);
        localStorage.setItem('vt_admin_user', newUser);
        router.push('/admin');
    };

    const logout = () => {
        setToken(null);
        setUsername(null);
        localStorage.removeItem('vt_admin_token');
        localStorage.removeItem('vt_admin_user');
        router.push('/admin/login');
    };

    return (
        <AuthContext.Provider value={{ token, username, login, logout, isAuthenticated: !!token }}>
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
