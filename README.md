# 🌟 LA PARDA — Parda Tikish va Yuvish Xizmatlari Veb-Platformasi

Toshkent shahrida buyurtma asosida parda tikish, parda yuvish, tozalash, bug‘lab dazmollash va professional karniz o‘rnatish xizmatlari uchun to‘liq ishlaydigan zamonaviy platforma.

---

## 🎨 Dizayn va Texnologiyalar

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Til**: TypeScript
- **Styling**: Tailwind CSS v4 (Ivory `#FDFBF7`, Iliq bej, Shampan oltin aksentlari, Tungi tosh)
- **Ma’lumotlar bazasi**: PostgreSQL / Supabase
- **ORM**: Prisma ORM
- **Autentifikatsiya**: Xavfsiz sessiya tokenlari (JWT via `jose`), `bcryptjs` parol xeshlash va rate limiting
- **Telegram Bot**: Server-side Next.js integratsiyasi (BotFather webhook, status inline tugmalari va qayta yuborish)
- **Media**: Mahalliy HTML5 video pleyer, rasmlar uchun `next/image`, yagona `lib/media-manifest.json`
- **Tillar**: Ikki tilli tizim — O‘zbek lotin (asosiy) va Ruscha (til almashtirish tugmasi bilan)

---

## 📄 Sayt Sahifalari (Jami 9 ta asosiy sahifa + Tizim sahifalari)

1. **Bosh sahifa (`/`)**:
   - Parda videosi va interyer bannerlari
   - “Uyingizga mos pardalarni birga tanlaymiz” sarlavhasi
   - **“Qilingan ishlarni ko‘rish”** (loyihalarga yo‘naltiradi) va **“O‘lchovga yozilish”** (buyurtma modalini ochadi) tugmalari
   - 4 ta asosiy xizmat kartasi (Tikish, Yuvish, O‘rnatish, Matolar)
   - Tanlangan real ishlar galereyasi
   - 4 bosqichli buyurtma jarayoni
   - Toshkent bo‘yicha bepul o‘lchov banneri

2. **Qilingan ishlar katalogi (`/loyihalar`)**:
   - Haqiqiy bajarilgan loyihalar (foto va video)
   - Xona bo‘yicha filtr: *Barchasi, Mehmonxona, Yotoqxona, Oshxona, Ofis*
   - Uslub bo‘yicha filtr: *Neoklassika, Modern, Minimalizm*
   - Interaktiv **Oldin / Keyin (Before/After)** slayderi
   - Har bir loyihada **“Shunga o‘xshash parda buyurtma qilish”** tugmasi
   - Video ko‘rish modali

3. **Buyurtma asosida parda tikish (`/xizmatlar/tikish`)**:
   - Tikuv ustaxonasi jarayoni, dizayner maslahati, individual andazalar va video blok

4. **Parda yuvish va parvarish (`/xizmatlar/yuvish`)**:
   - Ehtiyotkorlik bilan yechib olish, eko-tozalash, vertikal bug‘lab dazmollash va qayta osib berish
   - Maxsus video blok va parda yuvishga buyurtma shakli

5. **O‘lchov, karniz va o‘rnatish (`/xizmatlar/ornatish`)**:
   - Bepul lazerli o‘lchov olish, yashirin shift profillari, aqlli motorlashtirilgan karnizlar va montaj videosi

6. **Matolar va quyoshdan himoya (`/matolar`)**:
   - 100% Blackout, Baxmal (Velvet), Zig‘ir (Linen), Shifon va Tuly matolari, UV va issiqlikdan himoya qo‘llanmasi

7. **LA PARDA haqida (`/biz-haqimizda`)**:
   - Brend tarixi, ustaxona falsafasi, sifat standartlari va video ekskursiya

8. **Ko‘p beriladigan savollar (`/faq`)**:
   - O‘lchov, narxlar, muddatlar va parda parvarishi bo‘yicha interaktiv akkordeon hamda video maslahat

9. **Aloqa va buyurtma berish (`/aloqa`)**:
   - Telefon, manzil, ish vaqti, Telegram va Instagram havolalari, interaktiv buyurtma shakli

### Tizim sahifalari:
- **Ro‘yxatdan o‘tish (`/auth/register`)**: Ism, +998 telefon raqami, parol, maxfiylik shartlari
- **Kirish (`/auth/login`)**: Telefon va parol orqali tizimga kirish
- **Shaxsiy kabinet (`/kabinet`)**: Buyurtmalar tarixi, real vaqtdagi status ko‘rsatkichi, saqlangan loyihalar, chiqish
- **Admin Panel (`/admin`)**: Yangi va jami buyurtmalar statistikasi, qidiruv va filtr, buyurtma holatini o‘zgartirish, Telegram yetkazilishini tekshirish va qayta yuborish
- **Maxfiylik siyosati (`/maxfiylik`)**

---

## 📁 Media Papkalar Tuzilishi (`public/media/`)

Barcha media fayllar quyidagi tavsiya etilgan tuzilishda joylashgan va `lib/media-manifest.json` orqali boshqariladi:

```text
public/media/
├── projects/      # Haqiqiy parda ishlari (laparda1.jpg - laparda14.jpg + original HEIC fayllar)
├── videos/        # Haqiqiy videolar (laparda6.MOV, laparda10.MOV, video1.MOV, video2.MOV)
├── home/          # Bosh sahifa rasmlari (hero-curtains.jpg, featured-1/2/3.jpg)
├── sewing/        # Tikish sahifasi rasmlari
├── washing/       # Yuvish va tozalash rasmlari
├── installation/  # Karniz va o‘rnatish rasmlari
├── fabrics/       # Matolar (blackout, velvet, sheer, linen) rasmlari
├── about/         # Ustaxona va ustalar rasmlari
├── faq/           # Maslahatlar rasmlari
└── contact/       # Showroom rasmlari
```

---

## 🤖 Telegram Botni Sozlash (Yo‘riqnoma)

Platforma buyurtmalarni avtomatik tarzda Telegram bot orqali administratorga yetkazadi va admin chatdagi tugmalar orqali holatni bir zumda o‘zgartirishi mumkin:

1. Telegramda [@BotFather](https://t.me/botfather) ga kiring.
2. `/newbot` buyrug‘ini yuboring va botingizga nom bering (masalan: `LA PARDA Buyurtmalar Boti`).
3. BotFather bergan **HTTP API Token** nusxasini oling (misol: `7123456789:AAH...`).
4. Administrator chat ID sini bilish uchun Telegramda [@userinfobot](https://t.me/userinfobot) ga kiring va `/start` bosing. Sizga berilgan `Id:` raqamini oling (misol: `123456789`).
5. Yangi ochilgan botingizga kiring va unga kamida bir marta `/start` bosing (bot sizga xabar yuborishi uchun).
6. `.env.local` fayliga ushbu ma’lumotlarni kiriting:
   ```env
   TELEGRAM_BOT_TOKEN="sizning_bot_tokeningiz"
   TELEGRAM_ADMIN_CHAT_ID="sizning_chat_idingiz"
   ```
7. *(Ixtiyoriy)* Telegram inline tugmalaridan buyurtma holatini o‘zgartirish uchun vebhook sozlang:
   ```bash
   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/telegram/webhook
   ```

---

## 🗄 Ma’lumotlar Bazasini Sozlash (Supabase / PostgreSQL)

Loyiha ikkala rejimda ham to‘liq ishlaydi:
- Dastlabki holatda xotiradagi doimiy local store orqali ishga tushadi (hatto internet yoki baza ulanishi bo‘lmaganda ham).
- Supabase bilan ulash uchun:
  1. [Supabase](https://supabase.com) dan yangi loyiha oching.
  2. **Project Settings -> Database -> Connection string (URI)** dan `postgres` ulanish havolasini oling.
  3. `.env.local` dagi `DATABASE_URL` ga qo‘ying:
     ```env
     DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres"
     ```
  4. Terminalda quyidagi buyruqni bering:
     ```bash
     npx prisma db push
     ```

---

## 🚀 Loyihani Ishga Tushirish

```bash
# Qaramliklarni o'rnatish
npm install

# Ishchi serverni ishga tushirish (Local Dev)
npm run dev

# Ishlab chiqarish (Production) build yaratish
npm run build

# Production serverni yurgazish
npm start
```

Brauzerda [http://localhost:3000](http://localhost:3000) manziliga kiring.

### 🔑 Standart Administrator Hisobi
- **Telefon**: `+998901234567`
- **Parol**: `admin12345`
- **Admin panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
