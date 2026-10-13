'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { t, locale } = useLanguage();
  const { refreshUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [adminCode, setAdminCode] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(locale === 'uz' ? 'Parollar bir-biriga mos kelmadi' : 'Пароли не совпадают');
      return;
    }

    if (!agreePrivacy) {
      setError(locale === 'uz' ? 'Maxfiylik shartlariga rozilik bildirilishi shart' : 'Необходимо согласиться с политикой конфиденциальности');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          password,
          confirmPassword,
          agreePrivacy,
          adminCode: adminCode ? adminCode.trim() : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi');

      await refreshUser();

      // Check if user has draft order waiting to be submitted
      const draft = localStorage.getItem('laparda_order_draft');
      if (draft) {
        router.push('/aloqa');
      } else {
        router.push('/kabinet');
      }
    } catch (err: any) {
      setError(err.message || 'Xatolik');
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
            {t.auth.registerTitle}
          </h1>
          <p className="text-stone-500 text-xs">
            {locale === 'uz' ? 'Buyurtmalaringizni kuzatish va saqlash uchun' : 'Для отслеживания ваших заказов и проектов'}
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
              {t.auth.name} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ism va familiyangiz"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none focus:border-amber-800"
            />
          </div>

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
              {t.auth.password} (kamida 6 ta belgi) *
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

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              {t.auth.confirmPassword} *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none focus:border-amber-800"
            />
          </div>

          {/* Privacy agreement checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="privacy"
              checked={agreePrivacy}
              onChange={e => setAgreePrivacy(e.target.checked)}
              className="w-4 h-4 rounded text-amber-800 focus:ring-amber-700 border-stone-300"
            />
            <label htmlFor="privacy" className="text-xs text-stone-600">
              <Link href="/maxfiylik" className="text-amber-900 underline hover:text-amber-700">
                {t.auth.agreePrivacy}
              </Link>
            </label>
          </div>

          {/* Optional Admin secret code toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdminCode(!showAdminCode)}
              className="text-[11px] text-stone-400 hover:text-stone-600 transition"
            >
              {showAdminCode ? '— Admin kodini yopish' : '+ Administrator bo‘lib ro‘yxatdan o‘tish'}
            </button>
            {showAdminCode && (
              <div className="mt-2">
                <input
                  type="password"
                  value={adminCode}
                  onChange={e => setAdminCode(e.target.value)}
                  placeholder="Admin maxfiy kodi (ixtiyoriy)"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/50 text-stone-900 text-xs outline-none"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Yaratilmoqda...' : t.auth.registerBtn}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100">
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-amber-900 hover:text-amber-700 transition"
          >
            {t.auth.haveAccount}
          </Link>
        </div>

      </div>
    </div>
  );
}
