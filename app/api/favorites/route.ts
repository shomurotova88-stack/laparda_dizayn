import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tmagan' }, { status: 401 });
  }

  const favorites = await db.getFavorites(user.id);
  return NextResponse.json({ favorites });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tmagan' }, { status: 401 });
  }

  const { projectId } = await req.json();
  if (!projectId) {
    return NextResponse.json({ error: 'Loyiha identifikatori kerak' }, { status: 400 });
  }

  const isFavorite = await db.toggleFavorite(user.id, projectId);
  return NextResponse.json({ success: true, isFavorite });
}
