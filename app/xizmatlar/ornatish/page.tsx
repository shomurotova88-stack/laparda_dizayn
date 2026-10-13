'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Wrench, Sparkles, CheckCircle, Ruler, Cpu, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CurtainVideoPlayer from '@/components/CurtainVideoPlayer';
import OrderModal from '@/components/OrderModal';
import mediaManifest from '@/lib/media-manifest.json';

export default function InstallationPage() {
  const { t, locale } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const media = mediaManifest.pages.installation;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white p-8 sm:p-14 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Wrench className="w-3.5 h-3.5" />
              <span>KARNIZLAR VA MONTAJ</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
              {locale === 'uz' ? 'O‘lchov, karnizlar va professional o‘rnatish' : 'Замер, карнизы и профессиональный монтаж'}
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl font-light">
              {locale === 'uz'
                ? 'Toshkent shahri bo‘yicha bepul o‘lchov olish. Yashirin shift karnizlari, alyuminiy profillar va aqlli pultli motorlashtirilgan karnizlar o‘rnatish.'
                : 'Бесплатный выезд на замер по Ташкенту. Монтаж скрытых потолочных ниш, алюминиевых профилей и умных моторизованных карнизов.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-8 py-3.5 rounded-full bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold shadow-xl transition"
              >
                {t.banner.cta}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-white/10">
            <Image
              src={media.banner}
              alt="Karniz o'rnatish"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Video Block */}
      <div className="bg-[#F5EFEB] rounded-3xl p-6 sm:p-10 border border-[#EBE3DA]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
              {locale === 'uz' ? 'MONTAJ JARAYONI' : 'ПРОЦЕСС МОНТАЖА'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {locale === 'uz'
                ? 'Ishonchli va tekis o‘rnatish'
                : 'Надежное и аккуратное крепление'}
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              {locale === 'uz'
                ? 'Gipsokarton, beton yoki to‘xtatilgan shiftlarga changsiz maxsus uskunalar yordamida mahkam o‘rnatamiz. Karnizlar og‘ir baxmal pardalarni ham bemalol ko‘taradi.'
                : 'Установка в гипсокартон, бетон или натяжные потолки с беспылевым инструментом. Наши карнизы выдерживают даже самые тяжелые шторы.'}
            </p>
          </div>

          <div className="lg:col-span-7">
            <CurtainVideoPlayer
              src={media.video}
              poster={media.videoPoster}
              title={locale === 'uz' ? 'Karniz va parda o‘rnatish videosi' : 'Видео монтажа карнизов'}
              className="aspect-video"
            />
          </div>
        </div>
      </div>

      {/* Cornice Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            {locale === 'uz' ? 'Motorlashtirilgan aqlli karnizlar' : 'Моторизованные электрокарнизы'}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {locale === 'uz'
              ? 'Pult, smartfon yoki Alice/Google Home orqali boshqariladigan zamonaviy sokin motorlar.'
              : 'Бесшумное управление с пульта, смартфона или голосовых помощников Алиса и Google Home.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Ruler className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            {locale === 'uz' ? 'Yashirin shift profillari' : 'Скрытые потолочные профили'}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {locale === 'uz'
              ? 'Shift orasiga yashirinadigan zamonaviy minimalist alyuminiy relslar.'
              : 'Минималистичные алюминиевые профили, создающие эффект парящих из потолка штор.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            {locale === 'uz' ? 'Kafolatli montaj xizmati' : 'Гарантия на все работы'}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {locale === 'uz'
              ? 'Barcha o‘rnatilgan karniz va mexanizmlarga to‘liq kafolat beramiz.'
              : 'Предоставляем гарантию на все карнизы, моторы и крепежные элементы.'}
          </p>
        </div>
      </div>

      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialService="ornatish"
      />
    </div>
  );
}
