import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, createSessionToken, COOKIE_NAME, checkRateLimit } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`login_${ip}`);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Kirishga urinishlar soni oshib ketdi. Iltimos, 15 daqiqadan keyin urinib ko‘ring.' },
        { status: 429 }
      );
    }

    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'Telefon va parolni kiriting' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const user = await db.findUserByPhone(cleanPhone);

    if (!user) {
      return NextResponse.json({ error: 'Telefon raqam yoki parol noto‘g‘ri' }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Telefon raqam yoki parol noto‘g‘ri' }, { status: 401 });
    }

    const token = await createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 });
  }
}
