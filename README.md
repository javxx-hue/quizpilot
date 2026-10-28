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

7. **AI & Avtonom Ishlash**:
   - Google Gemini API integratsiyasi (Sozlamalar orqali shaxsiy kalit kiritish mumkin).
   - **Smart Fallback rejimi**: API kalit kiritilmagan taqdirda ham ilova ichki aqlli generator orqali to'xtovsiz ishlayveradi.

---

## 🚀 Ishga tushirish (Getting Started)

Loyiha katalogiga o'ting va dev serverni ishga tushiring:

```bash
cd "C:\Users\Asus\.gemini\antigravity\scratch\quizpilot-clone"
npm run dev
```

Brauzeringizda quyidagi manzilni oching:
`http://localhost:5173`

---

## 🛠 Texnologiyalar (Tech Stack)

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide React Icons
- **PDF Parser:** pdfjs-dist (brauzerda bevosita o'qiydi)
- **AI:** Google Gemini API + Smart Heuristic Engine
- **Saqlash:** Brauzer LocalStorage (barcha testlar va natijalar xavfsiz saqlanadi)
