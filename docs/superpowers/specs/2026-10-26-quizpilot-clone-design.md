# QuizPilot.io Clone - Architecture & Design Specification

**Date:** 2026-10-26  
**Status:** Approved  
**Target:** High-fidelity interactive clone of [quizpilot.io](https://quizpilot.io)  
**Authors:** Pair-programming Antigravity Agent & User  

---

## 1. Executive Summary & Product Vision

QuizPilot is an AI-powered study platform designed to transform learning materials (PDF documents, lecture notes, raw text, and video links) into active recall study tools: interactive quizzes, 3D flashcard decks, structured notes, and timed exam simulations.

This project delivers a responsive, high-performance web application recreating the exact visual aesthetic, typography, brand feel, and functionality of QuizPilot.io, enhanced with bilingual support (Uzbek & English), Google Gemini AI integration, local client-side PDF parsing, and persistent browser storage.

---

## 2. Visual Identity & Design System

The application faithfully mirrors the editorial aesthetic of QuizPilot.io:

### 2.1 Color Tokens
- **Backgrounds:**
  - Base Background: `hsl(40, 30%, 95%)` (`#FAF7EE` warm paper)
  - Card & Container Surface: `hsl(45, 100%, 98%)` (`#FFFEF9` ivory)
  - Muted Surface: `hsl(38, 25%, 92%)` (`#F3EFE4`)
- **Text & Foreground:**
  - Primary Text: `hsl(0, 0%, 10%)` (`#1A1A1A` charcoal black)
  - Muted Text: `hsl(0, 0%, 40%)` (`#666666`)
  - Border: `hsl(38, 22%, 86%)` (`#E5DFD3`)
- **Feature Identity Accents:**
  - **Quizzes:** Lime/Sage Green `hsl(80, 55%, 60%)` / Strong: `hsl(80, 55%, 38%)`
  - **Flashcards:** Sky Blue `hsl(220, 50%, 72%)` / Strong: `hsl(220, 50%, 50%)`
  - **AI Notes:** Warm Amber `hsl(43, 98%, 70%)` / Strong: `hsl(43, 80%, 42%)`
  - **Exam Simulator:** Rose Pink `hsl(330, 55%, 75%)` / Strong: `hsl(330, 55%, 48%)`
  - **Highlight Orange:** `hsl(24, 95%, 53%)`
- **Dark Mode Support:**
  - Background: `hsl(240, 5%, 11%)`
  - Card: `hsl(240, 5%, 14%)`
  - Foreground: `hsl(40, 10%, 92%)`
  - Borders: `hsl(240, 4%, 20%)`

### 2.2 Typography
- **Headings & Display:** `DM Serif Text`, serif (classic editorial look of QuizPilot)
- **Body & Controls:** `Inter`, system sans-serif (clean readability)

---

## 3. Core Functional Requirements & Routes

### 3.1 Route Architecture
1. `/` — **Landing Page**:
   - Navigation bar with brand logo, links, Language switcher (UZ/EN), Theme toggle (Light/Dark), API Key settings modal trigger, and CTA.
   - Hero section with live quick-generator input box.
   - Interactive feature preview switcher showing real preview cards.
   - Benefits / "How It Works" 3-step pipeline.
   - Pricing tiers (Free, Pro, Team/Institution) with monthly/yearly toggle.
   - Student testimonials grid.
   - Interactive FAQ accordion.
   - Footer with sitemap, copyright, and social links.

2. `/dashboard` — **Study Dashboard**:
   - Quick stats: Study streak counter (days), Total cards reviewed, Quizzes completed, Average score percentage.
   - Quick generator launch bar: "Create Quiz", "Create Flashcards", "Summary Notes", "Exam Simulator".
   - Study Sets Library: List of saved sets with search filter, type filter tabs (All, Quizzes, Flashcards, Notes, Exams), delete action, and "Practice Now" launcher.
   - Built-in preloaded sample sets across diverse subjects (e.g. Biology, History, Computer Science).

3. `/quizzes-ai` — **AI Quiz Studio & Runner**:
   - Multi-tab creation input: Text paste, PDF file upload, YouTube / Web URL, or custom Topic prompt.
   - Generation settings: Number of questions (5, 10, 15, 20), Difficulty (Easy, Medium, Hard), Question style (Multiple Choice, True/False).
   - Interactive Quiz Player:
     - Real-time question progress bar & timer.
     - Multiple choice selection with immediate visual feedback (green/red animations).
     - "AI Hint" button giving a clue without spoiling the answer.
     - "Explanation" accordion explaining the factual context.
     - Question bookmarking / flagging for later review.
     - Results & Score breakdown screen: score percentage, passed/retry status, review wrong answers, export or save to dashboard.

4. `/flashcards-ai` — **Active Recall 3D Flashcards**:
   - Interactive 3D flip card card animation on click, spacebar, or button.
   - Front: Prompt/Concept, Back: Definition/Explanation + real-world example.
   - Spaced Repetition Active Recall rating:
     - "Again" (Red, review immediately)
     - "Hard" (Yellow, review soon)
     - "Good" (Blue, solid understanding)
     - "Easy" (Green, mastered)
   - Shuffle deck, Flip all, Keyboard navigation (Left/Right arrows, Space to flip).
   - Fullscreen focus study mode.

5. `/ai-notes` — **AI Study Notes & Summary**:
   - Transforms input into structured study notes:
     - Executive summary
     - Key Concepts & Definitions table
     - Crucial bullet points / formula list
     - Review questions
   - One-click copy, Markdown export, and print-to-PDF view.

6. `/exam-simulator` — **Timed Exam Simulator**:
   - Mimics real exam conditions:
     - Strict countdown timer (customizable: 10m, 20m, 30m)
     - No instant answers during the exam
     - Question matrix grid showing answered, flagged, and remaining questions
     - "Submit Exam" modal with verification
     - Comprehensive post-exam diagnostics: score %, time taken per question, topic breakdown, list of weak points.

---

## 4. Technical Architecture

### 4.1 Technology Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + PostCSS + Autoprefixer + Lucide React Icons
- **PDF Extraction:** Client-side `pdfjs-dist` text parsing (zero server overhead)
- **AI Processing:** Google Gemini API (`@google/genai` or direct Gemini REST endpoint) with a built-in deterministic Smart Fallback generator when offline or without an API key.
- **State & Storage:** LocalStorage & IndexedDB with reactive event synchronization.
- **Internationalization (i18n):** Typed dictionary supporting Uzbek (`uz`) and English (`en`) with persistent language preference.

### 4.2 Data Models & Interfaces

```typescript
export type StudySetType = 'quiz' | 'flashcards' | 'notes' | 'exam';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  hint: string;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  example?: string;
  status?: 'again' | 'hard' | 'good' | 'easy';
}

export interface StudyNote {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  glossary: { term: string; definition: string }[];
}

export interface StudySet {
  id: string;
  title: string;
  type: StudySetType;
  description: string;
  createdAt: number;
  itemCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questions?: QuizQuestion[];
  flashcards?: Flashcard[];
  notes?: StudyNote;
  lastScore?: number;
}
```

---

## 5. Reliability & Fallback Strategy

1. **API Key Management:** Users can input their Gemini API key via the top-level settings modal, persisted in local storage.
2. **Offline / No-Key Smart Fallback:** When no API key is supplied, a smart heuristics generator analyzes the user's text or topic keywords and produces structurally valid, coherent questions, cards, and summaries so the app remains 100% usable anytime.
3. **Data Safety:** All user sets are kept locally in the browser's persistent storage; sets can be exported to JSON or imported back anytime.

---

## 6. Verification & Quality Gates
- Build verification: `npm run build` with zero TypeScript or ESLint errors.
- Visual inspection: Exact matching of colors, DM Serif font rendering, responsive layout on mobile, tablet, and desktop viewports.
- Interaction verification: Test-taking, flashcard flipping, score calculation, language toggle, and theme switching working seamlessly.
