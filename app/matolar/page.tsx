'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Palette, Sun, Sparkles, Shield, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CurtainVideoPlayer from '@/components/CurtainVideoPlayer';
import OrderModal from '@/components/OrderModal';
import mediaManifest from '@/lib/media-manifest.json';

export default function FabricsPage() {
  const { t, locale } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const media = mediaManifest.pages.fabrics;

  const fabricTypes = [
    {
      titleUz: '100% Blackout (To‘liq qorong‘ulik)',
      titleRu: '100% Блэкаут (Полное затемнение)',
      descUz: 'Yotoqxona va kino zallari uchun. Quyosh nuri va issiqlikni butunlay to‘sadi.',
      descRu: 'Для спален и домашних кинотеатров. Полная блокировка света и ультрафиолета.',
      protection: '100%',
      image: media.blackout
    },
    {
      titleUz: 'Premium Baxmal (Velvet)',
      titleRu: 'Премиальный Бархат',
      descUz: 'Klassik va neoklassik interyerlar uchun hashamatli, to‘kiluvchan og‘ir mato.',
      descRu: 'Роскошная тяжелая ткань с благородным блеском для гостиных и парадных залов.',
      protection: '85%',
      image: media.banner
    },
    {
      titleUz: 'Tabiiy Zig‘ir va Mat (Linen)',
      titleRu: 'Натуральный Лен и Рогожка',
      descUz: 'Zamonaviy minimalizm va skandinavcha uslub uchun ekologik sof tekstura.',
      descRu: 'Экологичные дышащие текстуры для современного минимализма и экостиля.',
      protection: '65%',
      image: media.linen
    },
    {
      titleUz: 'Nozik Tuly va Shifon (Sheer)',
      titleRu: 'Изящный Тюль и Шифон',
      descUz: 'Xonani yumshoq yorug‘lik bilan to‘ldiruvchi yengil, havodor parda matolari.',
      descRu: 'Легкие, струящиеся полотна, мягко рассеивающие дневной солнечный свет.',
      protection: '20%',
      image: media.sheer
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-800/10 text-amber-900 text-xs font-semibold uppercase tracking-wider">
          <Palette className="w-3.5 h-3.5 text-amber-700" />
          <span>MATOLAR KOLLEKSIYASI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
          {locale === 'uz' ? 'Matolar va quyoshdan himoya' : 'Ткани и защита от солнца'}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {locale === 'uz'
            ? 'Turkiya va Yevropaning yetakchi to‘qimachilik fabrikalaridan 500 dan ortiq mato turlari. Barcha kataloglar bilan dizaynerimiz xonadoningizga bepul boradi.'
            : 'Более 500 видов портьерных и тюлевых тканей от ведущих фабрик Турции и Европы. Привезем все образцы к вам домой бесплатно.'}
        </p>
      </div>

      {/* Video Block */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              {locale === 'uz' ? 'MATO TEKSTURASI' : 'ТЕКСТУРА ТКАНЕЙ'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {locale === 'uz'
                ? 'Yorug‘lik va mato uyg‘unligi'
                : 'Игра света и фактуры в интерьере'}
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              {locale === 'uz'
                ? 'Blackout matolar nafaqat quyosh nurlaridan, balki yozda xona qizib ketishidan ham asraydi. Videoda matolarning qalinligi va to‘kilishini ko‘rishingiz mumkin.'
                : 'Ткани блэкаут защищают не только от яркого солнца, но и от летнего зноя Ташкента. На видео видна плотность и драпируемость полотен.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 rounded-full bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold transition"
              >
                {locale === 'uz' ? 'Mato namunalarini ko‘rishga yozilish' : 'Вызвать дизайнера с каталогами'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <CurtainVideoPlayer
              src={media.video}
              poster={media.videoPoster}
              title={locale === 'uz' ? 'Blackout va dekorativ matolar namoyishi' : 'Демонстрация блэкаут и портьерных тканей'}
              className="aspect-video"
            />
          </div>
        </div>
      </div>

      {/* Fabric Types Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {fabricTypes.map((fab, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <Image
                src={fab.image}
                alt={fab.titleUz}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-semibold flex items-center space-x-1">
                <Sun className="w-3.5 h-3.5" />
                <span>{fab.protection}</span>
              </div>
            </div>

            <div className="p-6 space-y-3 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
                  {locale === 'uz' ? fab.titleUz : fab.titleRu}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {locale === 'uz' ? fab.descUz : fab.descRu}
                </p>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-amber-800 hover:text-white text-stone-800 text-xs font-medium transition"
              >
                {locale === 'uz' ? 'Shu matoni tanlash' : 'Выбрать эту ткань'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialService="matolar"
      />
    </div>
  );
}
