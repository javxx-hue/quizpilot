// Daily reminder: sends each linked student today's plan.
// Run by pg_cron (see README) with the service role key and the
// x-cron-secret header. Secrets: TELEGRAM_BOT_TOKEN, CRON_SECRET, APP_URL
//
// The plan math mirrors src/lib/prep.ts (planSubject) and src/lib/srs.ts
// (dueQueue) in a reduced form, since those modules run in the browser.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendTelegram } from '../_shared/telegram.ts';

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const appUrl = Deno.env.get('APP_URL') ?? '';
const PASS_SCORE = 71;

type Question = { attempts: { score: number }[] };
type Subject = { name: string; examDate: string; questions: Question[] };
type Card = { srs?: { due: string; state: number } };
type StudySet = { flashcards?: Card[] };

function tashkentToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Tashkent' }); // YYYY-MM-DD
}

function subjectLine(s: Subject, today: string): string | null {
  const daysLeft = Math.round((Date.parse(s.examDate) - Date.parse(today)) / 86_400_000);
  if (daysLeft < 0) return null;
  if (daysLeft === 0) return `• ${s.name}: imtihon bugun. Omad! 🍀`;
  const remaining = s.questions.filter((q) => (q.attempts.at(-1)?.score ?? 0) < PASS_SCORE).length;
  const when = daysLeft === 1 ? 'imtihon ertaga' : `${daysLeft} kun qoldi`;
  if (!s.questions.length) return `• ${s.name}: ${when}, savollar ro'yxati hali kiritilmagan`;
  if (!remaining) return `• ${s.name}: ${when}, barcha savollar o'zlashtirilgan ✅`;
  const studyDays = daysLeft === 1 ? 1 : daysLeft >= 3 ? daysLeft - 1 : daysLeft;
  const today = daysLeft === 1 ? remaining : Math.ceil(remaining / studyDays);
  return `• ${s.name}: ${when}, bugun ${today} ta savol`;
}

Deno.serve(async (req) => {
  if (req.headers.get('x-cron-secret') !== Deno.env.get('CRON_SECRET')) {
    return new Response('forbidden', { status: 403 });
  }

  const { data: links, error } = await admin.from('telegram_links').select('user_id, chat_id').not('chat_id', 'is', null);
  if (error) return new Response(error.message, { status: 500 });

  const today = tashkentToday();
  const now = Date.now();
  let sent = 0;

  for (const link of links ?? []) {
    const [{ data: subjects }, { data: sets }] = await Promise.all([
      admin.from('subjects').select('data').eq('user_id', link.user_id),
      admin.from('study_sets').select('data').eq('user_id', link.user_id),
    ]);

    const lines = (subjects ?? [])
      .map((row: { data: Subject }) => row.data)
      .sort((a, b) => a.examDate.localeCompare(b.examDate))
      .map((s) => subjectLine(s, today))
      .filter((l): l is string => l !== null);

    const dueCards = (sets ?? [])
      .flatMap((row: { data: StudySet }) => row.data.flashcards ?? [])
      .filter((c) => !c.srs || c.srs.state === 0 || Date.parse(c.srs.due) <= now).length;
    if (dueCards) lines.push(`• ${dueCards} ta karta takrorlashni kutyapti`);

    if (!lines.length) continue;
    const text = `📚 Bugungi reja\n\n${lines.join('\n')}${appUrl ? `\n\n${appUrl}/dashboard` : ''}`;
    if (await sendTelegram(link.chat_id, text)) sent++;
  }

  return new Response(JSON.stringify({ sent }), { headers: { 'Content-Type': 'application/json' } });
});
