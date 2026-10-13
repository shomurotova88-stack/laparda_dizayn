'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { locale } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 text-stone-800">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-800/10 text-amber-900 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-amber-700" />
          <span>MAXFIYLIK SIYOSATI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          {locale === 'uz' ? 'Foydalanuvchi ma’lumotlari maxfiyligi' : 'Политика конфиденциальности'}
        </h1>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-stone-700">
        <p>
          {locale === 'uz'
            ? 'LA PARDA mijozlarining shaxsiy ma’lumotlari xavfsizligini ta’minlashga qat’iy e’tibor qaratadi. Ushbu siyosat siz saytimizdan foydalanganda va buyurtma berganingizda qanday ma’lumotlar to‘planishi va ulardan qanday foydalanilishini tushuntiradi.'
            : 'Ателье LA PARDA уважает конфиденциальность своих клиентов и гарантирует сохранность персональных данных. Данный документ разъясняет порядок сбора и обработки данных.'}
        </p>

        <h2 className="text-xl font-serif font-bold text-stone-900 pt-2">
          {locale === 'uz' ? '1. To‘planadigan ma’lumotlar' : '1. Сбор информации'}
        </h2>
        <p>
          {locale === 'uz'
            ? 'Buyurtma berish yoki ro‘yxatdan o‘tish jarayonida mijozning ismi, telefon raqami, yetkazib berish va o‘lchov manzili, derazalar soni va buyurtma tafsilotlari to‘planadi.'
            : 'При оформлении заказа мы собираем контактное имя, номер телефона, адрес для замера и доставки, а также параметры окон и пожелания к заказу.'}
        </p>

        <h2 className="text-xl font-serif font-bold text-stone-900 pt-2">
          {locale === 'uz' ? '2. Ma’lumotlardan foydalanish maqsadi' : '2. Использование данных'}
        </h2>
        <p>
          {locale === 'uz'
            ? 'Ma’lumotlar faqat o‘lchov vaqtini kelishish, buyurtmani tikish, parda yuvish xizmatini bajarish hamda Telegram xabarnomasi orqali buyurtma holatini ma’lum qilish uchun ishlatiladi. Uchinchi shaxslarga berilmaydi.'
            : 'Данные используются исключительно для согласования замера, пошива, стирки и информирования о статусе заказа. Данные не передаются третьим лицам.'}
        </p>

        <h2 className="text-xl font-serif font-bold text-stone-900 pt-2">
          {locale === 'uz' ? '3. Xavfsizlik' : '3. Безопасность'}
        </h2>
        <p>
          {locale === 'uz'
            ? 'Barcha parollar shifrlangan holda saqlanadi va sessiyalar xavfsiz xesh protokollari bilan himoyalangan.'
            : 'Все пароли хэшируются, а сессии защищены современными стандартами шифрования.'}
        </p>
      </div>
    </div>
  );
}
