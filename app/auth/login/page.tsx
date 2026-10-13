'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { t, locale } = useLanguage();
  const { refreshUser } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kirishda xatolik');

      await refreshUser();

      if (data.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/kabinet');
      }
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
            LA PARDA
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t.auth.loginTitle}
          </h1>
          <p className="text-stone-500 text-xs">
            {locale === 'uz' ? 'Shaxsiy kabinetingizga xush kelibsiz' : 'Добро пожаловать в личный кабинет'}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              {t.auth.phone} *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none font-mono focus:border-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              {t.auth.password} *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none focus:border-amber-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Kirilmoqda...' : t.auth.loginBtn}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100">
          <Link
            href="/auth/register"
            className="text-xs font-semibold text-amber-900 hover:text-amber-700 transition"
          >
            {t.auth.noAccount}
          </Link>
        </div>

      </div>
    </div>
  );
}
