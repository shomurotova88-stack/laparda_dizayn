import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildOrderTelegramMessage, getOrderStatusKeyboard } from '@/lib/telegram';

const TELEGRAM_API_BASE = 'https://api.telegram.org';

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token) {
    return NextResponse.json({ ok: false, error: 'Bot token not set' }, { status: 400 });
  }

  try {
    const update = await req.json();

    // Check if it's a callback query (inline button click)
    if (update.callback_query) {
      const cb = update.callback_query;
      const callbackId = cb.id;
      const fromChatId = String(cb.message?.chat?.id || cb.from?.id);
      const data = cb.data as string; // format: "st:LP-2026-0001:STATUS"

      // Security: Only authorized admin can change status
      if (adminChatId && fromChatId !== String(adminChatId)) {
        await answerCallback(token, callbackId, 'Ruxsat berilmagan foydalanuvchi!', true);
        return NextResponse.json({ ok: true });
      }

      if (data && data.startsWith('st:')) {
        const parts = data.split(':');
        const orderNumber = parts[1];
        const newStatus = parts[2] as any;

        const updatedOrder = await db.updateOrderStatus(orderNumber, newStatus);

        if (updatedOrder) {
          // Log action
          await db.logTelegramAction({
            orderId: updatedOrder.id,
            action: 'STATUS_UPDATE_CALLBACK',
            status: 'SUCCESS',
            payload: { orderNumber, newStatus, byChatId: fromChatId }
          });

          // Answer callback alert/toast
          await answerCallback(token, callbackId, `Holat o‘zgartirildi: ${newStatus}`);

          // Edit message in Telegram to reflect status change
          if (cb.message?.message_id) {
            const newText = buildOrderTelegramMessage(updatedOrder);
            await fetch(`${TELEGRAM_API_BASE}/bot${token}/editMessageText`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: fromChatId,
                message_id: cb.message.message_id,
                text: newText,
                parse_mode: 'HTML',
                reply_markup: getOrderStatusKeyboard(updatedOrder.orderNumber),
                disable_web_page_preview: true
              })
            });
          }
        } else {
          await answerCallback(token, callbackId, 'Buyurtma topilmadi!', true);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Telegram webhook error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

async function answerCallback(token: string, callbackQueryId: string, text: string, showAlert = false) {
  try {
    await fetch(`${TELEGRAM_API_BASE}/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert
      })
    });
  } catch (err) {
    console.error('Error answering callback query:', err);
  }
}
