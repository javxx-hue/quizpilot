export type Language = 'uz' | 'en';

export const translations = {
  uz: {
    // Brand
    brandName: 'QuizPilot',
    brandTagline: 'AI asosidagi o\'quv platformasi',
    
    // Navigation
    nav: {
      features: 'Imkoniyatlar',
      quizzes: 'AI Testlar',
      flashcards: 'Flesh-kartalar',
      notes: 'Xulosa & Qaydlar',
      examSimulator: 'Imtihon Simulyatori',
      dashboard: 'Kabinet',
      pricing: 'Tariflar',
      faq: 'Savol-Javob',
      signIn: 'Kirish',
      getStarted: 'Boshlash',
      apiKey: 'API Kalit',
    },

    // Hero
    hero: {
      badge: '✨ Talabalar va mutaxassislar uchun AI o\'quv quroli',
      titleStart: 'Ixtiyoriy materialni ',
      titleHighlight: 'Testlar, Flesh-kartalar,',
      titleEnd: ' Qaydlar va Imtihonlarga aylantiring',
      subtitle: 'PDF kitoblar, konspektlar, darsliklar yoki YouTube videolarini bir necha soniyada interaktiv test va eslab qolish kartochkalariga aylantiring.',
      ctaPrimary: 'Bepul test yaratish',
      ctaSecondary: 'Demo sinab ko\'rish',
      stats: {
        students: '50,000+ o\'rganuvchilar',
        questions: '2.5M+ yechilgan savollar',
        satisfaction: '98% ijobiy baho',
      },
    },

    // Quick Input Box on Hero
    quickInput: {
      tabText: 'Matn kiritish',
      tabPdf: 'PDF yuklash',
      tabVideo: 'YouTube havola',
      tabTopic: 'Mavzu bo\'yicha',
      placeholderText: 'O\'rganmoqchi bo\'lgan konspektingiz yoki maqolangizni bu yerga joylang...',
      placeholderVideo: 'YouTube video havolasini kiriting (masalan: https://youtube.com/watch?v=...)',
      placeholderTopic: 'Masalan: "Hujayra biologiyasi", "Jahon iqtisodiyoti", "Python dasturlash"',
      dropPdfHere: 'PDF faylni bu yerga tashlang yoki tanlang',
      pdfSelected: 'tanlandi',
      generateBtn: 'AI bilan yaratish',
      generating: 'Generatsiya qilinmoqda...',
      samplePrompts: 'Yoki namunani sinab ko\'ring:',
      sample1: 'Fotosintez jarayoni',
      sample2: 'Temuriylar davlati tarixi',
      sample3: 'JavaScript async/await',
    },

    // Feature Showcase
    features: {
      title: 'Aqlliroq va tezroq o\'rganish uchun to\'liq to\'plam',
      subtitle: 'Bir xil materialni turli o\'rganish usullari orqali o\'zlashtiring va xotirada mustahkamlang.',
      quizTab: 'AI Testlar',
      quizDesc: 'Har bir javob uchun maslahatlar (hints) va batafsil izohlar bilan avtomatik testlar.',
      flashcardsTab: 'Flesh-kartalar',
      flashcardsDesc: 'Aktiv eslash (active recall) va intervalli takrorlashga asoslangan 3D aylanuvchi kartalar.',
      notesTab: 'Strukturaviy Qaydlar',
      notesDesc: 'Murakkab matnlardan eng muhim ta\'riflar, jadvallar va xulosalarni ajratib beruvchi aqlli konspekt.',
      examTab: 'Imtihon Simulyatori',
      examDesc: 'Haqiqiy imtihon bosimini his qilish uchun taymerli, qat\'iy sinov rejimi.',
      tryFeature: 'Ushbu rejimni sinash →',
    },

    // How It Works
    howItWorks: {
      badge: 'Jarayon qanday ishlaydi',
      title: '3 ta oddiy qadamda bilimingizni mustahkamlang',
      step1Title: 'Materialni kiriting',
      step1Desc: 'PDF darslik, dars konspekti yoki video havolasini yuklang.',
      step2Title: 'AI darhol tahlil qiladi',
      step2Desc: 'Gemini AI muhim tushunchalarni ajratib, savollar va xulosalarni shakllantiradi.',
      step3Title: 'Interaktiv o\'rganing',
      step3Desc: 'Test yeching, kartalarni takrorlang va o\'zlashtirish foizingizni oshiring.',
    },

    // Pricing
    pricing: {
      badge: 'Qulay narxlar',
      title: 'O\'zingizga mos tarifni tanlang',
      subtitle: 'Barcha asosiy imkoniyatlar bepul. Kengaytirilgan imkoniyatlar uchun chegirmalar mavjud.',
      monthly: 'Oylik',
      yearly: 'Yillik (20% chegirma)',
      freeTitle: 'Boshlang\'ich',
      freePrice: '$0',
      freeDesc: 'Yangi boshlovchilar va mustaqil o\'rganuvchilar uchun',
      freeFeature1: 'Cheksiz matn kiritish',
      freeFeature2: 'Kuniga 10 tagacha AI test generatsiyasi',
      freeFeature3: '3D flesh-karta rejimi',
      freeFeature4: 'Lokal saqlash va statistika',
      proTitle: 'Pro Talaba',
      proPrice: '$7',
      proDesc: 'Imtihonlarga jiddiy tayyorgarlik ko\'ruvchilar uchun',
      proFeature1: 'Katta hajmdagi PDF fayllarni tahlil qilish',
      proFeature2: 'Cheksiz AI Quiz & Flashcard generatsiyasi',
      proFeature3: 'To\'liq Imtihon Simulyatori va tahlillar',
      proFeature4: 'PDF va Markdown eksporti',
      institutionTitle: 'Universitet / Jamoa',
      institutionPrice: '$29',
      institutionDesc: 'O\'qituvchilar va o\'quv guruhlari uchun',
      btnFree: 'Bepul boshlash',
      btnPro: 'Pro rejimga o\'tish',
      btnInstitution: 'Jamoani ulash',
    },

    // FAQ
    faq: {
      badge: 'Ko\'p beriladigan savollar',
      title: 'QuizPilot haqida savollaringiz bormi?',
      q1: 'QuizPilot qanday materiallarni qo\'llab-quvvatlaydi?',
      a1: 'Siz istalgan tildagi matnlarni, darslik konspektlarini, PDF hujjatlarni yoki YouTube video havolalarini yuklashingiz mumkin. AI bularning barchasini tushunadi.',
      q2: 'O\'zbek tilidagi materiallar bilan ham ishlaydimi?',
      a2: 'Ha! QuizPilot o\'zbek, ingliz, rus va boshqa 50 dan ortiq tillardagi matnlarni to\'liq tahlil qilib, o\'sha tilda yuqori sifatli savollar va flesh-kartalar tuzadi.',
      q3: 'Gemini API kaliti kiritish majburiymi?',
      a3: 'Yo\'q, majburiy emas! Saytda ichki aqlli generator ham mavjud bo\'lib, u API kalitisiz ham ajoyib savollar tuzib beradi. Agar shaxsiy Gemini kalitingizni kiritsangiz, imkoniyatlar yanada kengayadi.',
      q4: 'Yaratilgan to\'plamlarim qayerda saqlanadi?',
      a4: 'Barcha to\'plamlaringiz brauzeringizning xavfsiz xotirasida (LocalStorage) avtomatik saqlanib boradi. Shuningdek ularni JSON shaklida yuklab olishingiz ham mumkin.',
    },

    // Dashboard
    dashboard: {
      title: 'Mening O\'quv Kabinetim',
      subtitle: 'O\'rganish natijalaringiz va to\'plamlaringiz',
      createBtn: 'Yangi to\'plam yaratish',
      streak: 'Kunlik o\'rganish zanjiri',
      streakDays: 'kun',
      quizzesTaken: 'Yechilgan testlar',
      cardsMastered: 'Yodlangan kartalar',
      avgScore: 'O\'rtacha natija',
      searchPlaceholder: 'To\'plamlarni qidirish...',
      tabAll: 'Barchasi',
      tabQuizzes: 'Testlar',
      tabFlashcards: 'Flesh-kartalar',
      tabNotes: 'Qaydlar',
      tabExams: 'Imtihonlar',
      emptyTitle: 'Hozircha to\'plamlar yo\'q',
      emptyDesc: 'Birinchi to\'plamingizni yarating yoki namunaviy to\'plamlardan foydalaning.',
      startPractice: 'Boshlash',
      deleteConfirm: 'Ushbu to\'plamni o\'chirmoqchimisiz?',
      sampleBadge: 'Namuna',
    },

    // Study - Quiz Runner
    quiz: {
      question: 'Savol',
      of: '/',
      timeRemaining: 'Qolgan vaqt',
      needHint: 'AI Maslahat olish',
      hintTitle: 'Maslahat',
      explanationTitle: 'Batafsil izoh',
      nextQuestion: 'Keyingi savol',
      finishQuiz: 'Testni yakunlash',
      correctToast: 'To\'g\'ri javob! Barakalla! 🎉',
      incorrectToast: 'Noto\'g\'ri javob. Tushuntirishni o\'qib chiqing.',
      resultsTitle: 'Test Yakunlandi!',
      score: 'Sizning natijangiz',
      passed: 'Ajoyib natija! Siz bu mavzuni yaxshi o\'zlashtirdingiz!',
      needImprovement: 'Yaxshi urinish! Noto\'g\'ri javoblar ustida yana bir bor ishlang.',
      retake: 'Qaytadan topshirish',
      backToDashboard: 'Kabinetga qaytish',
      reviewAnswers: 'Javoblarni ko\'rib chiqish',
    },

    // Study - Flashcards
    flashcards: {
      card: 'Karta',
      flipHint: 'Karta orqasini ko\'rish uchun bosing yoki Space tugmasini bosing',
      flipBtn: 'Aylantirish',
      fullscreen: 'To\'liq ekran',
      shuffle: 'Aralashtirish',
      reset: 'Boshidan boshlash',
      ratings: {
        again: 'Qayta (Again)',
        hard: 'Qiyin (Hard)',
        good: 'Yaxshi (Good)',
        easy: 'Oson (Easy)',
      },
      completedTitle: 'Barcha kartalar takrorlandi!',
      completedDesc: 'Siz ushbu to\'plamdagi barcha kartalarni ko\'rib chiqdingiz.',
      studyAgain: 'Yana o\'rganish',
    },

    // Study - Exam Simulator
    exam: {
      title: 'Imtihon Simulyatori',
      timerDesc: 'Qat\'iy taymer rejimi. Javoblar faqat imtihon topshirilgandan keyin ko\'rsatiladi.',
      questionList: 'Savollar ro\'yxati',
      flagged: 'Belgilangan',
      flagQuestion: 'Keyinroq ko\'rish uchun belgilash',
      submitExam: 'Imtihonni topshirish',
      confirmSubmitTitle: 'Imtihonni yakunlamoqchimisiz?',
      confirmSubmitDesc: 'Belgilanmagan yoki javob berilmagan savollaringiz qolgan bo\'lishi mumkin.',
      timeOutTitle: 'Vaqt tugadi!',
      diagnosticsTitle: 'Imtihon Tashxisi & Natijalar',
      passedBadge: 'Muvaffaqiyatli',
      failedBadge: 'Qayta topshirish kerak',
      weakSpots: 'Kuchaytirish lozim bo\'lgan sohalar',
    },

    // Study - Notes
    notes: {
      title: 'Strukturaviy O\'quv Qaydlari',
      executiveSummary: 'Qisqacha mazmun (Summary)',
      keyDefinitions: 'Asosiy tushunchalar va ta\'riflar',
      bulletPoints: 'Muhim eslatmalar',
      copyNotes: 'Nusxa olish',
      copied: 'Nusxalandi!',
      print: 'Chop etish / PDF saqlash',
    },

    // Creation Modal
    creation: {
      modalTitle: 'Yangi O\'quv To\'plami Yaratish',
      sourceType: 'Material manbasi',
      sourceText: 'Matn',
      sourcePdf: 'PDF Fayl',
      sourceYoutube: 'YouTube Video',
      sourceTopic: 'Mavzu / Savol',
      titleInput: 'To\'plam nomi (ixtiyoriy)',
      titlePlaceholder: 'Masalan: Hujayra bo\'linishi va mitoz',
      studyType: 'Yaratiladigan material turi',
      typeQuiz: 'AI Test',
      typeFlashcards: 'Flesh-kartalar',
      typeNotes: 'Qaydlar & Konspekt',
      typeExam: 'Imtihon Simulyatori',
      optionsTitle: 'Qo\'shimcha sozlamalar',
      countLabel: 'Savollar soni',
      difficultyLabel: 'Murakkablik darajasi',
      diffEasy: 'Oson',
      diffMedium: 'O\'rta',
      diffHard: 'Qiyin',
      langLabel: 'Material tili',
      submitBtn: 'Materialni yaratish',
      creatingWait: 'AI materialingizni tayyorlamoqda...',
    },

    // Settings Modal
    settings: {
      title: 'Sozlamalar & AI Kaliti',
      geminiKeyLabel: 'Google Gemini API Kaliti',
      geminiKeyPlaceholder: 'AIzaSy...',
      geminiHelp: 'Kalit brauzeringizda saqlanadi va faqat Google Gemini API\'ga yuboriladi.',
      getKeyLink: 'Google AI Studio orqali bepul kalit olish →',
      saveBtn: 'Saqlash',
      smartModeNote: 'Beta davrida AI generatsiya uchun shaxsiy Gemini API kaliti kerak. Keyingi bosqichda kalit serverga ko\'chiriladi.',
      keySaved: 'API kalit muvaffaqiyatli saqlandi!',
    },

    // Footer
    footer: {
      desc: 'Har qanday o\'quv materialini soniyalar ichida testlar, flesh-kartalar va imtihonlarga aylantiring.',
      product: 'Mahsulot',
      legal: 'Huquqiy',
      privacy: 'Maxfiylik siyosati',
      terms: 'Foydalanish shartlari',
      contact: 'Aloqa',
      copyright: '© 2026 QuizPilot. Barcha huquqlar himoyalangan.',
    },
  },

  en: {
    // Brand
    brandName: 'QuizPilot',
    brandTagline: 'AI-Powered Study Platform',
    
    // Navigation
    nav: {
      features: 'Features',
      quizzes: 'AI Quizzes',
      flashcards: 'Flashcards',
      notes: 'AI Notes',
      examSimulator: 'Exam Simulator',
      dashboard: 'Dashboard',
      pricing: 'Pricing',
      faq: 'FAQ',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      apiKey: 'API Key',
    },

    // Hero
    hero: {
      badge: '✨ AI Study Assistant for Students & Learners',
      titleStart: 'Turn Any Content Into ',
      titleHighlight: 'Quizzes, Flashcards,',
      titleEnd: ' Notes & Exams',
      subtitle: 'Quizpilot uses AI to turn any PDF, lecture notes, text, or video into quizzes, flashcards, notes & exams. Focus on weak spots and learn smarter.',
      ctaPrimary: 'Create Free Quiz',
      ctaSecondary: 'Try Interactive Demo',
      stats: {
        students: '50,000+ Students',
        questions: '2.5M+ Questions Solved',
        satisfaction: '98% Satisfaction',
      },
    },

    // Quick Input Box on Hero
    quickInput: {
      tabText: 'Paste Text',
      tabPdf: 'Upload PDF',
      tabVideo: 'YouTube URL',
      tabTopic: 'By Topic',
      placeholderText: 'Paste your lecture notes, study guide, or article here...',
      placeholderVideo: 'Paste a YouTube video link to study from (e.g., https://youtube.com/watch?v=...)',
      placeholderTopic: 'e.g., "Cellular Respiration", "Machine Learning Basics", "World War II Timeline"',
      dropPdfHere: 'Drop your PDF here or browse files',
      pdfSelected: 'selected',
      generateBtn: 'Generate with AI',
      generating: 'Generating study kit...',
      samplePrompts: 'Or try a sample:',
      sample1: 'Photosynthesis Process',
      sample2: 'Ancient Rome History',
      sample3: 'JavaScript Async/Await',
    },

    // Feature Showcase
    features: {
      title: 'Your all-in-one AI study toolkit',
      subtitle: 'Master any subject faster through active recall, smart repetition, and diagnostic exams.',
      quizTab: 'AI Quizzes',
      quizDesc: 'Custom multiple choice and true/false practice with hints and instant step-by-step explanations.',
      flashcardsTab: 'Flashcards',
      flashcardsDesc: '3D interactive cards with spaced repetition ratings (Again, Hard, Good, Easy) for fast memorization.',
      notesTab: 'Structured Notes',
      notesDesc: 'Transforms disorganized lectures into bullet points, key definitions, and actionable takeaways.',
      examTab: 'Exam Simulator',
      examDesc: 'Simulates real-world exam conditions with countdown timers and post-exam diagnostics.',
      tryFeature: 'Try this feature →',
    },

    // How It Works
    howItWorks: {
      badge: 'How It Works',
      title: 'Master your subjects in 3 simple steps',
      step1Title: 'Upload Any Material',
      step1Desc: 'Drop in PDFs, paste raw notes, or paste a video URL.',
      step2Title: 'AI Generates Study Kits',
      step2Desc: 'Gemini AI distills key definitions, tests, and flashcards in seconds.',
      step3Title: 'Practice & Excel',
      step3Desc: 'Reinforce memory through active recall and target your weak spots.',
    },

    // Pricing
    pricing: {
      badge: 'Transparent Pricing',
      title: 'Plans for every type of student',
      subtitle: 'Start free and upgrade anytime as your exam prep needs grow.',
      monthly: 'Monthly',
      yearly: 'Yearly (20% off)',
      freeTitle: 'Starter',
      freePrice: '$0',
      freeDesc: 'Perfect for quick homework reviews and independent study',
      freeFeature1: 'Unlimited text pastes',
      freeFeature2: 'Up to 10 AI study generations daily',
      freeFeature3: '3D interactive flashcards',
      freeFeature4: 'Local storage & streak tracking',
      proTitle: 'Pro Scholar',
      proPrice: '$7',
      proDesc: 'For dedicated students preparing for finals and board exams',
      proFeature1: 'Deep multi-page PDF document analysis',
      proFeature2: 'Unlimited AI quizzes & flashcards',
      proFeature3: 'Full Exam Simulator & diagnostics',
      proFeature4: 'Export to PDF & Markdown',
      institutionTitle: 'Educator & Teams',
      institutionPrice: '$29',
      institutionDesc: 'For classrooms, study groups, and tutors',
      btnFree: 'Start Free',
      btnPro: 'Upgrade to Pro',
      btnInstitution: 'Contact Team',
    },

    // FAQ
    faq: {
      badge: 'Frequently Asked Questions',
      title: 'Got questions? We have answers',
      q1: 'What materials can I feed into QuizPilot?',
      a1: 'You can input textbooks, lecture transcripts, research PDFs, raw class notes, or YouTube video links. Our AI parses them into quizzes and flashcards instantly.',
      q2: 'Does it support multiple languages?',
      a2: 'Yes! QuizPilot fully supports English, Uzbek, Spanish, German, French, and over 50 other languages.',
      q3: 'Do I need a Google Gemini API key?',
      a3: 'No! QuizPilot comes with an integrated smart generation engine that works right out of the box. Adding your own free Gemini key provides custom generative AI depth.',
      q4: 'Where are my study sets stored?',
      a4: 'All your study sets and exam scores are securely preserved directly inside your browser storage. You can also export them as JSON anytime.',
    },

    // Dashboard
    dashboard: {
      title: 'My Study Dashboard',
      subtitle: 'Track your progress and access your study materials',
      createBtn: 'Create New Set',
      streak: 'Study Streak',
      streakDays: 'days',
      quizzesTaken: 'Quizzes Taken',
      cardsMastered: 'Cards Mastered',
      avgScore: 'Average Score',
      searchPlaceholder: 'Search your sets...',
      tabAll: 'All Sets',
      tabQuizzes: 'Quizzes',
      tabFlashcards: 'Flashcards',
      tabNotes: 'Notes',
      tabExams: 'Exams',
      emptyTitle: 'No study sets yet',
      emptyDesc: 'Create your first set using AI or practice with our curated sample decks.',
      startPractice: 'Practice Now',
      deleteConfirm: 'Are you sure you want to delete this set?',
      sampleBadge: 'Sample',
    },

    // Study - Quiz Runner
    quiz: {
      question: 'Question',
      of: 'of',
      timeRemaining: 'Time left',
      needHint: 'Need a hint?',
      hintTitle: 'AI Hint',
      explanationTitle: 'Explanation',
      nextQuestion: 'Next Question',
      finishQuiz: 'Finish Quiz',
      correctToast: 'Correct! Well done! 🎉',
      incorrectToast: 'Not quite. Review the explanation below.',
      resultsTitle: 'Quiz Complete!',
      score: 'Your Score',
      passed: 'Excellent job! You have a solid grasp of this material.',
      needImprovement: 'Good effort! Review your weak spots and give it another shot.',
      retake: 'Retake Quiz',
      backToDashboard: 'Back to Dashboard',
      reviewAnswers: 'Review Answers',
    },

    // Study - Flashcards
    flashcards: {
      card: 'Card',
      flipHint: 'Click card or press Space to flip',
      flipBtn: 'Flip Card',
      fullscreen: 'Fullscreen',
      shuffle: 'Shuffle',
      reset: 'Restart Deck',
      ratings: {
        again: 'Again',
        hard: 'Hard',
        good: 'Good',
        easy: 'Easy',
      },
      completedTitle: 'Deck Completed!',
      completedDesc: 'You have reviewed all flashcards in this deck.',
      studyAgain: 'Study Again',
    },

    // Study - Exam Simulator
    exam: {
      title: 'Exam Simulator',
      timerDesc: 'Strict timed test conditions. Instant feedback is hidden until you submit.',
      questionList: 'Questions Matrix',
      flagged: 'Flagged',
      flagQuestion: 'Flag for review',
      submitExam: 'Submit Exam',
      confirmSubmitTitle: 'Ready to submit your exam?',
      confirmSubmitDesc: 'You still have unanswered or flagged questions. Do you want to submit now?',
      timeOutTitle: 'Time is up!',
      diagnosticsTitle: 'Diagnostic Exam Report',
      passedBadge: 'Passed',
      failedBadge: 'Needs Practice',
      weakSpots: 'Identified Weak Areas',
    },

    // Study - Notes
    notes: {
      title: 'Structured Study Notes',
      executiveSummary: 'Executive Summary',
      keyDefinitions: 'Key Terms & Definitions',
      bulletPoints: 'Core Takeaways',
      copyNotes: 'Copy Notes',
      copied: 'Copied to clipboard!',
      print: 'Print / Save as PDF',
    },

    // Creation Modal
    creation: {
      modalTitle: 'Create New Study Kit',
      sourceType: 'Content Source',
      sourceText: 'Paste Text',
      sourcePdf: 'PDF Document',
      sourceYoutube: 'YouTube Link',
      sourceTopic: 'Prompt / Topic',
      titleInput: 'Set Title (optional)',
      titlePlaceholder: 'e.g., Cellular Mitosis and ATP Synthesis',
      studyType: 'Material to generate',
      typeQuiz: 'AI Quiz',
      typeFlashcards: 'Flashcards',
      typeNotes: 'Summary Notes',
      typeExam: 'Exam Simulator',
      optionsTitle: 'Configuration',
      countLabel: 'Number of items',
      difficultyLabel: 'Difficulty Level',
      diffEasy: 'Easy',
      diffMedium: 'Medium',
      diffHard: 'Hard',
      langLabel: 'Target Language',
      submitBtn: 'Generate Kit',
      creatingWait: 'Analyzing content & generating kit...',
    },

    // Settings Modal
    settings: {
      title: 'Settings & Gemini AI Key',
      geminiKeyLabel: 'Google Gemini API Key',
      geminiKeyPlaceholder: 'AIzaSy...',
      geminiHelp: 'Your key is stored in your browser and sent only to the Google Gemini API.',
      getKeyLink: 'Get a free key from Google AI Studio →',
      saveBtn: 'Save Key',
      smartModeNote: 'During the beta, AI generation needs your own Gemini API key. It will move to the server in the next phase.',
      keySaved: 'API key saved successfully!',
    },

    // Footer
    footer: {
      desc: 'Turn any educational content into interactive quizzes, flashcards, and exam prep in seconds with AI.',
      product: 'Product',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact Us',
      copyright: '© 2026 QuizPilot.io. All rights reserved.',
    },
  },
};

export function getTranslations(lang: Language) {
  return translations[lang] || translations.uz;
}
