'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Award, Heart, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CurtainVideoPlayer from '@/components/CurtainVideoPlayer';
import OrderModal from '@/components/OrderModal';
import mediaManifest from '@/lib/media-manifest.json';

export default function AboutPage() {
  const { t, locale } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const media = mediaManifest.pages.about;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-800/10 text-amber-900 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>LA PARDA FALSAFASI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
          {locale === 'uz' ? 'LA PARDA haqida' : 'О бренде LA PARDA'}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {locale === 'uz'
            ? 'Biz shunchaki mato tikmaymiz — xonadoningizga osoyishtalik, harorat va haqiqiy nafosat bag‘ishlaymiz.'
            : 'Мы создаем не просто шторы — мы наполняем ваш дом уютом, гармонией и утонченной роскошью.'}
        </p>
      </div>

      {/* Atelier Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5 text-stone-700 leading-relaxed text-sm sm:text-base">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {locale === 'uz'
              ? 'Toshkentda sifatli parda madaniyatini rivojlantiramiz'
              : 'Культура качественного текстиля в Ташкенте'}
          </h2>
          <p>
            {locale === 'uz'
              ? 'LA PARDA — individual parda tikish, o‘rnatish va parvarishlash bo‘yicha to‘liq professional xizmat ko‘rsatuvchi zamonaviy ustaxona. Bizning asosiy maqsadimiz — mijozga ortiqcha tashvishlarsiz, o‘lchovdan boshlab to parda osilib bug‘lanishigacha bo‘lgan barcha jarayonni mukammal darajada yetkazishdir.'
              : 'LA PARDA — современное текстильное ателье полного цикла в Ташкенте. Мы берем на себя все заботы: от точного лазерного замера и подбора тканей до идеальной навески и последующего ухода за шторами.'}
          </p>
          <p>
            {locale === 'uz'
              ? 'Biz Turkiyadan keltirilgan eng sifatli to‘qimachilik mahsulotlari bilan ishlaymiz. Har bir parda individual loyiha bo‘lib, xona yoritilishi, devor va mebellar rangi inobatga olingan holda tayyorlanadi.'
              : 'Мы работаем с проверенными текстильными фабриками Турции. Каждое изделие — это штучная работа, созданная под геометрию помещения, освещенность и стиль интерьера.'}
          </p>

          <div className="pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-8 py-3.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold shadow-md transition"
            >
              {t.hero.bookMeasure}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-stone-200">
            <Image
              src={media.atelier}
              alt="LA PARDA ustaxonasi"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-stone-200 mt-6">
            <Image
              src={media.craftsmanship}
              alt="Parda tikish jarayoni"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Dedicated HTML5 Video Block */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              {locale === 'uz' ? 'USTAXONA VA DIZAYN' : 'АТЕЛЬЕ И ДИЗАЙН'}
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              {locale === 'uz'
                ? 'Bizning ishga bo‘lgan munosabatimiz'
                : 'Наш подход к каждому проекту'}
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              {locale === 'uz'
                ? 'Har bir mijozimizning xursandchiligi va uylaridagi shinamlik biz uchun eng katta qadriyatdir. Loyihalarimiz qanday amalga oshirilishini videoda ko‘ring.'
                : 'Главная награда для нас — уют в домах наших клиентов и их доверие. Посмотрите видео о наших проектах и стандартах работы.'}
            </p>
          </div>

          <div className="lg:col-span-7">
            <CurtainVideoPlayer
              src={media.video}
              poster={media.videoPoster}
              title={locale === 'uz' ? 'LA PARDA loyihalari va ustalari' : 'Мастера и проекты LA PARDA'}
              className="aspect-video"
            />
          </div>
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
