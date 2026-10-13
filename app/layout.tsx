import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileStickyBar from '@/components/MobileStickyBar';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'LA PARDA — Toshkentda buyurtma asosida parda tikish va yuvish xizmatlari',
  description: 'LA PARDA — Toshkent bo‘yicha sifatli parda tikish, bepul o‘lchov, karniz o‘rnatish, parda yuvish, tozalash va dazmollash xizmatlari. Sifatli matolar va individual dizayn.',
  keywords: 'parda tikish Toshkent, parda yuvish, parda tozalash, karniz o‘rnatish, blackout pardalar, tuly, portyera, parda narxlari, пошив штор Ташкент, стирка штор',
  openGraph: {
    title: 'LA PARDA — Toshkentda parda tikish va yuvish xizmatlari',
    description: 'Eksklyuziv parda dizayni, bepul o‘lchov va professional parvarish.',
    url: 'https://laparda.uz',
    siteName: 'LA PARDA',
    images: [
      {
        url: '/media/home/hero-curtains.jpg',
        width: 1200,
        height: 630,
        alt: 'LA PARDA — Pardalar katalogi va xizmatlari'
      }
    ],
    locale: 'uz_UZ',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-stone-900 antialiased selection:bg-amber-200 selection:text-amber-900">
        <AuthProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1 pb-16 sm:pb-0">{children}</main>
            <Footer />
            <MobileStickyBar />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
