'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, locale } = useLanguage();

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-extrabold tracking-wider text-white">
                LA PARDA
              </span>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-medium">
                Curtain Atelier & Care
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://t.me/laparda_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-900 hover:bg-amber-800 text-amber-300 hover:text-white flex items-center justify-center transition border border-stone-800"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/laparda_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-900 hover:bg-amber-800 text-amber-300 hover:text-white flex items-center justify-center transition border border-stone-800"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 border-b border-amber-800/40 pb-2">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/" className="hover:text-amber-300 transition">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/loyihalar" className="hover:text-amber-300 transition">
                  {t.nav.projects}
                </Link>
              </li>
              <li>
                <Link href="/biz-haqimizda" className="hover:text-amber-300 transition">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-300 transition">
                  {t.nav.faq}
                </Link>
              </li>
              <li>
                <Link href="/aloqa" className="hover:text-amber-300 transition">
                  {t.nav.contact}
                </Link>
              </li>
              <li>
                <Link href="/maxfiylik" className="hover:text-amber-300 transition">
                  {locale === 'uz' ? 'Maxfiylik siyosati' : 'Политика конфиденциальности'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 border-b border-amber-800/40 pb-2">
              {t.footer.services}
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/xizmatlar/tikish" className="hover:text-amber-300 transition">
                  {t.services.sewingTitle}
                </Link>
              </li>
              <li>
                <Link href="/xizmatlar/yuvish" className="hover:text-amber-300 transition">
                  {t.services.washingTitle}
                </Link>
              </li>
              <li>
                <Link href="/xizmatlar/ornatish" className="hover:text-amber-300 transition">
                  {t.services.installTitle}
                </Link>
              </li>
              <li>
                <Link href="/matolar" className="hover:text-amber-300 transition">
                  {t.services.fabricsTitle}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-sm">
            <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 border-b border-amber-800/40 pb-2">
              {t.footer.contacts}
            </h4>
            <div className="flex items-start space-x-3 text-stone-400">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>{t.address}</span>
            </div>
            <div className="flex items-center space-x-3 text-stone-400">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{t.workingHours}</span>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <Phone className="w-5 h-5 text-amber-400 shrink-0" />
              <a
                href={`tel:${t.phoneRaw}`}
                className="text-amber-300 hover:text-white font-mono text-base font-bold transition"
              >
                {t.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 LA PARDA. {t.footer.rights}</p>
          <div className="flex items-center space-x-6">
            <Link href="/maxfiylik" className="hover:text-stone-400 transition">
              {locale === 'uz' ? 'Maxfiylik kelishuvi' : 'Политика конфиденциальности'}
            </Link>
            <Link href="/admin" className="hover:text-amber-400 transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
