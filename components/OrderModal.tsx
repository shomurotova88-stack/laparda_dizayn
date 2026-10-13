'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Phone, Calendar, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { TASHKENT_DISTRICTS } from '@/lib/i18n';
import Link from 'next/link';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialProjectId?: string;
  initialProjectTitle?: string;
}

export default function OrderModal({
  isOpen,
  onClose,
  initialService = 'tikish',
  initialProjectId,
  initialProjectTitle
}: OrderModalProps) {
  const { t, locale } = useLanguage();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [serviceType, setServiceType] = useState(initialService);
  const [district, setDistrict] = useState(TASHKENT_DISTRICTS[1]); // Chilonzor default
  const [address, setAddress] = useState('');
  const [roomCount, setRoomCount] = useState(1);
  const [windowCount, setWindowCount] = useState(1);
  const [dimensions, setDimensions] = useState('');
  const [colorPreference, setColorPreference] = useState('');
  const [fabricPreference, setFabricPreference] = useState('');
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

  // Restore draft or populate with user info
  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setPhone(user.phone);
    } else {
      // Check localStorage draft
      const draft = localStorage.getItem('laparda_order_draft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.customerName) setCustomerName(parsed.customerName);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.district) setDistrict(parsed.district);
          if (parsed.address) setAddress(parsed.address);
          if (parsed.dimensions) setDimensions(parsed.dimensions);
          if (parsed.colorPreference) setColorPreference(parsed.colorPreference);
        } catch {}
      }
    }
  }, [user]);

  useEffect(() => {
    if (initialService) setServiceType(initialService);
  }, [initialService]);

  // Save changes to draft
  const saveDraft = (updatedFields: any) => {
    const currentDraft = {
      customerName,
      phone,
      serviceType,
      district,
      address,
      dimensions,
      colorPreference,
      ...updatedFields
    };
    localStorage.setItem('laparda_order_draft', JSON.stringify(currentDraft));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+998\d{9}$/.test(cleanPhone)) {
      setError(locale === 'uz' ? 'Telefon raqamni +998 90 123 45 67 ko‘rinishida to‘liq kiriting' : 'Введите номер телефона в формате +998 90 123 45 67');
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
        projectId: initialProjectId,
        projectTitle: initialProjectTitle,
        district,
        address,
        roomCount: Number(roomCount),
        windowCount: Number(windowCount),
        dimensions,
        colorPreference,
        fabricPreference,
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

      if (!res.ok) {
        throw new Error(data.error || 'Xatolik yuz berdi');
      }

      setSuccessOrderNumber(data.orderNumber);
      localStorage.removeItem('laparda_order_draft');
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi. Iltimos qayta urinib ko‘ring');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-6 sm:p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-amber-400 text-xs uppercase tracking-widest font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>LA PARDA ATELIER</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            {t.orderModal.title}
          </h2>
          <p className="text-stone-300 text-sm">
            {initialProjectTitle
              ? `${locale === 'uz' ? 'Tanlangan model:' : 'Выбранная модель:'} ${initialProjectTitle}`
              : t.orderModal.subtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {successOrderNumber ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                  {t.orderModal.successTitle}
                </h3>
                <p className="text-stone-600 text-base max-w-md mx-auto">
                  {t.orderModal.successText.replace('{orderNumber}', successOrderNumber)}
                </p>
              </div>

              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 max-w-sm mx-auto text-amber-900 font-mono font-bold text-xl">
                {successOrderNumber}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link
                  href="/kabinet"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-900 hover:bg-black text-white text-sm font-medium transition shadow-md"
                >
                  {t.orderModal.viewCabinet}
                </Link>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-medium transition"
                >
                  {t.orderModal.close}
                </button>
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

              {/* Service Selection */}
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
                      onClick={() => {
                        setServiceType(srv.id);
                        saveDraft({ serviceType: srv.id });
                      }}
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

              {/* Client Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.orderModal.nameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => {
                      setCustomerName(e.target.value);
                      saveDraft({ customerName: e.target.value });
                    }}
                    placeholder={t.orderModal.namePlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 text-stone-900 text-sm outline-none transition"
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
                    onChange={e => {
                      setPhone(e.target.value);
                      saveDraft({ phone: e.target.value });
                    }}
                    placeholder={t.orderModal.phonePlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 text-stone-900 text-sm outline-none transition font-mono"
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
                    onChange={e => {
                      setDistrict(e.target.value);
                      saveDraft({ district: e.target.value });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 text-stone-900 text-sm outline-none bg-white transition"
                  >
                    {TASHKENT_DISTRICTS.map(dist => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
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
                    onChange={e => {
                      setAddress(e.target.value);
                      saveDraft({ address: e.target.value });
                    }}
                    placeholder={t.orderModal.addressPlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 text-stone-900 text-sm outline-none transition"
                  />
                </div>
              </div>

              {/* Conditional fields based on service */}
              {serviceType === 'yuvish' ? (
                /* Washing fields */
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
                        {t.orderModal.washingQtyLabel}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
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
                            washingNeedDismantle ? 'bg-amber-800 text-white border-amber-800' : 'bg-white text-stone-700'
                          }`}
                        >
                          {t.orderModal.yes}
                        </button>
                        <button
                          type="button"
                          onClick={() => setWashingNeedDismantle(false)}
                          className={`flex-1 py-2 rounded-xl text-xs font-medium border ${
                            !washingNeedDismantle ? 'bg-amber-800 text-white border-amber-800' : 'bg-white text-stone-700'
                          }`}
                        >
                          {t.orderModal.no}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Sewing & Installation fields */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        {t.orderModal.roomsLabel}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
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
                        max={30}
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
                        onChange={e => {
                          setDimensions(e.target.value);
                          saveDraft({ dimensions: e.target.value });
                        }}
                        placeholder={t.orderModal.dimensionsPlaceholder}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        {t.orderModal.colorFabricLabel}
                      </label>
                      <input
                        type="text"
                        value={colorPreference}
                        onChange={e => {
                          setColorPreference(e.target.value);
                          saveDraft({ colorPreference: e.target.value });
                        }}
                        placeholder={t.orderModal.colorFabricPlaceholder}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        {t.orderModal.budgetLabel}
                      </label>
                      <input
                        type="text"
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        placeholder={t.orderModal.budgetPlaceholder}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Measurement Preferred Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.orderModal.dateLabel}
                  </label>
                  <input
                    type="date"
                    value={measurementDate}
                    onChange={e => setMeasurementDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.orderModal.timeLabel}
                  </label>
                  <select
                    value={measurementTime}
                    onChange={e => setMeasurementTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm outline-none bg-white"
                  >
                    <option value="10:00 - 12:00">10:00 - 12:00</option>
                    <option value="12:00 - 14:00">12:00 - 14:00</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                    <option value="18:00 - 20:00">18:00 - 20:00</option>
                  </select>
                </div>
              </div>

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

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-medium text-base shadow-xl hover:shadow-2xl transition duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{loading ? t.orderModal.submitting : t.orderModal.submitBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
