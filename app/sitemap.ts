import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laparda.uz';
  const now = new Date();

  const routes = [
    '',
    '/loyihalar',
    '/xizmatlar/tikish',
    '/xizmatlar/yuvish',
    '/xizmatlar/ornatish',
    '/matolar',
    '/biz-haqimizda',
    '/faq',
    '/aloqa',
    '/maxfiylik'
  ];

  return routes.map(route => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8
  }));
}
