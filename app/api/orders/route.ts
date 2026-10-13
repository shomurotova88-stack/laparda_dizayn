import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendTelegramOrder } from '@/lib/telegram';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Avtorizatsiyadan o‘tmagan' }, { status: 401 });
  }

  if (user.role === 'ADMIN') {
    const orders = await db.getAllOrders();
    return NextResponse.json({ orders });
  } else {
    const orders = await db.getOrdersByUserId(user.id);
    return NextResponse.json({ orders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      customerName,
      phone,
      serviceType,
      projectId,
      projectTitle,
      district,
      address,
      windowCount,
      roomCount,
      dimensions,
      colorPreference,
      fabricPreference,
      budget,
      measurementDate,
      measurementTime,
      comment,
      photoUrls,
      isWashingService,
      washingCurtainQty,
      washingNeedDismantle
    } = body;

    if (!customerName || !phone || !serviceType) {
      return NextResponse.json(
        { error: 'Ism, telefon raqam va xizmat turini ko‘rsatish majburiy' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+998\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Telefon raqam +998901234567 formatida bo‘lishi kerak' },
        { status: 400 }
      );
    }

    // Save to Database first
    const newOrder = await db.createOrder({
      userId: user?.id || null,
      customerName: customerName.trim(),
      phone: cleanPhone,
      serviceType,
      projectId: projectId || null,
      projectTitle: projectTitle || null,
      district: district || null,
      address: address ? address.trim() : null,
      windowCount: windowCount ? Number(windowCount) : 1,
      roomCount: roomCount ? Number(roomCount) : 1,
      dimensions: dimensions || null,
      colorPreference: colorPreference || null,
      fabricPreference: fabricPreference || null,
      budget: budget || null,
      measurementDate: measurementDate || null,
      measurementTime: measurementTime || null,
      comment: comment ? comment.trim() : null,
      photoUrls: photoUrls ? JSON.stringify(photoUrls) : null,
      isWashingService: !!isWashingService,
      washingCurtainQty: washingCurtainQty ? Number(washingCurtainQty) : null,
      washingNeedDismantle: !!washingNeedDismantle,
      status: 'YANGI',
      telegramSent: false,
      deliveryStatus: 'PENDING'
    });

    // Send to Telegram asynchronously without blocking response
    sendTelegramOrder(newOrder).catch(err => {
      console.error('Async Telegram send error:', err);
    });

    return NextResponse.json({
      success: true,
      orderNumber: newOrder.orderNumber,
      order: newOrder
    });
  } catch (err: any) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Buyurtmani saqlashda xatolik yuz berdi' }, { status: 500 });
  }
}
