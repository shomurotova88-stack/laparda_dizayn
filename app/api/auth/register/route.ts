import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createSessionToken, COOKIE_NAME, checkRateLimit } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`reg_${ip}`);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Urinishlar soni oshib ketdi. 15 daqiqadan so‘ng qayta urinib ko‘ring.' },
        { status: 429 }
      );
    }

    const { name, phone, password, confirmPassword, agreePrivacy, adminCode } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Barcha maydonlarni to‘ldiring' }, { status: 400 });
    }

    if (!agreePrivacy) {
      return NextResponse.json({ error: 'Maxfiylik shartlariga rozilik bildirilishi shart' }, { status: 400 });
    }

    // Validate Uzbek phone format (+998...)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+998\d{9}$/.test(cleanPhone)) {
      return NextResponse.json({ error: 'Telefon raqam +998901234567 formatida bo‘lishi kerak' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' }, { status: 400 });
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json({ error: 'Kiritilgan parollar bir-biriga mos kelmadi' }, { status: 400 });
    }

    const existingUser = await db.findUserByPhone(cleanPhone);
    if (existingUser) {
      return NextResponse.json({ error: 'Bu telefon raqami allaqachon ro‘yxatdan o‘tgan' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const adminSecret = process.env.ADMIN_REGISTRATION_SECRET || 'laparda_admin_master_2026';
    const role = (adminCode && adminCode === adminSecret) ? 'ADMIN' : 'CUSTOMER';

    const newUser = await db.createUser({
      name: name.trim(),
      phone: cleanPhone,
      passwordHash,
      role
    });

    const token = await createSessionToken(newUser);

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role
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
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 });
  }
}
