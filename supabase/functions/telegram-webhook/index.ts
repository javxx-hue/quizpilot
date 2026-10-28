// Telegram bot webhook. Links a chat to an account when the user opens
// t.me/<bot>?start=<code> from the app (Telegram sends "/start <code>").
// Deploy with --no-verify-jwt (Telegram cannot send a Supabase JWT); requests
// are checked against TELEGRAM_WEBHOOK_SECRET instead.
// Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, APP_URL
import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendTelegram } from '../_shared/telegram.ts';

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const appUrl = Deno.env.get('APP_URL') ?? '';

Deno.serve(async (req) => {
  if (req.headers.get('x-telegram-bot-api-secret-token') !== Deno.env.get('TELEGRAM_WEBHOOK_SECRET')) {
    return new Response('forbidden', { status: 403 });
  }

  const update = await req.json().catch(() => null);
  const message = update?.message;
  const chatId: number | undefined = message?.chat?.id;
  const text: string = message?.text ?? '';
  if (!chatId) return new Response('ok');

  const start = text.match(/^\/start(?:\s+([a-f0-9]{18}))?$/);
  if (start?.[1]) {
    const { data, error } = await admin
      .from('telegram_links')
      .update({ chat_id: chatId, linked_at: new Date().toISOString(), link_code: null })
      .eq('link_code', start[1])
      .select('user_id')
      .maybeSingle();
    if (error) console.error('link failed', error);
    await sendTelegram(
      chatId,
      data
        ? "✅ Hisobingiz ulandi! Har kuni ertalab bugungi reja shu yerga keladi.\n\nO'chirish uchun: /stop"
        : "Havola eskirgan. Saytda «Telegram eslatmalari» tugmasini qayta bosing." + (appUrl ? `\n${appUrl}` : '')
    );
  } else if (text === '/start') {
    await sendTelegram(chatId, "Salom! Eslatmalarni yoqish uchun saytda «Telegram eslatmalari» tugmasini bosing." + (appUrl ? `\n${appUrl}` : ''));
  } else if (text === '/stop') {
    await admin.from('telegram_links').update({ chat_id: null, linked_at: null }).eq('chat_id', chatId);
    await sendTelegram(chatId, "Eslatmalar o'chirildi. Qayta yoqish uchun saytdagi tugmani bosing.");
  }

  return new Response('ok');
});
