'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, LogOut, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { formatTashkentTime } from '@/lib/date';

export default function CabinetPage() {
  const { t, locale } = useLanguage();
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites'>('orders');
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Fetch user orders
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(console.error)
        .finally(() => setLoadingOrders(false));

      // Fetch user favorites
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => {
          if (data.favorites) setFavorites(data.favorites);
        })
        .catch(console.error);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-800 border-t-transparent animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'YANGI':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">Yangi</span>;
      case 'QABUL_QILINDI':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900">Qabul qilindi</span>;
      case 'BOGLANILDI':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900">Bog‘lanildi</span>;
      case 'OLCHOV_BELGILANDI':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900">O‘lchov belgilandi</span>;
      case 'JARAYONDA':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-900">Jarayonda (Tikilmoqda)</span>;
      case 'TAYYOR':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900">Tayyor / O‘rnatildi</span>;
      case 'BEKOR_QILINDI':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900">Bekor qilindi</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-full bg-amber-800/10 text-amber-900 flex items-center justify-center font-serif font-bold text-2xl shadow-inner">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-serif font-bold text-stone-900">{user.name}</h1>
              {user.role === 'ADMIN' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-900 text-amber-100">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-stone-500 text-xs font-mono">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-semibold transition"
            >
              Admin Panel
            </Link>
          )}

          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-semibold transition flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.cabinet.logout}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-3 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'orders'
              ? 'bg-amber-800 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.cabinet.myOrders} ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'favorites'
              ? 'bg-amber-800 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{t.cabinet.favorites} ({favorites.length})</span>
        </button>
      </div>

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="text-center py-12 text-stone-400 text-sm">Yuklanmoqda...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 space-y-4">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-stone-600 text-base">{t.cabinet.noOrders}</p>
              <Link
                href="/aloqa"
                className="inline-block px-6 py-2.5 rounded-full bg-amber-800 text-white text-xs font-semibold"
              >
                Buyurtma berish
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-amber-900 text-base">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="text-stone-400 text-xs">
                      {formatTashkentTime(order.createdAt)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-600">
                    <div>
                      <span className="font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Xizmat</span>
                      <p className="text-stone-900 font-medium">{order.serviceType}</p>
                    </div>

                    {order.projectTitle && (
                      <div>
                        <span className="font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Loyiha</span>
                        <p className="text-stone-900 font-medium">{order.projectTitle}</p>
                      </div>
                    )}

                    {(order.district || order.address) && (
                      <div>
                        <span className="font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">Manzil</span>
                        <p className="text-stone-900 font-medium">{order.district} {order.address}</p>
                      </div>
                    )}

                    {order.measurementDate && (
                      <div>
                        <span className="font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">O‘lchov vaqti</span>
                        <p className="text-stone-900 font-medium">{order.measurementDate} ({order.measurementTime})</p>
                      </div>
                    )}
                  </div>

                  {order.comment && (
                    <div className="pt-2 text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <span className="font-semibold text-stone-600">Izoh: </span>
                      {order.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favorites Tab Content */}
      {activeTab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 space-y-4">
              <Heart className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-stone-600 text-base">{t.cabinet.noFavorites}</p>
              <Link
                href="/loyihalar"
                className="inline-block px-6 py-2.5 rounded-full bg-amber-800 text-white text-xs font-semibold"
              >
                Loyihalarni ko‘rish
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(fav => (
                <div key={fav.id} className="bg-white rounded-3xl p-4 border border-stone-200">
                  <p className="font-serif font-bold text-stone-900">{fav.titleUz}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
