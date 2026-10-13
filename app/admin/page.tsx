'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Package, Send, RotateCw, Search, Filter, Phone, MapPin, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatTashkentTime } from '@/lib/date';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/auth/login');
      } else {
        fetchOrders();
      }
    }
  }, [user, loading, router]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setActionSuccess(`Buyurtma holati "${newStatus}" ga o‘zgartirildi`);
        setTimeout(() => setActionSuccess(null), 3000);
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetryTelegram = async (orderId: string) => {
    setRetryingId(orderId);
    try {
      const res = await fetch('/api/telegram/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('Telegramga muvaffaqiyatli yetkazildi!');
      } else {
        alert('Xatolik: ' + (data.error || 'Yuborilmadi'));
      }
      fetchOrders();
    } catch (err: any) {
      alert('Tarmoq xatosi: ' + err.message);
    } finally {
      setRetryingId(null);
    }
  };

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-800 border-t-transparent animate-spin" />
      </div>
    );
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const newOrders = orders.filter(o => o.status === 'YANGI').length;
  const completedOrders = orders.filter(o => o.status === 'TAYYOR').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-800 flex items-center justify-center text-amber-300">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold">LA PARDA — Administrator Paneli</h1>
            <p className="text-stone-400 text-xs">Buyurtmalar, mijozlar va Telegram integratsiyasi nazorati</p>
          </div>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center space-x-1.5 transition"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Yangilash</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <p className="text-xs uppercase font-bold text-stone-400">Jami buyurtmalar</p>
          <p className="text-3xl font-serif font-bold text-stone-900">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-amber-200 bg-amber-50/20 shadow-sm space-y-1">
          <p className="text-xs uppercase font-bold text-amber-800">Yangi buyurtmalar</p>
          <p className="text-3xl font-serif font-bold text-amber-900">{newOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <p className="text-xs uppercase font-bold text-stone-400">Tugallangan</p>
          <p className="text-3xl font-serif font-bold text-emerald-800">{completedOrders}</p>
        </div>
      </div>

      {/* Orders Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Qidiruv: raqam, ism yoki telefon..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs outline-none focus:border-amber-800"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: 'Barchasi' },
            { id: 'YANGI', label: 'Yangi' },
            { id: 'QABUL_QILINDI', label: 'Qabul qilindi' },
            { id: 'JARAYONDA', label: 'Jarayonda' },
            { id: 'TAYYOR', label: 'Tayyor' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === f.id
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loadingOrders ? (
          <div className="text-center py-16 text-stone-400 text-sm">Yuklanmoqda...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-stone-400 text-sm">Hech qanday buyurtma topilmadi</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Raqam / Sana</th>
                  <th className="p-4">Mijoz / Telefon</th>
                  <th className="p-4">Xizmat & Tafsilot</th>
                  <th className="p-4">Manzil</th>
                  <th className="p-4">Holat (O‘zgartirish)</th>
                  <th className="p-4">Telegram Holati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-amber-50/20 transition">
                    
                    {/* Order Code & Date */}
                    <td className="p-4 align-top">
                      <span className="font-mono font-bold text-amber-900 block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {formatTashkentTime(order.createdAt)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-4 align-top">
                      <span className="font-semibold text-stone-900 block">
                        {order.customerName}
                      </span>
                      <a
                        href={`tel:${order.phone}`}
                        className="text-amber-800 hover:underline font-mono text-[11px]"
                      >
                        {order.phone}
                      </a>
                    </td>

                    {/* Service & Details */}
                    <td className="p-4 align-top max-w-xs">
                      <span className="font-medium text-stone-900 block">{order.serviceType}</span>
                      {order.projectTitle && (
                        <span className="text-stone-500 block text-[11px]">Model: {order.projectTitle}</span>
                      )}
                      {order.isWashingService ? (
                        <span className="text-sky-700 block text-[11px]">Yuvish: {order.washingCurtainQty} dona parda</span>
                      ) : (
                        <span className="text-stone-500 block text-[11px]">{order.roomCount} xona / {order.windowCount} deraza</span>
                      )}
                      {order.comment && (
                        <p className="text-stone-500 italic text-[11px] line-clamp-2 mt-1">"{order.comment}"</p>
                      )}
                    </td>

                    {/* Address */}
                    <td className="p-4 align-top">
                      <span className="block text-stone-900">{order.district || 'Toshkent'}</span>
                      <span className="text-stone-500 text-[11px] block">{order.address}</span>
                      {order.measurementDate && (
                        <span className="text-amber-800 text-[10px] block mt-0.5 font-medium">
                          {order.measurementDate} ({order.measurementTime})
                        </span>
                      )}
                    </td>

                    {/* Status Changer */}
                    <td className="p-4 align-top">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.orderNumber, e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white outline-none focus:border-amber-800"
                      >
                        <option value="YANGI">Yangi</option>
                        <option value="QABUL_QILINDI">Qabul qilindi</option>
                        <option value="BOGLANILDI">Bog‘lanildi</option>
                        <option value="OLCHOV_BELGILANDI">O‘lchov belgilandi</option>
                        <option value="JARAYONDA">Jarayonda</option>
                        <option value="TAYYOR">Tayyor</option>
                        <option value="BEKOR_QILINDI">Bekor qilindi</option>
                      </select>
                    </td>

                    {/* Telegram Delivery Status */}
                    <td className="p-4 align-top">
                      <div className="space-y-1">
                        {order.deliveryStatus === 'SENT' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                            <CheckCircle className="w-3 h-3" />
                            <span>Yetkazildi</span>
                          </span>
                        ) : order.deliveryStatus === 'FAILED' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-semibold text-[11px]">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Xatolik</span>
                            </span>
                            <button
                              onClick={() => handleRetryTelegram(order.id)}
                              disabled={retryingId === order.id}
                              className="block text-[11px] text-amber-800 hover:underline font-semibold"
                            >
                              {retryingId === order.id ? 'Qayta yuborilmoqda...' : 'Qayta yuborish'}
                            </button>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                            Kutilmoqda
                          </span>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
