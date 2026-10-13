import { db, OrderRecord } from '@/lib/db';
import { formatTashkentTime } from '@/lib/date';

export { formatTashkentTime };

const TELEGRAM_API_BASE = 'https://api.telegram.org';

// Map service names to readable labels
function getServiceLabel(type: string): string {
  switch (type) {
    case 'tikish':
      return 'Buyurtma asosida parda tikish';
    case 'yuvish':
      return 'Parda yuvish va parvarish';
    case 'ornatish':
      return 'O‘lchov, karniz va o‘rnatish';
    case 'matolar':
      return 'Mato tanlash va maslahat';
    default:
      return type;
  }
}

// Generate inline keyboard for order status
export function getOrderStatusKeyboard(orderNumber: string) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Qabul qilindi', callback_data: `st:${orderNumber}:QABUL_QILINDI` },
        { text: '📞 Bog‘lanildi', callback_data: `st:${orderNumber}:BOGLANILDI` }
      ],
      [
        { text: '📏 O‘lchov belgilandi', callback_data: `st:${orderNumber}:OLCHOV_BELGILANDI` },
        { text: '⚙️ Jarayonda', callback_data: `st:${orderNumber}:JARAYONDA` }
      ],
      [
        { text: '🏁 Tayyor', callback_data: `st:${orderNumber}:TAYYOR` },
        { text: '❌ Bekor qilindi', callback_data: `st:${orderNumber}:BEKOR_QILINDI` }
      ]
    ]
  };
}

// Build rich Telegram message text
export function buildOrderTelegramMessage(order: OrderRecord): string {
  const timeFormatted = formatTashkentTime(order.createdAt);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const adminUrl = `${siteUrl}/admin`;

  let msg = `✨ <b>YANGI BUYURTMA: ${order.orderNumber}</b>\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📅 <b>Sana (Toshkent):</b> ${timeFormatted}\n`;
  msg += `👤 <b>Mijoz:</b> ${escapeHtml(order.customerName)}\n`;
  msg += `📞 <b>Telefon:</b> <a href="tel:${order.phone}">${escapeHtml(order.phone)}</a>\n`;
  msg += `🏷 <b>Xizmat:</b> ${escapeHtml(getServiceLabel(order.serviceType))}\n`;

  if (order.projectTitle) {
    msg += `🛋 <b>Tanlangan loyiha:</b> ${escapeHtml(order.projectTitle)}\n`;
  }

  if (order.district || order.address) {
    msg += `📍 <b>Manzil:</b> ${escapeHtml(order.district || '')} ${escapeHtml(order.address || '')}\n`;
  }

  if (order.isWashingService) {
    msg += `🧼 <b>Pardalar soni:</b> ${order.washingCurtainQty || 'Ko‘rsatilmagan'}\n`;
    msg += `🔧 <b>Yechib olish/Olib ketish:</b> ${order.washingNeedDismantle ? 'Ha' : 'Yo‘q'}\n`;
  } else {
    msg += `🪟 <b>Xonalar / Derazalar:</b> ${order.roomCount || 1} xona / ${order.windowCount || 1} deraza\n`;
    if (order.dimensions) {
      msg += `📐 <b>Taxminiy o‘lcham:</b> ${escapeHtml(order.dimensions)}\n`;
    }
  }

  if (order.fabricPreference || order.colorPreference) {
    msg += `🎨 <b>Mato / Rang istagi:</b> ${escapeHtml([order.fabricPreference, order.colorPreference].filter(Boolean).join(', '))}\n`;
  }

  if (order.budget) {
    msg += `💰 <b>Taxminiy budjet:</b> ${escapeHtml(order.budget)}\n`;
  }

  if (order.measurementDate || order.measurementTime) {
    msg += `🗓 <b>O‘lchov vaqti:</b> ${escapeHtml([order.measurementDate, order.measurementTime].filter(Boolean).join(' '))}\n`;
  }

  if (order.comment) {
    msg += `💬 <b>Mijoz izohi:</b> <i>${escapeHtml(order.comment)}</i>\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📊 <b>Hozirgi holat:</b> <b>${order.status}</b>\n`;
  msg += `🔗 <a href="${adminUrl}">Admin panelda ko‘rish</a>`;

  return msg;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendTelegramOrder(order: OrderRecord): Promise<{ success: boolean; messageId?: number; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !adminChatId) {
    const errorMsg = 'TELEGRAM_BOT_TOKEN yoki TELEGRAM_ADMIN_CHAT_ID sozlanmagan';
    console.warn(`[Telegram Bot] ${errorMsg}. Buyurtma bazada saqlandi, yetkazish PENDING holatida qoldi.`);
    await db.updateOrderDelivery(order.orderNumber, 'FAILED', undefined, errorMsg);
    await db.logTelegramAction({
      orderId: order.id,
      action: 'SEND_ORDER',
      status: 'CONFIG_MISSING',
      response: errorMsg
    });
    return { success: false, error: errorMsg };
  }

  const text = buildOrderTelegramMessage(order);
  const replyMarkup = getOrderStatusKeyboard(order.orderNumber);

  try {
    const res = await fetch(`${TELEGRAM_API_BASE}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminChatId,
        text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
        disable_web_page_preview: true
      })
    });

    const data = await res.json();

    if (data.ok && data.result) {
      const messageId = data.result.message_id;
      await db.updateOrderDelivery(order.orderNumber, 'SENT', messageId);
      await db.logTelegramAction({
        orderId: order.id,
        action: 'SEND_ORDER',
        status: 'SUCCESS',
        payload: { orderNumber: order.orderNumber },
        response: data.result
      });
      return { success: true, messageId };
    } else {
      const errorMsg = data.description || 'Telegram API xatosi';
      await db.updateOrderDelivery(order.orderNumber, 'FAILED', undefined, errorMsg);
      await db.logTelegramAction({
        orderId: order.id,
        action: 'SEND_ORDER',
        status: 'FAILED',
        response: data
      });
      return { success: false, error: errorMsg };
    }
  } catch (err: any) {
    const errorMsg = err.message || 'Tarmoq xatosi';
    await db.updateOrderDelivery(order.orderNumber, 'FAILED', undefined, errorMsg);
    await db.logTelegramAction({
      orderId: order.id,
      action: 'SEND_ORDER',
      status: 'EXCEPTION',
      response: errorMsg
    });
    return { success: false, error: errorMsg };
  }
}
