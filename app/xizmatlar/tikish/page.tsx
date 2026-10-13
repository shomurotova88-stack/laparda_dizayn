'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Scissors, CheckCircle, ArrowRight, ShieldCheck, Ruler, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CurtainVideoPlayer from '@/components/CurtainVideoPlayer';
import OrderModal from '@/components/OrderModal';
import mediaManifest from '@/lib/media-manifest.json';

export default function SewingPage() {
  const { t, locale } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const media = mediaManifest.pages.sewing;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 sm:p-14 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Scissors className="w-3.5 h-3.5" />
              <span>INDIVIDUAL TIKUV USTAXONASI</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
              {locale === 'uz' ? 'Buyurtma asosida parda tikish' : 'Индивидуальный пошив штор на заказ'}
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl font-light">
              {locale === 'uz'
                ? 'Sizning xonadoningiz derazalari uchun maxsus andazalar, Yevropa va Turkiya matolari hamda mukammal choklar. Mutaxassisimiz uyingizga bepul boradi.'
                : 'Индивидуальные лекала, ткани ведущих фабрик Турции и Европы, идеальные драпировки. Бесплатный выезд дизайнера с образцами.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-8 py-3.5 rounded-full bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold shadow-xl transition"
              >
                {t.hero.bookMeasure}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-white/10">
            <Image
              src={media.banner}
              alt="Parda tikish jarayoni"
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
              {locale === 'uz' ? 'USTAXONA JARAYONI' : 'ПРОЦЕСС В МАСТЕРСКОЙ'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {locale === 'uz'
                ? 'Har bir chok va taxlamda mukammallik'
                : 'Безупречность каждого шва и складки'}
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              {locale === 'uz'
                ? 'Pardalarimiz standart zavod konveyerida emas, har bir derazaning balandligi va xususiyatiga moslab individual qo‘l mehnati bilan tikiladi.'
                : 'Каждое полотно штор шьется вручную нашими мастерами по точным размерам ваших окон с соблюдением технологии идеальных складок.'}
            </p>
          </div>

          <div className="lg:col-span-7">
            <CurtainVideoPlayer
              src={media.video}
              poster={media.videoPoster}
              title={locale === 'uz' ? 'Parda tikish va nazorat jarayoni' : 'Процесс пошива и контроля качества'}
              className="aspect-video"
            />
          </div>
        </div>
      </div>

      {/* 4 Key Advantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Ruler className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            {locale === 'uz' ? 'Aniq millimetrli o‘lchov' : 'Точный замер до миллиметра'}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {locale === 'uz'
              ? 'Lazer o‘lchagichlar bilan shift, karniz balandligi va poldan oraliq masofa aniq hisoblanadi.'
              : 'Лазерные замеры потолка, высоты карнизов и расстояния от пола гарантируют идеальную посадку.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            {locale === 'uz' ? 'Sifatli Yevropa furnituralari' : 'Европейская фурнитура'}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {locale === 'uz'
              ? 'Yuvganda qisqarmaydigan maxsus parda tasmalar, ilmoqlar va og‘irlik beruvchi qo‘shimchalar ishlatiladi.'
              : 'Используем долговечные шторные ленты, люверсы и утяжелители, которые не деформируются при стирке.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            {locale === 'uz' ? 'Tez va o‘z vaqtida tikish' : 'Оперативный пошив в срок'}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed">
            {locale === 'uz'
              ? 'Mato tanlanganidan so‘ng 3-7 ish kuni ichida tayyor bo‘ladi va uyingizga keltirib o‘rnatiladi.'
              : 'Срок готовности от 3 до 7 рабочих дней с момента утверждения ткани с последующей доставкой и навеской.'}
          </p>
        </div>
      </div>

      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialService="tikish"
      />
    </div>
  );
}
