'use client';

import React, { useState } from 'react';
import { Sparkles, Filter, Video as VideoIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ProjectCard from '@/components/ProjectCard';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import CurtainVideoPlayer from '@/components/CurtainVideoPlayer';
import OrderModal from '@/components/OrderModal';
import mediaManifest from '@/lib/media-manifest.json';

export default function ProjectsPage() {
  const { t, locale } = useLanguage();
  const [roomFilter, setRoomFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const allProjects = mediaManifest.pages.projects.items;

  const filteredProjects = allProjects.filter(p => {
    const matchesRoom = roomFilter === 'all' || p.room === roomFilter;
    const matchesStyle = styleFilter === 'all' || p.style === styleFilter;
    return matchesRoom && matchesStyle;
  });

  const handleOrderSimilar = (project: any) => {
    setSelectedProject(project);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-800/10 text-amber-900 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>PORTFOLIO & SHOWCASE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
          {t.projectsPage.title}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {t.projectsPage.subtitle}
        </p>
      </div>

      {/* Featured Before / After Slider Showcase */}
      <div className="bg-[#F5EFEB] rounded-3xl p-6 sm:p-10 border border-[#EBE3DA] shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
              {t.projectsPage.beforeAfterLabel}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {locale === 'uz'
                ? 'O‘zgarish natijasini o‘zingiz ko‘ring'
                : 'Оцените преображение интерьера'}
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              {locale === 'uz'
                ? 'To‘g‘ri tanlangan parda va karniz xonaga qanday shinamlik va hashamat olib kirishini taqqoslang. Chiziqni surib ko‘ring.'
                : 'Посмотрите, как правильно подобранные шторы и скрытые карнизы меняют атмосферу комнаты. Потяните ползунок.'}
            </p>
            <button
              onClick={() => {
                setSelectedProject({
                  id: 'proj-before-after',
                  titleUz: 'Mehmonxona uchun neoklassik parda',
                  titleRu: 'Неоклассические шторы для гостиной'
                });
                setIsOrderModalOpen(true);
              }}
              className="px-6 py-3 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-md transition"
            >
              {t.projectsPage.orderSimilar}
            </button>
          </div>

          <div className="lg:col-span-7">
            <BeforeAfterSlider
              beforeImage="/media/projects/laparda8.jpg"
              afterImage="/media/projects/laparda2.jpg"
              beforeLabel={locale === 'uz' ? 'Pardasiz ochiq deraza' : 'До установки'}
              afterLabel={locale === 'uz' ? 'LA PARDA bilan' : 'После LA PARDA'}
            />
          </div>
        </div>
      </div>

      {/* Dedicated Video Showcase Block for Projects */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <VideoIcon className="w-4 h-4" />
              <span>{locale === 'uz' ? 'Haqiqiy loyihalar videosi' : 'Видео реальных проектов'}</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">
              {locale === 'uz' ? 'Pardalarning to‘kilishi va harakati' : 'Пластика и драпировка тканей'}
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              {locale === 'uz'
                ? 'Videoda matolarning yorug‘likdagi jilosi va motorlashtirilgan karnizlarning silliq harakatlanishini to‘liq his qilasiz.'
                : 'На видео вы можете оценить пластику портьер, игру света и плавную работу моторизованных карнизов.'}
            </p>
          </div>
          <div className="lg:col-span-7">
            <CurtainVideoPlayer
              src="/media/videos/laparda6.MOV"
              poster="/media/projects/laparda2.jpg"
              title={locale === 'uz' ? 'Toshkentdagi yangi xonadon loyihasi' : 'Проект резиденции в Ташкенте'}
              className="aspect-video"
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
        {/* Room Filter */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mr-2">
            {locale === 'uz' ? 'Xona:' : 'Комната:'}
          </span>
          {[
            { id: 'all', label: t.projectsPage.filterAll },
            { id: 'mehmonxona', label: t.projectsPage.filterLiving },
            { id: 'yotoqxona', label: t.projectsPage.filterBedroom },
            { id: 'oshxona', label: t.projectsPage.filterKitchen },
            { id: 'ofis', label: t.projectsPage.filterOffice }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setRoomFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                roomFilter === f.id
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Style Filter */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mr-2">
            {locale === 'uz' ? 'Uslub:' : 'Стиль:'}
          </span>
          {[
            { id: 'all', label: t.projectsPage.filterAll },
            { id: 'neoklassika', label: t.projectsPage.styleNeoclassic },
            { id: 'modern', label: t.projectsPage.styleModern },
            { id: 'minimalizm', label: t.projectsPage.styleMinimal }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setStyleFilter(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                styleFilter === s.id
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
          <p className="text-stone-500 text-base">{t.projectsPage.emptyText}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onOrderSimilar={handleOrderSimilar}
            />
          ))}
        </div>
      )}

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialService="tikish"
        initialProjectId={selectedProject?.id}
        initialProjectTitle={selectedProject ? (locale === 'uz' ? selectedProject.titleUz : selectedProject.titleRu) : undefined}
      />
    </div>
  );
}
