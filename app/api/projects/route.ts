import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get('room');
  const style = searchParams.get('style');
  const featured = searchParams.get('featured');

  let projects = await db.getAllProjects();

  if (room && room !== 'all') {
    projects = projects.filter(p => p.room === room);
  }
  if (style && style !== 'all') {
    projects = projects.filter(p => p.style === style);
  }
  if (featured === 'true') {
    projects = projects.filter(p => p.featured);
  }

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Faqat admin uchun ruxsat berilgan' }, { status: 403 });
    }

    const body = await req.json();
    const { titleUz, titleRu, descriptionUz, descriptionRu, image, video, room, style, hasBeforeAfter, featured } = body;

    if (!titleUz || !image || !room || !style) {
      return NextResponse.json({ error: 'Sarlavha, rasm, xona va uslub maydonlari to‘ldirilishi kerak' }, { status: 400 });
    }

    const newProject = await db.createProject({
      titleUz,
      titleRu: titleRu || titleUz,
      descriptionUz: descriptionUz || '',
      descriptionRu: descriptionRu || '',
      image,
      video: video || null,
      room,
      style,
      hasBeforeAfter: !!hasBeforeAfter,
      featured: !!featured,
      sortOrder: 0,
      active: true
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
