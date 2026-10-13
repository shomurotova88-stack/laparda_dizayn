import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendTelegramOrder } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Faqat admin uchun ruxsat berilgan' }, { status: 403 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Buyurtma identifikatori kerak' }, { status: 400 });
    }

    const order = await db.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    }

    const result = await sendTelegramOrder(order);

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
