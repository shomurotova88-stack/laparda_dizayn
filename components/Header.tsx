'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, User, Shield, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import OrderModal from '@/components/OrderModal';

export default function Header() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/loyihalar', label: t.nav.projects },
    { href: '/xizmatlar/tikish', label: t.nav.sewing },
    { href: '/xizmatlar/yuvish', label: t.nav.washing },
    { href: '/xizmatlar/ornatish', label: t.nav.installation },
    { href: '/matolar', label: t.nav.fabrics },
    { href: '/biz-haqimizda', label: t.nav.about },
    { href: '/faq', label: t.nav.faq },
    { href: '/aloqa', label: t.nav.contact }
  ];

  return (
    <>
      {/* Top Luxury Announcement & Quick Contact Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-stone-300">
              {locale === 'uz'
                ? 'Toshkent bo‘yicha bepul o‘lchov va dizayner maslahati'
                : 'Бесплатный выезд дизайнера на замер по Ташкенту'}
            </span>
          </div>

          <div className="flex items-center space-x-5 ml-auto sm:ml-0">
            {/* Phone */}
            <a
              href={`tel:${t.phoneRaw}`}
              className="flex items-center space-x-1.5 text-amber-300 hover:text-amber-200 font-mono font-medium transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.phoneDisplay}</span>
            </a>

            {/* Language Switcher */}
            <div className="flex items-center space-x-1 bg-stone-800 rounded-full p-0.5 border border-stone-700">
              <button
                onClick={() => setLocale('uz')}
                className={`px-2 py-0.5 rounded-full text-xs transition ${
                  locale === 'uz' ? 'bg-amber-700 text-white font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                UZ
              </button>
              <button
                onClick={() => setLocale('ru')}
                className={`px-2 py-0.5 rounded-full text-xs transition ${
                  locale === 'ru' ? 'bg-amber-700 text-white font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                RU
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EBE3DA] shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-stone-900 group-hover:text-amber-900 transition-colors">
              LA PARDA
            </span>
            <span className="text-[10px] uppercase tracking-widest text-amber-800 font-sans font-medium">
              Curtain Atelier
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-6 text-[13px] font-medium text-stone-700">
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-amber-900 relative py-1 ${
                    active ? 'text-amber-900 font-bold' : ''
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cabinet, Admin, Order CTA, Mobile Toggle */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* User Cabinet / Login */}
            {user ? (
              <Link
                href="/kabinet"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition"
              >
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex items-center space-x-1 px-3 py-2 rounded-full text-stone-700 hover:text-stone-900 text-xs font-medium transition"
              >
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span>{t.nav.login}</span>
              </Link>
            )}

            {/* Admin Badge link if admin */}
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-amber-900/10 text-amber-900 hover:bg-amber-900/20 text-xs font-semibold transition"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}

            {/* Order Button CTA */}
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-4 sm:px-5 py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.nav.orderBtn}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FDFBF7] border-b border-[#EBE3DA] px-4 pt-2 pb-6 space-y-3 shadow-xl animate-fadeIn">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                    pathname === link.href
                      ? 'bg-amber-800/10 text-amber-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              {user ? (
                <Link
                  href="/kabinet"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-stone-800 flex items-center space-x-2"
                >
                  <User className="w-4 h-4 text-amber-700" />
                  <span>{user.name} ({t.nav.cabinet})</span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-stone-800 flex items-center space-x-2"
                >
                  <User className="w-4 h-4 text-stone-600" />
                  <span>{t.nav.login} / {t.auth.registerTitle}</span>
                </Link>
              )}

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setLocale('uz')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    locale === 'uz' ? 'bg-amber-800 text-white' : 'text-stone-600'
                  }`}
                >
                  UZ
                </button>
                <button
                  onClick={() => setLocale('ru')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    locale === 'ru' ? 'bg-amber-800 text-white' : 'text-stone-600'
                  }`}
                >
                  RU
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
}
