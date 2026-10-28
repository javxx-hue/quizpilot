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

7. **AI**:
   - Google Gemini API (beta davrida shaxsiy kalit header'dagi kalit belgisi orqali kiritiladi).
   - Kalit bo'lmasa yoki AI xato qaytarsa, foydalanuvchiga aniq xabar ko'rsatiladi. Soxta "zaxira" generator yo'q.
   - YouTube manbasi hozircha o'chirilgan (transkript qo'llab-quvvatlanmaguncha).

8. **Hisoblar**: Supabase Auth (email + parol, Google). To'lovlar beta davrida yo'q, hammasi bepul.

Joriy reja: [docs/superpowers/plans/2026-10-28-sessiya-mvp-reja.md](docs/superpowers/plans/2026-10-28-sessiya-mvp-reja.md)

---

## 🚀 Ishga tushirish (Getting Started)

```bash
npm install
cp .env.example .env   # Supabase URL va anon kalitini kiriting
npm run dev
```

Brauzerda: `http://localhost:5173`. `.env` to'ldirilmasa ham sayt ishlaydi, faqat hisob yaratish o'chiq bo'ladi.

### Supabase sozlash (bir marta)

1. [supabase.com](https://supabase.com) da yangi loyiha yarating.
2. **SQL Editor** da [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql) ni ishga tushiring.
3. **Project Settings → API** dan `URL` va `anon public` kalitni `.env` ga yozing.
4. **Authentication → URL Configuration**: Site URL `http://localhost:5173`, Redirect URLs ga `http://localhost:5173/**` qo'shing.
5. Google bilan kirish uchun: **Authentication → Providers → Google** ni yoqing (Google Cloud'dan OAuth client ID/secret kerak).

Deploy qilinganda hosting barcha yo'llarni `index.html` ga yo'naltirishi kerak (SPA rewrite), aks holda `/dashboard` kabi manzillar yangilanganda 404 beradi.

---

## 🛠 Texnologiyalar (Tech Stack)

- **Frontend:** React 19 + TypeScript + Vite, React Router
- **Styling:** Tailwind CSS + Lucide React Icons
- **PDF Parser:** pdfjs-dist (brauzerda, sahifa belgilari bilan)
- **AI:** Google Gemini API (`VITE_GEMINI_MODEL`, standart `gemini-3.8-flash`)
- **Backend:** Supabase (Auth, Postgres + RLS)
- **Saqlash:** o'quv to'plamlari hozircha brauzer LocalStorage'da; 2-haftada Supabase'ga ko'chiriladi
