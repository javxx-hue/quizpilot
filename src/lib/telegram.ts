import { supabase } from './supabase';

export const TELEGRAM_BOT = import.meta.env.VITE_TELEGRAM_BOT ?? '';
export const isTelegramConfigured = !!supabase && !!TELEGRAM_BOT;

// Opens the bot with a one-time code; the bot links the chat on /start <code>
export async function connectTelegram(): Promise<void> {
  if (!supabase || !TELEGRAM_BOT) throw new Error('TELEGRAM_NOT_CONFIGURED');
  // Open the tab first: browsers block window.open after an await
  const tab = window.open('', '_blank');
  const { data, error } = await supabase.rpc('create_telegram_link_code');
  if (error || typeof data !== 'string') {
    tab?.close();
    throw error ?? new Error('No link code');
  }
  const url = `https://t.me/${TELEGRAM_BOT}?start=${data}`;
  if (tab) tab.location.href = url;
  else window.location.href = url;
}
