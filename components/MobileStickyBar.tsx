'use client';

import React, { useState } from 'react';
import { Phone, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import OrderModal from '@/components/OrderModal';

export default function MobileStickyBar() {
  const { t, locale } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 p-2.5 sm:hidden flex items-center justify-between gap-2 shadow-2xl">
        <a
          href={`tel:${t.phoneRaw}`}
          className="flex-1 py-2.5 px-2 rounded-xl bg-stone-800 text-stone-200 hover:text-white text-xs font-medium flex items-center justify-center space-x-1.5 transition"
        >
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>{locale === 'uz' ? 'Qo‘ng‘iroq' : 'Звонок'}</span>
        </a>

        <a
          href="https://t.me/laparda_uz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-2 rounded-xl bg-sky-950 text-sky-200 text-xs font-medium flex items-center justify-center space-x-1.5 transition border border-sky-800/50"
        >
          <Send className="w-3.5 h-3.5 text-sky-400" />
          <span>Telegram</span>
        </a>

        <button
          onClick={() => setModalOpen(true)}
          className="flex-1 py-2.5 px-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{locale === 'uz' ? 'Buyurtma' : 'Заказать'}</span>
        </button>
      </div>

      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
