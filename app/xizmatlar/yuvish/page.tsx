'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Waves, Sparkles, CheckCircle, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CurtainVideoPlayer from '@/components/CurtainVideoPlayer';
import OrderModal from '@/components/OrderModal';
import mediaManifest from '@/lib/media-manifest.json';

export default function WashingPage() {
  const { t, locale } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const media = mediaManifest.pages.washing;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-950 via-slate-900 to-sky-950 text-white p-8 sm:p-14 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-400/10 border border-sky-400/20 text-sky-300 text-xs font-semibold uppercase tracking-wider">
              <Waves className="w-3.5 h-3.5" />
              <span>PROFESSIONAL PARDA YUVISH VA TOZALASH</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
              {locale === 'uz' ? 'Parda yuvish, dazmollash va qayta osish' : 'Стирка, чистка и отпаривание штор'}
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl font-light">
              {locale === 'uz'
                ? 'Pardalarni o‘zingiz yechib qiynalmaysiz! Mutaxassislarimiz kelib ehtiyotkorlik bilan yechib oladi, maxsus vositalarda tozalaydi, bug‘lab dazmollaydi va yana o‘rniga chiroyli qilib ilib beradi.'
                : 'Вам не нужно снимать тяжелые шторы самим! Наши мастера бережно снимут их, бережно постирают, профессионально отпарят и повесят обратно на карниз.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-8 py-3.5 rounded-full bg-sky-700 hover:bg-sky-600 text-white text-sm font-semibold shadow-xl transition"
              >
                {locale === 'uz' ? 'Yuvish xizmatiga buyurtma berish' : 'Заказать стирку штор'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-white/10">
            <Image
              src={media.banner}
              alt="Parda yuvish xizmati"
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
            <span className="text-xs uppercase tracking-widest text-sky-800 font-bold">
              {locale === 'uz' ? 'PARVARISH VA TOZALASH' : 'УХОД И ЧИСТКА'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {locale === 'uz'
                ? 'Nozik matolar uchun maxsus texnologiya'
                : 'Бережная технология для деликатных тканей'}
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              {locale === 'uz'
                ? 'Baxmal, shifon, jakkard va blackout matolari oddiy kir yuvish mashinasida buzilishi mumkin. Biz har bir mato turiga mos harorat va professional xavfsiz vositalar bilan ishlaymiz.'
                : 'Бархат, тонкий шелк, жаккард и блэкаут требуют строгого температурного режима. Мы используем гипоаллергенные средства и профессиональное паровое оборудование.'}
            </p>
          </div>

          <div className="lg:col-span-7">
            <CurtainVideoPlayer
              src={media.video}
              poster={media.videoPoster}
              title={locale === 'uz' ? 'Parda tozalash va parvarish jarayoni' : 'Процесс стирки и отпаривания штор'}
              className="aspect-video"
            />
          </div>
        </div>
      </div>

      {/* 4 Steps of Curtain Washing */}
      <div className="space-y-6">
        <h3 className="text-2xl font-serif font-bold text-stone-900 text-center">
          {locale === 'uz' ? 'Parda yuvish xizmati qanday amalga oshiriladi?' : 'Как проходит чистка штор под ключ?'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">1-bosqich</span>
            <h4 className="text-lg font-serif font-bold text-stone-900">
              {locale === 'uz' ? 'Yechib olish' : 'Бережный демонтаж'}
            </h4>
            <p className="text-stone-600 text-xs leading-relaxed">
              {locale === 'uz' ? 'Karnizdan barcha ilmoq va tasmalar ehtiyotkorlik bilan yechiladi.' : 'Мастера аккуратно снимают шторы со скрытых или высоких карнизов.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">2-bosqich</span>
            <h4 className="text-lg font-serif font-bold text-stone-900">
              {locale === 'uz' ? 'Eko-tozalash' : 'Эко-чистка и стирка'}
            </h4>
            <p className="text-stone-600 text-xs leading-relaxed">
              {locale === 'uz' ? 'Chang, dog‘lar va hidlar maxsus ekologik xavfsiz vositalar bilan ketkaziladi.' : 'Удаление пыли, пятен и запахов без деформации структуры ткани.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">3-bosqich</span>
            <h4 className="text-lg font-serif font-bold text-stone-900">
              {locale === 'uz' ? 'Bug‘lab dazmollash' : 'Вертикальное отпаривание'}
            </h4>
            <p className="text-stone-600 text-xs leading-relaxed">
              {locale === 'uz' ? 'Kuchli professional bug‘ generatorlari yordamida g‘ijimlar tekislanadi.' : 'Разглаживание складок мощным паровым генератором без повреждения волокон.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">4-bosqich</span>
            <h4 className="text-lg font-serif font-bold text-stone-900">
              {locale === 'uz' ? 'Qayta osib berish' : 'Навеска и драпировка'}
            </h4>
            <p className="text-stone-600 text-xs leading-relaxed">
              {locale === 'uz' ? 'Pardalar o‘z o‘rniga mukammal taxlamlar bilan qayta ilib beriladi.' : 'Возвращаем шторы на карниз и выравниваем идеальные драпировки.'}
            </p>
          </div>
        </div>
      </div>

      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialService="yuvish"
      />
    </div>
  );
}
