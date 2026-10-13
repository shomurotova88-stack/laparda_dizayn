'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Scissors, Waves, Wrench, Palette, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CurtainVideoPlayer from '@/components/CurtainVideoPlayer';
import ProjectCard from '@/components/ProjectCard';
import OrderModal from '@/components/OrderModal';
import mediaManifest from '@/lib/media-manifest.json';

export default function HomePage() {
  const { t, locale } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('tikish');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const homeMedia = mediaManifest.pages.home;
  const projects = mediaManifest.pages.projects.items.slice(0, 4);

  const handleOrderForProject = (project: any) => {
    setSelectedProject(project);
    setSelectedService('tikish');
    setIsOrderModalOpen(true);
  };

  const handleBookMeasure = () => {
    setSelectedProject(null);
    setSelectedService('tikish');
    setIsOrderModalOpen(true);
  };

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-[#F7F2EB] overflow-hidden pt-10 pb-16">
        {/* Background Subtle Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-stone-200/50 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Text Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-800/10 border border-amber-800/20 text-amber-900 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.hero.subtitle}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-[1.15]">
                {t.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                {t.hero.description}
              </p>

              {/* Action Buttons: "Qilingan ishlarni ko‘rish" & "O‘lchovga yozilish" */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/loyihalar"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900 hover:bg-black text-white text-sm font-semibold shadow-xl hover:shadow-2xl transition duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>{t.hero.viewProjects}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={handleBookMeasure}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.hero.bookMeasure}</span>
                </button>
              </div>

              {/* Guarantees Badges */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-600">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>100% sifat kafolati</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Tezkor tikish (3-7 kun)</span>
                </div>
                <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" />
                  <span>Toshkentda bepul o‘lchov</span>
                </div>
              </div>
            </div>

            {/* Right Media Hero Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src={homeMedia.heroImage}
                    alt="LA PARDA pardalar to'plami"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md text-white text-xs border border-white/10">
                    <p className="font-serif font-bold text-sm text-amber-300 mb-1">
                      {locale === 'uz' ? 'Premium parda kolleksiyasi' : 'Премиальная коллекция штор'}
                    </p>
                    <p className="text-stone-300">
                      {locale === 'uz' ? 'Eksklyuziv matolar va aniq o‘lcham' : 'Эксклюзивные ткани и идеальный пошив'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VIDEO BLOCK (Dedicated HTML5 Video Presentation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center space-x-2 text-amber-400 text-xs uppercase tracking-widest font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>{locale === 'uz' ? 'VIDEO LAVHA' : 'ВИДЕО ОБЗОР'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
                {locale === 'uz'
                  ? 'Pardalarni o‘lchash, tikish va o‘rnatish jarayoni'
                  : 'Процесс замера, пошива и монтажа штор'}
              </h2>
              <p className="text-stone-400 text-sm leading-relaxed">
                {locale === 'uz'
                  ? 'Har bir buyurtma ustalarimiz tomonidan nozik did bilan amalga oshiriladi. Haqiqiy loyihalarimizdan olingan jarayon videosini tomosha qiling.'
                  : 'Каждый заказ выполняется нашими мастерами с особым вниманием к деталям. Посмотрите видео процесса работы над нашими проектами.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={handleBookMeasure}
                  className="px-6 py-3 rounded-full bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold transition"
                >
                  {t.hero.bookMeasure}
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <CurtainVideoPlayer
                src={homeMedia.heroVideo}
                poster={homeMedia.videoPoster}
                title={locale === 'uz' ? 'Parda tikish va o‘rnatish ustaxonasi' : 'Мастерская по пошиву и установке штор'}
                className="aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
            {t.services.subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            {t.services.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Tikish */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scissors className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {t.services.sewingTitle}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t.services.sewingDesc}
              </p>
            </div>
            <Link
              href="/xizmatlar/tikish"
              className="mt-6 inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-900 hover:text-amber-700 transition"
            >
              <span>{t.services.detailsBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Yuvish */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Waves className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {t.services.washingTitle}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t.services.washingDesc}
              </p>
            </div>
            <Link
              href="/xizmatlar/yuvish"
              className="mt-6 inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-900 hover:text-amber-700 transition"
            >
              <span>{t.services.detailsBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: O'rnatish */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {t.services.installTitle}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t.services.installDesc}
              </p>
            </div>
            <Link
              href="/xizmatlar/ornatish"
              className="mt-6 inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-900 hover:text-amber-700 transition"
            >
              <span>{t.services.detailsBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Matolar */}
          <div className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {t.services.fabricsTitle}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t.services.fabricsDesc}
              </p>
            </div>
            <Link
              href="/matolar"
              className="mt-6 inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-900 hover:text-amber-700 transition"
            >
              <span>{t.services.detailsBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED WORKS (REAL COMPLETED PROJECTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
              {t.featured.subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
              {t.featured.title}
            </h2>
          </div>
          <Link
            href="/loyihalar"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-amber-900 hover:text-amber-700 transition group"
          >
            <span>{t.featured.allProjects}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map(item => (
            <ProjectCard
              key={item.id}
              project={item}
              onOrderSimilar={handleOrderForProject}
            />
          ))}
        </div>
      </section>

      {/* 5. ORDER PROCESS STEPS */}
      <section className="bg-[#F5EFEB] py-16 border-y border-[#EBE3DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
              {t.steps.subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              {t.steps.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-stone-200/60 relative">
              <span className="text-4xl font-serif font-bold text-amber-900/20 absolute top-5 right-6">01</span>
              <h4 className="text-lg font-serif font-bold text-stone-900 mb-2">{t.steps.step1Title}</h4>
              <p className="text-stone-600 text-sm leading-relaxed">{t.steps.step1Desc}</p>
            </div>

            <div className="bg-white p-7 rounded-3xl shadow-sm border border-stone-200/60 relative">
              <span className="text-4xl font-serif font-bold text-amber-900/20 absolute top-5 right-6">02</span>
              <h4 className="text-lg font-serif font-bold text-stone-900 mb-2">{t.steps.step2Title}</h4>
              <p className="text-stone-600 text-sm leading-relaxed">{t.steps.step2Desc}</p>
            </div>

            <div className="bg-white p-7 rounded-3xl shadow-sm border border-stone-200/60 relative">
              <span className="text-4xl font-serif font-bold text-amber-900/20 absolute top-5 right-6">03</span>
              <h4 className="text-lg font-serif font-bold text-stone-900 mb-2">{t.steps.step3Title}</h4>
              <p className="text-stone-600 text-sm leading-relaxed">{t.steps.step3Desc}</p>
            </div>

            <div className="bg-white p-7 rounded-3xl shadow-sm border border-stone-200/60 relative">
              <span className="text-4xl font-serif font-bold text-amber-900/20 absolute top-5 right-6">04</span>
              <h4 className="text-lg font-serif font-bold text-stone-900 mb-2">{t.steps.step4Title}</h4>
              <p className="text-stone-600 text-sm leading-relaxed">{t.steps.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FREE MEASUREMENT CALL-TO-ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white p-8 sm:p-14 shadow-2xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Toshkent shahri va viloyati bo‘yicha</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              {t.banner.title}
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {t.banner.desc}
            </p>
            <div className="pt-4">
              <button
                onClick={handleBookMeasure}
                className="px-8 py-4 rounded-full bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold shadow-xl transition transform hover:scale-105"
              >
                {t.banner.cta}
              </button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 hidden lg:block overflow-hidden">
            <Image
              src="/media/projects/laparda1.jpg"
              alt="Curtain backdrop"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialService={selectedService}
        initialProjectId={selectedProject?.id}
        initialProjectTitle={selectedProject ? (locale === 'uz' ? selectedProject.titleUz : selectedProject.titleRu) : undefined}
      />
    </div>
  );
}
