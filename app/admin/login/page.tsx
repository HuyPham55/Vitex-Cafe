'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Coffee, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { fetchAPI, endpoints } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push('/admin');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await fetchAPI(`${endpoints.auth}/login`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            login(data.token, data.username);
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background-dark p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-primary/5 border border-primary/10 overflow-hidden">
                <div className="p-8 text-center bg-primary/5 border-b border-primary/10">
                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary text-white mb-4 shadow-lg shadow-primary/20">
                        <Coffee className="size-10" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Vitex Admin</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Please sign in to manage your cafe</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                            <AlertCircle className="size-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-5" />
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/20 rounded-xl pl-12 pr-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-5" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-slate-50 dark:bg-background-dark border border-primary/20 rounded-xl pl-12 pr-4 py-4 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin size-5" /> : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
