'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import CurtainVideoPlayer from '@/components/CurtainVideoPlayer';
import OrderModal from '@/components/OrderModal';
import mediaManifest from '@/lib/media-manifest.json';

export default function FAQPage() {
  const { t, locale } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      qUz: 'O‘lchov qanday olinadi va u haqiqatan ham bepulmi?',
      qRu: 'Как происходит замер и действительно ли он бесплатный?',
      aUz: 'Ha, Toshkent shahri bo‘ylab dizaynerimizning o‘lchovga kelishi mutlaqo bepul. Mutaxassis lazerli o‘lchagichlar bilan keladi, deraza va karniz joyini aniq o‘lchaydi hamda o‘zi bilan 500 dan ortiq mato namunalarini olib keladi.',
      aRu: 'Да, выезд нашего дизайнера на замер по всему Ташкенту абсолютно бесплатный. Специалист приедет с образцами тканей и произведет точные замеры лазерным оборудованием.'
    },
    {
      qUz: 'Parda narxlari qanday hisoblanadi?',
      qRu: 'Как рассчитывается стоимость штор?',
      aUz: 'Narx deraza o‘lchami, tanlangan mato turi va parda uslubiga qarab individual hisoblanadi. Matolar har xil narx kategoriyasiga ega bo‘lgani uchun sizning budjetingizga mos optimal variantni tanlab beramiz.',
      aRu: 'Стоимость рассчитывается индивидуально в зависимости от размеров окна, метража и выбранной ткани. Мы поможем подобрать идеальный вариант под ваш бюджет.'
    },
    {
      qUz: 'Buyurtma necha kunda tayyor bo‘ladi?',
      qRu: 'Сколько дней занимает пошив заказа?',
      aUz: 'Mato va dizayn tasdiqlangandan so‘ng parda tikish o‘rtacha 3 kundan 7 ish kunigacha vaqt oladi. Tayyor bo‘lgach, sizga qulay vaqtda keltirib o‘rnatib beriladi.',
      aRu: 'В среднем индивидуальный пошив занимает от 3 до 7 рабочих дней с момента утверждения ткани и модели. После чего согласуется удобное время доставки и навески.'
    },
    {
      qUz: 'Parda yuvish xizmati qanday ishlaydi, yechib olish va ilib berish bormi?',
      qRu: 'Как работает услуга стирки штор, есть ли снятие и повторная навеска?',
      aUz: 'Albatta! Ustalarimiz o‘zlari xonadoningizga kelib pardalarni ehtiyotkorlik bilan yechib oladi, maxsus vositalarda yuvadi, vertikal bug‘lab dazmollaydi va yana o‘z o‘rniga mukammal taxlamlar bilan ilib beradi.',
      aRu: 'Да, услуга предоставляется «под ключ»! Мастера бережно снимут шторы, постирают на специальном оборудовании, профессионально отпарят и навесят обратно на карниз.'
    },
    {
      qUz: 'Motorlashtirilgan aqlli karnizlar qanday boshqariladi?',
      qRu: 'Как работают моторизованные умные карнизы?',
      aUz: 'Motorli karnizlar pult, devorga o‘rnatilgan tugma yoki smartfon ilovasi orqali boshqariladi. Shuningdek, ularni "Aqlli uy" (Alice, Google Home) tizimlariga ulash imkoniyati mavjud.',
      aRu: 'Моторизованные карнизы управляются с пульта ДУ, смартфона или настенного выключателя. Также возможна интеграция в системы умного дома (Алиса, Google Home).'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-800/10 text-amber-900 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
          <span>JAVOBLAR VA MASLAHATLAR</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
          {locale === 'uz' ? 'Ko‘p beriladigan savollar' : 'Часто задаваемые вопросы'}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {locale === 'uz'
            ? 'Parda tikish, yuvish, mato tanlash va o‘lchov bo‘yicha eng muhim ma’lumotlar.'
            : 'Всё, что важно знать о замере, тканях, сроках пошива и чистке штор.'}
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 hover:bg-stone-50 transition"
              >
                <span className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                  {locale === 'uz' ? item.qUz : item.qRu}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-amber-800 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-stone-600 text-sm sm:text-base leading-relaxed border-t border-stone-100 bg-amber-50/20">
                  {locale === 'uz' ? item.aUz : item.aRu}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Video Block for FAQ */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              {locale === 'uz' ? 'MUTAXASSIS MASLAHATI' : 'СОВЕТЫ ЭКСПЕРТА'}
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              {locale === 'uz'
                ? 'Pardalarni to‘g‘ri parvarishlash'
                : 'Правильный уход за шторами'}
            </h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              {locale === 'uz'
                ? 'Pardalaringiz uzoq yillar o‘zining dastlabki jiladorligini saqlab qolishi uchun qanday qoidalarga amal qilish kerakligini videoda ko‘ring.'
                : 'Советы по сохранению первозданной красоты и драпировок штор на долгие годы.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 rounded-full bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold transition"
              >
                {t.hero.bookMeasure}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <CurtainVideoPlayer
              src="/media/videos/laparda10.MOV"
              poster="/media/projects/laparda3.jpg"
              title={locale === 'uz' ? 'Parda parvarishi va o‘rnatish sirlari' : 'Секреты ухода и навески штор'}
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
