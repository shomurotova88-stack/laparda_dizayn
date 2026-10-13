'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import CurtainVideoPlayer from '@/components/CurtainVideoPlayer';

interface ProjectCardProps {
  project: {
    id: string;
    titleUz: string;
    titleRu: string;
    image: string;
    video?: string | null;
    room: string;
    style: string;
    hasBeforeAfter?: boolean;
    descriptionUz?: string;
    descriptionRu?: string;
  };
  onOrderSimilar: (project: any) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export default function ProjectCard({
  project,
  onOrderSimilar,
  isFavorite = false,
  onToggleFavorite
}: ProjectCardProps) {
  const { locale, t } = useLanguage();
  const { user } = useAuth();
  const [showVideoModal, setShowVideoModal] = useState(false);

  const title = locale === 'uz' ? project.titleUz : project.titleRu;
  const description = locale === 'uz' ? project.descriptionUz : project.descriptionRu;

  return (
    <>
      <div className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
        {/* Media Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          <Image
            src={project.image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-900/80 backdrop-blur-md text-amber-300 border border-amber-300/20">
              {project.room}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-900/80 backdrop-blur-md text-stone-200 border border-white/10">
              {project.style}
            </span>
          </div>

          {/* Favorite button */}
          {user && onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(project.id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-900/70 backdrop-blur-md text-white hover:text-rose-500 transition shadow z-10"
              aria-label="Add to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          )}

          {/* Video Play Button if available */}
          {project.video && (
            <button
              onClick={() => setShowVideoModal(true)}
              className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-amber-700/90 hover:bg-amber-600 text-white text-xs font-medium flex items-center space-x-1.5 shadow-lg backdrop-blur-sm transition-transform transform group-hover:scale-105 z-10"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{locale === 'uz' ? 'Videoni ko‘rish' : 'Смотреть видео'}</span>
            </button>
          )}
        </div>

        {/* Content & Action */}
        <div className="p-6 flex flex-col flex-1 justify-between bg-white">
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2 group-hover:text-amber-900 transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed mb-4">
                {description}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
            <button
              onClick={() => onOrderSimilar(project)}
              className="w-full py-3 px-4 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-medium transition duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.projectsPage.orderSimilar}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal if video button clicked */}
      {showVideoModal && project.video && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-900/80 text-white hover:bg-stone-800 transition"
            >
              ✕
            </button>
            <div className="p-2 sm:p-4">
              <CurtainVideoPlayer
                src={project.video}
                poster={project.image}
                title={title}
                autoPlay={true}
              />
            </div>
            <div className="p-4 bg-stone-900 flex justify-between items-center text-white">
              <span className="font-serif font-bold text-base">{title}</span>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  onOrderSimilar(project);
                }}
                className="px-4 py-2 rounded-full bg-amber-800 hover:bg-amber-700 text-white text-xs font-medium transition flex items-center space-x-1"
              >
                <span>{t.projectsPage.orderSimilar}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
