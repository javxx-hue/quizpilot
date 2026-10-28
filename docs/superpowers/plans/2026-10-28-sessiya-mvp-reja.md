# MVP rejasi: universitet sessiyasiga tayyorlov

**Sana:** 2026-10-28
**Holat:** reja, kod hali o'zgartirilmagan.
**Yo'nalish:** birinchi bosqichda talabalarning universitet sessiyasi va oraliq nazoratlariga tayyorlanishi.

> Eslatma: OTMlardagi oraliq/yakuniy nazorat tartibi bo'yicha 2026-yil uchun aniq rasmiy qoidalar topilmadi va ular OTMga qarab farq qilishi mumkin. Dastur formatlarga moslashuvchan bo'lishi kerak, aniq tartib talabalar bilan suhbatda tekshiriladi.

## Muammo va foydalanuvchi

- **Kim:** sessiya yoki oraliq nazoratga 1–3 hafta qolgan talaba. Qo'lida ma'ruza PDF'lari, slaydlar, daftar suratlari va ko'pincha o'qituvchi bergan imtihon savollari ro'yxati bor.
- **Og'riq:** material ko'p, vaqt kam, nimadan boshlashni bilmaydi va qanchalik tayyor ekanini bilmaydi.

## Asosiy oqim (MVP)

1. **Semestr va fanlar:** fan qo'shish, imtihon sanasi va formati (test, yozma, og'zaki).
2. **Material yuklash:** PDF, PPTX, konspekt surati, savollar ro'yxati.
3. **AI ishlov berish:** material mavzularga bo'linadi; har mavzu uchun konspekt, test, kartochkalar, har birida manba sahifasi ko'rsatiladi.
4. **Savollar ro'yxati rejimi (asosiy farqimiz):** har bir imtihon savoliga materialdan javob konspekti; talaba javobini yozadi, AI baholaydi va yetishmayotgan joylarni ko'rsatadi.
5. **Sessiya rejasi:** imtihongacha qolgan kunlarga mavzular taqsimlanadi, kunlik vazifalar ro'yxati.
6. **Mashq:** intervalli takrorlashli kartochkalar, test, imtihon formatidagi taymerli sinov.
7. **Tayyorlik paneli:** fan va mavzu bo'yicha tayyorlik foizi, kuchsiz mavzular.

## MVPga kirmaydi (v2)

Ma'ruzani ovozdan yozib olish, audio podkast, liga/reyting, Quizlet import, o'qituvchi/B2B paneli, to'liq mobil ilova. MVPda o'rniga PWA bo'ladi; Telegram'dan faqat oddiy eslatma boti.

## Texnologiya

- **Frontend:** mavjud React + Vite kodi qayta ishlatiladi, `react-router` qo'shiladi.
- **Backend:** Supabase (auth, Postgres, fayl saqlash) + Edge Functions. Gemini API kaliti serverda turadi.
- **AI:** joriy Gemini Flash modeli; material bo'laklarga bo'linadi, javoblar manba havolasi bilan qaytadi. Soxta fallback olib tashlanadi.
- **To'lov:** MVPda yo'q, bepul beta kunlik limit bilan. Payme/Click v1.1 da haqiqiy webhook tekshiruvi bilan.

## 6 haftalik reja

| Hafta | Ish |
|---|---|
| 0 (parallel) | 10–15 talaba bilan suhbat; 3–5 OTMdan haqiqiy savollar ro'yxati va imtihon formatlarini yig'ish |
| 1 | Tozalash: soxta AI, to'lov, kirish va sharhlarni olib tashlash, brendni o'zgartirish. Supabase, auth, router |
| 2 | Semestr/fan tuzilmasi, material yuklash, AI ishlov berish (bo'laklash, manba havolalari) |
| 3 | Materialdan konspekt, test, kartochka; intervalli takrorlash (FSRS) |
| 4 | Savollar ro'yxati rejimi, yozma javobni AI bilan baholash |
| 5 | Sessiya rejasi, tayyorlik paneli, Telegram eslatma boti |
| 6 | 50–100 talaba bilan yopiq beta, analitika, xatolarni tuzatish |

## Muvaffaqiyat o'lchovlari (beta)

- Talabalarning qancha qismi o'z materialini yuklayapti.
- Sessiya davomida 3+ kun qaytib kelganlar ulushi.
- Imtihondan keyingi so'rov: "Yordam berdimi? Keyingi sessiyada pul to'laysizmi?"

## Narx gipotezasi

Foydalanish mavsumiy bo'lgani uchun oylik obuna o'rniga "Sessiya paketi" (bir sessiya uchun bir martalik to'lov, so'mda) sinab ko'riladi.

## Xavflar

- **AI xarajati:** keshlash va kunlik limit.
- **O'zbekcha AI sifati:** haqiqiy ma'ruza materiallarida oldindan sinash.
- **Mavsumiylik:** oraliq nazoratlarni ham qamrab olish.
- **Shaxsiy materiallar:** yuklanganlar standart holatda faqat egasiga ko'rinadi.

## Kontekst: raqobatchilar (2026-10-28 izlanishi)

Quizlet, Knowt, Gizmo, StudyFetch, NotebookLM; mahalliy bozorda Makon AI (SAT, AQSh bozori) va Oliygoh.uz (DTM testlari). O'zbek tilidagi, mahalliy imtihonlarga moslangan AI tayyorlov dasturi hozircha deyarli bo'sh joy.
