# QuizPilot.io Clone

AI asosida ishlaydigan zamonaviy o'quv platformasi — [quizpilot.io](https://quizpilot.io) saytining to'liq interaktiv kloni.

## ✨ Imkoniyatlar (Features)

1. **AI Quiz Generator & Runner (`/quizzes-ai`)**:
   - Har qanday matn, darslik, PDF hujjat yoki YouTube havolasidan testlar tuzish.
   - Har bir javob uchun maslahatlar (AI Hints) va batafsil tushuntirishlar (Explanations).
   - Natijalar tahlili va qayta topshirish imkoniyati.

2. **3D Flesh-kartalar (`/flashcards-ai`)**:
   - 3D aylanuvchi interaktiv kartochkalar (Space yoki bosish orqali).
   - Aktiv eslash (Active Recall) va intervalli takrorlash: *Again, Hard, Good, Easy*.
   - Klaviatura boshqaruvi va aralashtirish (Shuffle).

3. **Strukturaviy Qaydlar & Konspekt (`/ai-notes`)**:
   - Katta hajmdagi matnlardan qisqacha mazmun (Executive Summary).
   - Asosiy atamalar va ta'riflar jadvali (Glossary).
   - Bir bosishda nusxa olish yoki PDF shaklida chop etish.

4. **Imtihon Simulyatori (`/exam-simulator`)**:
   - Qat'iy orqaga hisoblovchi taymer (Countdown Timer).
   - Savollar matritsasi (Matrix Grid) va belgilash (Flagging).
   - Imtihon yakunida kuchsiz sohalar tahlili (Diagnostic Report).

5. **Ikki tilli interfeys (Bilingual i18n)**:
   - Header orqali bir zumda **O'zbekcha (UZ)** va **Inglizcha (EN)** tillarini almashtirish.

6. **Dizayn & Estetika**:
   - QuizPilot'ning vintage qog'oz foni (`#FAF7EE`), `DM Serif Text` sarlavhalari va toza `Inter` tipografiyasi.
   - Qorong'i rejim (Dark Mode) va yorug' rejim (Light Mode).

7. **Sessiyaga tayyorgarlik (`/subjects`)**:
   - Fanlar: imtihon sanasi va shakli (test / yozma / og'zaki / aralash).
   - Materiallar: PDF, PowerPoint, Word, TXT, konspekt rasmi (qo'lyozmani AI o'qiydi), YouTube ma'ruza (AI videoni ko'rib, vaqt belgilari bilan konspekt yozadi).
   - Imtihon savollari ro'yxati: "1.", "1)", "№1", "1-savol." formatlari tanib olinadi.
   - Har bir savolga materialdan namunaviy javob va manbalar (fayl + sahifa).
   - Talaba javobini yozadi yoki gapiradi (mikrofon), AI 0–100 va 5 ballik tizimda baholaydi, yetishmagan joylarni ko'rsatadi.
   - Sessiya rejasi: eng kuchsiz savollar birinchi, imtihondan oldingi kun umumiy takrorlash. Dashboard'da "Bugungi reja".
   - Fanning tayyorlik foizi (savollar, testlar va kartalar asosida).

8. **AI**: Google Gemini. Tizimga kirgan foydalanuvchi uchun server orqali (kalit serverda, kunlik limit bilan), aks holda brauzerdagi shaxsiy kalit bilan. Xato bo'lsa aniq xabar chiqadi, soxta natija yo'q.

9. **Hisoblar va sinxronizatsiya**: Supabase Auth (email + parol, Google). Kirgan foydalanuvchining fanlari va to'plamlari bulutga nusxalanadi va qurilmalar orasida sinxronlanadi.

10. **Telegram eslatmalari**: har kuni ertalab bugungi reja botga keladi.

11. **PWA**: telefonga ilova sifatida o'rnatiladi, internetsiz ham ochiladi.

To'lovlar beta davrida yo'q, hammasi bepul.

Joriy reja: [docs/superpowers/plans/2026-10-28-sessiya-mvp-reja.md](docs/superpowers/plans/2026-10-28-sessiya-mvp-reja.md)

---

## 🚀 Ishga tushirish

```bash
npm install
cp .env.example .env   # Supabase URL va anon kalitini kiriting
npm run dev
```

Brauzerda: `http://localhost:5173`. `.env` to'ldirilmasa ham sayt ishlaydi (hisobsiz, brauzer kaliti bilan).

Tekshiruvlar: `npm test` (vitest) va `npm run typecheck`.

### 1. Supabase (bir marta)

1. [supabase.com](https://supabase.com) da loyiha yarating (region: Frankfurt).
2. **SQL Editor** da [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql) ni ishga tushiring.
3. **Project Settings → API** dan `URL` va `anon public` kalitni `.env` ga yozing.
4. **Authentication → URL Configuration**: Site URL va Redirect URLs ga sayt manzilini (`http://localhost:5173/**` va production domen) qo'shing.
5. Google bilan kirish: **Authentication → Providers → Google** (Google Cloud'dan OAuth client ID/secret).

### 2. Server funksiyalari (Supabase CLI)

```bash
npx supabase login
npx supabase link --project-ref <loyiha-ref>
npx supabase secrets set GEMINI_API_KEY=... AI_DAILY_LIMIT=100 ALLOWED_ORIGINS=https://sizning-domen.uz,http://localhost:5173
npx supabase functions deploy gemini
```

### 3. Telegram bot (ixtiyoriy)

1. [@BotFather](https://t.me/BotFather) da bot yarating, tokenni oling. `.env` ga `VITE_TELEGRAM_BOT=bot_nomi` (@ siz).
2. Sirlar va funksiyalar:
   ```bash
   npx supabase secrets set TELEGRAM_BOT_TOKEN=... TELEGRAM_WEBHOOK_SECRET=<tasodifiy-matn> CRON_SECRET=<tasodifiy-matn> APP_URL=https://sizning-domen.uz
   npx supabase functions deploy telegram-webhook --no-verify-jwt
   npx supabase functions deploy telegram-reminders
   ```
3. Webhook'ni ulash (bir marta):
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<loyiha-ref>.supabase.co/functions/v1/telegram-webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>"
   ```
4. Har kuni 08:00 (Toshkent) eslatma: **Database → Extensions** da `pg_cron` va `pg_net` ni yoqing, keyin SQL Editor'da:
   ```sql
   select cron.schedule('daily-reminders', '0 3 * * *', $$
     select net.http_post(
       url := 'https://<loyiha-ref>.supabase.co/functions/v1/telegram-reminders',
       headers := jsonb_build_object(
         'Authorization', 'Bearer <SERVICE_ROLE_KEY>',
         'x-cron-secret', '<CRON_SECRET>'
       )
     );
   $$);
   ```

### 4. Deploy

Vercel yoki Netlify: build buyrug'i `npm run build`, papka `dist`. Barcha yo'llar `index.html` ga yo'naltirilishi kerak (SPA rewrite), aks holda `/dashboard` yangilanganda 404 beradi. `.env` dagi `VITE_*` qiymatlarni hosting sozlamalariga ham kiriting.

Ikonkalar: `public/icon.svg` o'zgarsa, `node scripts/make-icons.mjs` ni ham yangilang va ishga tushiring.

---

## 🛠 Texnologiyalar

- **Frontend:** React 19 + TypeScript + Vite, React Router, PWA (service worker)
- **Styling:** Tailwind CSS + Lucide React Icons
- **Materiallar:** pdfjs-dist (PDF), jszip (PPTX/DOCX), Gemini (rasm va YouTube)
- **AI:** Google Gemini (`gemini-3.8-flash`), Supabase Edge Function orqali
- **Takrorlash:** FSRS (`ts-fsrs`)
- **Backend:** Supabase (Auth, Postgres + RLS, Edge Functions, pg_cron)
- **Saqlash:** brauzer LocalStorage + kirgan foydalanuvchi uchun Supabase sinxronizatsiyasi
- **Testlar:** vitest
