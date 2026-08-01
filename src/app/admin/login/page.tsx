'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, User as UserIcon, AlertCircle, Eye, EyeOff, Layout } from 'lucide-react';
import { authService } from '../../../services/auth.service';
import { useAuthStore } from '../../../store/useAuthStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      setIsLoading(true);
      setError('');
      const res = await authService.login(username, password);
      setAuth(res.user, res.accessToken);
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Login failed', err);
      setError(
        err.response?.data?.message || 
        'Login yoki parol xato! Iltimos, qaytadan urinib ko\'ring.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-warm flex flex-col gap-6">
        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-accent-light/10 text-accent flex items-center justify-center mb-1">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <h2 className="font-sans font-bold text-xl text-text-primary uppercase tracking-tight">
            Admin Tizimi
          </h2>
          <p className="text-xs text-text-secondary">
            Vodiy Kafel boshqaruv paneliga kirish
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="p-3.5 bg-error-light border border-error/25 rounded-xl text-error text-xs flex items-start gap-2 animate-fade-in leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
              Login (Username)
            </label>
            <div className="relative flex items-center border border-border bg-white rounded-lg focus-within:border-accent">
              <span className="pl-3 text-text-muted">
                <UserIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Admin login..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full h-11 pl-2.5 pr-3 text-sm focus:outline-none placeholder-text-muted"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
              Parol
            </label>
            <div className="relative flex items-center border border-border bg-white rounded-lg focus-within:border-accent">
              <span className="pl-3 text-text-muted">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Parol..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 pl-2.5 pr-10 text-sm focus:outline-none placeholder-text-muted"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-text-muted hover:text-accent transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-accent/15 flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? 'Kirilmoqda...' : 'Tizimga kirish'}
          </button>
        </form>

        {/* Back Link */}
        <button
          onClick={() => router.push('/')}
          className="text-xs text-text-secondary hover:text-accent transition-colors text-center font-medium mt-1"
        >
          &larr; Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
}
