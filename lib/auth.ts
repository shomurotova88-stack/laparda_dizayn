import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db, UserRecord } from '@/lib/db';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'laparda-secret-jwt-key-2026-tashkent-luxury-curtains';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = 'laparda_token';

// Rate limiting in-memory store
const rateLimitMap = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (now - record.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: UserRecord): Promise<string> {
  return new SignJWT({
    userId: user.id,
    phone: user.phone,
    role: user.role,
    name: user.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as { userId: string; phone: string; role: 'CUSTOMER' | 'ADMIN'; name: string };
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserRecord | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    return await db.findUserById(payload.userId);
  } catch (err) {
    return null;
  }
}

export { COOKIE_NAME };
