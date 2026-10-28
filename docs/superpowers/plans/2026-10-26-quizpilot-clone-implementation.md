# QuizPilot.io Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-fidelity, fully functional web application clone of QuizPilot.io with AI quiz generation, 3D flashcards, smart notes, exam simulator, bilingual support (Uzbek & English), and local storage persistence.

**Architecture:** Client-side React 19 + TypeScript Single Page Application (SPA) powered by Vite and Tailwind CSS. Employs direct Google Gemini API integration with an intelligent deterministic fallback generator, in-browser PDF text parsing via `pdfjs-dist`, and reactive LocalStorage persistence for user study sets and statistics.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, pdfjs-dist, Google Gemini API (or REST fallback).

**Spec:** `docs/superpowers/specs/2026-10-26-quizpilot-clone-design.md`

## Global Constraints

- **Node/Runtime:** Node.js v24+ compatible
- **Styling & Fonts:** Tailwind CSS v3/v4 with custom QuizPilot theme tokens (`hsl(40 30% 95%)` background, `DM Serif Text` font for headings, `Inter` for body)
- **Bilingual i18n:** Must provide seamless toggle between Uzbek (`uz`) and English (`en`) across every screen and component
- **Graceful Degradation:** The application MUST function 100% smoothly even without a Gemini API key (using built-in smart mock generation)
- **Zero build errors:** `npm run build` must succeed with zero TypeScript or bundling errors

---

### Task 1: Project Scaffolding & Design System Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/main.tsx`
- Create: `src/types/index.ts`

**Interfaces:**
- Produces: Base theme classes (`bg-paper`, `font-serif`, `text-charcoal`, `accent-quiz`, etc.), TypeScript interfaces (`StudySet`, `QuizQuestion`, `Flashcard`, `StudyNote`), and functioning Vite development server.

- [ ] **Step 1: Create package.json and configuration files**
  Configure dependencies including `react`, `react-dom`, `lucide-react`, `pdfjs-dist`, `clsx`, `tailwind-merge`, `tailwindcss`, `vite`.
- [ ] **Step 2: Setup index.html with Google Fonts**
  Include `DM Serif Text` and `Inter` fonts from Google Fonts, favicon, and correct meta headers matching QuizPilot.io.
- [ ] **Step 3: Setup Tailwind CSS configuration and custom color tokens**
  Define `--background`, `--card`, `--border`, `--quiz`, `--flashcard`, `--notes`, `--exam` color variables and fonts in `tailwind.config.js` and `src/index.css`.
- [ ] **Step 4: Define TypeScript core types in `src/types/index.ts`**
  Add schemas for `QuizQuestion`, `Flashcard`, `StudyNote`, `StudySet`, `UserStats`, and `Language`.
- [ ] **Step 5: Run npm install and verify compilation**
  Run `npm install` and verify Vite compiles successfully.

---

### Task 2: Internationalization (i18n) & Local Storage Engine

**Files:**
- Create: `src/lib/i18n.ts`
- Create: `src/lib/storage.ts`
- Create: `src/lib/sampleData.ts`

**Interfaces:**
- Produces:
  - `useTranslation(lang)` or `t(key, lang)` translator with complete Uzbek and English translations.
  - `getStudySets()`, `saveStudySet()`, `deleteStudySet()`, `getUserStats()`, `updateUserStats()`, `getApiKey()`, `setApiKey()` storage helpers.
  - Pre-populated high-quality study sets for Biology, World History, and Web Development.

- [ ] **Step 1: Implement `src/lib/i18n.ts`**
  Provide comprehensive translation keys for navigation, hero, creation options, quiz runner, flashcards, exam simulator, notes, and settings in Uzbek and English.
- [ ] **Step 2: Implement `src/lib/storage.ts`**
  Provide local storage CRUD operations for study sets, exam attempts, user study streaks, and API key management with sample dataset initialization on first run.
- [ ] **Step 3: Implement `src/lib/sampleData.ts`**
  Add default sample sets: "Cell Biology & Energy", "O'zbekiston Tarixi Asoslari / World History", and "JavaScript & React Mastery" with questions, flashcards, and notes.

---

### Task 3: AI Engine & In-Browser PDF Parser

**Files:**
- Create: `src/lib/pdfParser.ts`
- Create: `src/lib/ai.ts`

**Interfaces:**
- Produces:
  - `extractTextFromPdf(file: File): Promise<string>`
  - `generateStudyMaterial(promptOrText: string, type: StudySetType, options: GenerationOptions): Promise<StudySetPayload>`

- [ ] **Step 1: Implement `src/lib/pdfParser.ts`**
  Use `pdfjs-dist` to parse uploaded PDF files on the client side and extract text paragraphs.
- [ ] **Step 2: Implement `src/lib/ai.ts` with Gemini API & Smart Fallback**
  - Connect to Google Gemini API using structured JSON output prompts.
  - Implement deterministic Smart Fallback generator that parses keywords, headers, and sentences from user text or topic prompts to generate contextual multiple-choice questions, flashcards, and summary notes if no Gemini API key is provided or if network fails.

---

### Task 4: UI Component Library & Shared Layout

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/ApiKeyModal.tsx`

**Interfaces:**
- Produces: Reusable UI design elements styled with QuizPilot's warm aesthetic, responsive navbar with logo, navigation links, Language Switcher, Dark Mode toggle, and API Key modal.

- [ ] **Step 1: Build primitive UI components (`Button`, `Card`, `Badge`, `Modal`)**
  Ensure button variants (primary, secondary, outline, ghost), card styles with subtle borders, and modal dialogs.
- [ ] **Step 2: Build `Navbar` & `Footer`**
  Include QuizPilot paper-plane brand logo, links to `/dashboard`, `/quizzes-ai`, `/flashcards-ai`, `/ai-notes`, `/exam-simulator`, language toggle, and "Get Started" button.
- [ ] **Step 3: Build `ApiKeyModal`**
  Allow users to enter their Google Gemini API key or use the built-in Smart AI mode without a key, test the connection, and save locally.

---

### Task 5: QuizPilot Landing Page

**Files:**
- Create: `src/components/landing/Hero.tsx`
- Create: `src/components/landing/QuickInputBox.tsx`
- Create: `src/components/landing/FeatureShowcase.tsx`
- Create: `src/components/landing/HowItWorks.tsx`
- Create: `src/components/landing/Testimonials.tsx`
- Create: `src/components/landing/Pricing.tsx`
- Create: `src/components/landing/Faq.tsx`
- Create: `src/pages/LandingPage.tsx`

**Interfaces:**
- Produces: High-converting, pixel-faithful QuizPilot.io landing page with live interactive quick-generation input, animated tabs, pricing plans, and FAQ accordion.

- [ ] **Step 1: Build `Hero` & `QuickInputBox`**
  Feature the DM Serif Text title "Turn Any Content Into Quizzes, Flashcards, Notes & Exams", trust badges, and an interactive input area with Paste Text, Upload PDF, and YouTube URL tabs.
- [ ] **Step 2: Build `FeatureShowcase`**
  Create interactive tabs for Quizzes, Flashcards, Notes, and Exam Simulator with live interactive preview cards.
- [ ] **Step 3: Build `HowItWorks`, `Testimonials`, `Pricing`, and `Faq`**
  Match the exact structure, copy, and layout of QuizPilot.io.
- [ ] **Step 4: Assemble `LandingPage.tsx`**
  Combine all landing sections with smooth scrolling and animations.

---

### Task 6: Study Dashboard

**Files:**
- Create: `src/components/dashboard/StudyStats.tsx`
- Create: `src/components/dashboard/SetCard.tsx`
- Create: `src/pages/DashboardPage.tsx`

**Interfaces:**
- Produces: Complete user command center showing study streak, completion metrics, quick creation buttons, and filterable library of study sets.

- [ ] **Step 1: Build `StudyStats`**
  Show cards for Daily Streak (days), Sets Mastered, Questions Answered, and Study Time.
- [ ] **Step 2: Build `SetCard` and library filters**
  Render sets with subject badges, question counts, difficulty, last practiced date, and launch/delete buttons.
- [ ] **Step 3: Implement `DashboardPage.tsx`**
  Integrate stats, search bar, category tabs (All, Quizzes, Flashcards, Notes, Exams), and empty-state guidance.

---

### Task 7: AI Creation Studio (Content Ingestion & Customization)

**Files:**
- Create: `src/components/creation/CreationModal.tsx`
- Create: `src/components/creation/ContentUploader.tsx`

**Interfaces:**
- Produces: Universal creation interface allowing users to upload PDFs, paste notes, enter video links, configure questions/cards, and trigger AI generation with a loading spinner.

- [ ] **Step 1: Build `ContentUploader`**
  Support Drag-and-drop PDF upload with client-side text parsing, raw text paste, YouTube URL link parser, and quick sample topic buttons.
- [ ] **Step 2: Build Generation Controls**
  Allow selecting question count (5, 10, 15, 20), difficulty level, question format, and target language.
- [ ] **Step 3: Connect to `ai.ts` and handle loading state**
  Display animated progress indicator ("Analyzing content...", "Formulating questions...", "Polishing explanations...").

---

### Task 8: Interactive Study Experiences (Quiz Runner, 3D Flashcards, AI Notes, Exam Simulator)

**Files:**
- Create: `src/components/study/QuizRunner.tsx`
- Create: `src/components/study/FlashcardPlayer.tsx`
- Create: `src/components/study/NotesViewer.tsx`
- Create: `src/components/study/ExamSimulator.tsx`
- Create: `src/pages/QuizzesPage.tsx`
- Create: `src/pages/FlashcardsPage.tsx`
- Create: `src/pages/NotesPage.tsx`
- Create: `src/pages/ExamPage.tsx`

**Interfaces:**
- Produces:
  - Real-time quiz runner with timer, hint button, instant feedback, and score analysis.
  - 3D CSS flip-card player with Active Recall rating (Again, Hard, Good, Easy) and keyboard navigation.
  - Clean markdown notes viewer with glossary table and copy/print controls.
  - Timed exam simulator with strict question grid and comprehensive exam diagnostics.

- [ ] **Step 1: Implement `QuizRunner.tsx` & `QuizzesPage.tsx`**
  Question options with instant green/red styling, AI Hint modal, detailed Explanation drawer, score summary with retake option.
- [ ] **Step 2: Implement `FlashcardPlayer.tsx` & `FlashcardsPage.tsx`**
  Realistic 3D transform card flip, front/back cards, spaced-repetition rating buttons, keyboard shortcuts (Space to flip, arrows to navigate).
- [ ] **Step 3: Implement `NotesViewer.tsx` & `NotesPage.tsx`**
  Render structured summaries, key definitions table, bullet points, and copy/export buttons.
- [ ] **Step 4: Implement `ExamSimulator.tsx` & `ExamPage.tsx`**
  Strict timed exam mode, question jump palette, submit confirmation, and diagnostic report card.

---

### Task 9: Routing, Integration & Build Verification

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces: Integrated SPA router connecting Landing Page, Dashboard, Quiz Studio, Flashcard Deck, Notes, and Exam Simulator with state persistence, theme switching, and language toggle.

- [ ] **Step 1: Wire client-side routing in `App.tsx`**
  Support route switching (`/`, `/dashboard`, `/quizzes-ai`, `/flashcards-ai`, `/ai-notes`, `/exam-simulator`) with smooth transitions.
- [ ] **Step 2: Connect global state (Language, Theme, Active Set, API Key)**
  Ensure changing language updates the entire UI immediately and theme toggle applies dark mode classes properly.
- [ ] **Step 3: Build verification and QA**
  Run `npm run build` and ensure zero errors or warnings.
- [ ] **Step 4: End-to-end smoke test**
  Verify generating a quiz from text, taking the quiz, flipping flashcards, viewing notes, taking an exam, and saving results.
