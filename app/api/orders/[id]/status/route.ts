import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Ruxsat berilmagan (Faqat admin uchun)' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Yangi holatni ko‘rsating' }, { status: 400 });
    }

    const updated = await db.updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    console.error('Update order status error:', err);
    return NextResponse.json({ error: 'Holatni yangilashda xatolik' }, { status: 500 });
  }
}
