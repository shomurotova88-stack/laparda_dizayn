'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TASHKENT_DISTRICTS } from '@/lib/i18n';
import { useAuth } from '@/context/AuthContext';
import CurtainVideoPlayer from '@/components/CurtainVideoPlayer';
import mediaManifest from '@/lib/media-manifest.json';
import Link from 'next/link';

export default function ContactPage() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+998 ');
  const [serviceType, setServiceType] = useState('tikish');
  const [district, setDistrict] = useState(TASHKENT_DISTRICTS[1]);
  const [address, setAddress] = useState('');
  const [roomCount, setRoomCount] = useState(1);
  const [windowCount, setWindowCount] = useState(1);
  const [dimensions, setDimensions] = useState('');
  const [colorPreference, setColorPreference] = useState('');
  const [budget, setBudget] = useState('');
  const [measurementDate, setMeasurementDate] = useState('');
  const [measurementTime, setMeasurementTime] = useState('14:00 - 16:00');
  const [comment, setComment] = useState('');

  // Washing specific fields
  const [washingQty, setWashingQty] = useState(2);
  const [washingNeedDismantle, setWashingNeedDismantle] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+998\d{9}$/.test(cleanPhone)) {
      setError(locale === 'uz' ? 'Telefon raqamni +998 90 123 45 67 formatida kiriting' : 'Введите телефон в формате +998 90 123 45 67');
      return;
    }

    if (!customerName.trim()) {
      setError(locale === 'uz' ? 'Ismingizni kiriting' : 'Введите ваше имя');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerName,
        phone: cleanPhone,
        serviceType,
        district,
        address,
        roomCount: Number(roomCount),
        windowCount: Number(windowCount),
        dimensions,
        colorPreference,
        budget,
        measurementDate,
        measurementTime,
        comment,
        isWashingService: serviceType === 'yuvish',
        washingCurtainQty: serviceType === 'yuvish' ? Number(washingQty) : null,
        washingNeedDismantle: serviceType === 'yuvish' ? washingNeedDismantle : false
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi');

      setSuccessOrderNumber(data.orderNumber);
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-800/10 text-amber-900 text-xs font-semibold uppercase tracking-wider">
          <Phone className="w-3.5 h-3.5 text-amber-700" />
          <span>BOG‘LANISH VA BUYURTMA</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900">
          {locale === 'uz' ? 'Aloqa va buyurtma berish' : 'Контакты и заказ'}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          {locale === 'uz'
            ? 'Biz bilan bog‘laning yoki to‘g‘ridan-to‘g‘ri sayt orqali o‘lchovga buyurtma qoldiring.'
            : 'Свяжитесь с нами или оформите заявку на бесплатный замер онлайн.'}
        </p>
      </div>

      {/* Main 2-Column: Contacts + Interactive Order Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              {t.footer.contacts}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-stone-700">
                <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase font-semibold text-stone-400">Manzil</p>
                  <p className="text-sm font-medium">{t.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-stone-700">
                <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase font-semibold text-stone-400">Ish vaqti</p>
                  <p className="text-sm font-medium">{t.workingHours}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-stone-700">
                <Phone className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase font-semibold text-stone-400">Telefon</p>
                  <a href={`tel:${t.phoneRaw}`} className="text-lg font-bold font-mono text-amber-900 hover:text-amber-700">
                    {t.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center space-x-3">
              <a
                href="https://t.me/laparda_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-center space-x-2 transition border border-sky-200"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>
              <a
                href="https://instagram.com/laparda_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold flex items-center justify-center space-x-2 transition border border-rose-200"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Showroom HTML5 Video Block */}
          <div className="bg-stone-900 rounded-3xl p-6 text-white shadow-lg space-y-4">
            <h3 className="font-serif font-bold text-lg text-amber-300">
              {locale === 'uz' ? 'Showroom va maslahat' : 'Шоурум и консультации'}
            </h3>
            <CurtainVideoPlayer
              src="/media/videos/video2.MOV"
              poster="/media/projects/laparda5.jpg"
              title={locale === 'uz' ? 'Showroom namunalari' : 'Образцы шоурума'}
              className="aspect-video"
            />
          </div>
        </div>

        {/* Right Column: Full Order Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
                {t.orderModal.title}
              </h2>
              <p className="text-stone-600 text-sm">
                {t.orderModal.subtitle}
              </p>
            </div>

            {successOrderNumber ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900">
                  {t.orderModal.successTitle}
                </h3>
                <p className="text-stone-600 text-sm max-w-md mx-auto">
                  {t.orderModal.successText.replace('{orderNumber}', successOrderNumber)}
                </p>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-mono font-bold text-xl inline-block">
                  {successOrderNumber}
                </div>
                <div className="pt-4">
                  <Link
                    href="/kabinet"
                    className="inline-block px-8 py-3.5 rounded-full bg-stone-900 hover:bg-black text-white text-sm font-medium transition"
                  >
                    {t.orderModal.viewCabinet}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Service Types */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                    {t.orderModal.serviceLabel}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'tikish', labelUz: 'Parda tikish', labelRu: 'Пошив штор' },
                      { id: 'yuvish', labelUz: 'Parda yuvish', labelRu: 'Стирка штор' },
                      { id: 'ornatish', labelUz: 'O‘rnatish', labelRu: 'Монтаж' },
                      { id: 'matolar', labelUz: 'Mato tanlash', labelRu: 'Ткани' }
                    ].map(srv => (
                      <button
                        type="button"
                        key={srv.id}
                        onClick={() => setServiceType(srv.id)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                          serviceType === srv.id
                            ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {locale === 'uz' ? srv.labelUz : srv.labelRu}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      {t.orderModal.nameLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder={t.orderModal.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none focus:border-amber-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      {t.orderModal.phoneLabel} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder={t.orderModal.phonePlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none font-mono focus:border-amber-700"
                    />
                  </div>
                </div>

                {/* District and Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      {t.orderModal.districtLabel}
                    </label>
                    <select
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none bg-white focus:border-amber-700"
                    >
                      {TASHKENT_DISTRICTS.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      {t.orderModal.addressLabel}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder={t.orderModal.addressPlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none focus:border-amber-700"
                    />
                  </div>
                </div>

                {/* Conditional Fields */}
                {serviceType === 'yuvish' ? (
                  <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
                        {t.orderModal.washingQtyLabel}
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={washingQty}
                        onChange={e => setWashingQty(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
                        {t.orderModal.washingDismantleLabel}
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setWashingNeedDismantle(true)}
                          className={`flex-1 py-2 rounded-xl text-xs font-medium border ${
                            washingNeedDismantle ? 'bg-amber-800 text-white' : 'bg-white text-stone-700'
                          }`}
                        >
                          {t.orderModal.yes}
                        </button>
                        <button
                          type="button"
                          onClick={() => setWashingNeedDismantle(false)}
                          className={`flex-1 py-2 rounded-xl text-xs font-medium border ${
                            !washingNeedDismantle ? 'bg-amber-800 text-white' : 'bg-white text-stone-700'
                          }`}
                        >
                          {t.orderModal.no}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        {t.orderModal.roomsLabel}
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={roomCount}
                        onChange={e => setRoomCount(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        {t.orderModal.windowsLabel}
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={windowCount}
                        onChange={e => setWindowCount(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        {t.orderModal.dimensionsLabel}
                      </label>
                      <input
                        type="text"
                        value={dimensions}
                        onChange={e => setDimensions(e.target.value)}
                        placeholder={t.orderModal.dimensionsPlaceholder}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.orderModal.commentLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder={t.orderModal.commentPlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-base shadow-xl transition flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{loading ? t.orderModal.submitting : t.orderModal.submitBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
