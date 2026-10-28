# QuizPilot.io Clone - Bug Fixes, Gap Analysis & Enhancement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Address all missing features, UX gaps, and edge cases to elevate the QuizPilot clone to pixel-perfect parity with QuizPilot.io, including specialized routes, YouTube video metadata extraction, keyboard navigation, Web Speech audio listener, Auth/Onboarding modals, Toast system, and Anki/JSON deck exports.

---

## 1. Identified Issues & Gap Analysis

| # | Component / Area | Issue / Shortcoming | Root Cause & Target Fix |
|---|------------------|-------------------|--------------------------|
| 1 | **Routing & Sub-pages** | Missing `/quizzes-ai/pdf`, `/quizzes-ai/video`, `/terms`, `/privacy`, `/contact`, `/auth` | Add sub-route handlers and dedicated interactive screens/modals in App.tsx |
| 2 | **YouTube Ingestion** | Raw URL was just treated as plain text string without thumbnail/title | Add real YouTube URL parser with video ID extraction and live thumbnail preview |
| 3 | **Keyboard Navigation** | Quizzes and flashcards lack standard study key bindings (1-4, A-D, Enter) | Add global keyboard event listeners with visual keyboard shortcut badges |
| 4 | **Interactive Audio / Podcast** | QuizPilot CSS includes `--creation-podcast`, but audio listening was missing | Add in-browser Web Speech API audio player to read notes and flashcards aloud |
| 5 | **Toast Notifications** | UI lacked a floating toast feedback system for copy, save, and delete actions | Implement reactive Toast notification provider (`useToast` / `<ToastContainer />`) |
| 6 | **Auth & Onboarding** | "Sign In" button was inactive; first-run onboarding was missing | Add Auth modal (Email/Password & Google mock login) and interactive Onboarding Tour |
| 7 | **Data Export & Import** | Users couldn't export decks to Anki/CSV/JSON or import external decks | Add JSON/CSV Export & Import buttons in Dashboard and Study views |
| 8 | **Timer Flexibility** | QuizRunner had no option to toggle timer pressure on/off | Add configurable timer toggle and speed settings in QuizRunner |
| 9 | **Fullscreen Study Mode** | Flashcards & Exam lacked dedicated fullscreen focus toggle | Implement browser Fullscreen API integration |
| 10| **Footer & Legal Modals** | Terms, Privacy, and Contact in footer didn't open readable content | Implement rich accessible modals for Terms, Privacy Policy, and Contact Form |

---

## 2. Bite-Sized Implementation Tasks

### Task 1: Toast Notification System & Utility Hook
- Create `src/components/ui/Toast.tsx` with alert styles (success, error, info)
- Integrate toast dispatcher into `storage.ts` and UI actions

### Task 2: YouTube Metadata & Live Thumbnail Preview
- Enhance `src/lib/youtubeParser.ts` to extract YouTube IDs from standard, short, and mobile URLs
- Render thumbnail and title preview card inside `QuickInputBox` and `CreationModal`

### Task 3: Comprehensive Keyboard Navigation & Shortcuts
- Update `QuizRunner.tsx` to handle keys A, B, C, D (or 1, 2, 3, 4), Space (Hint), Enter (Next)
- Update `FlashcardPlayer.tsx` to handle keys 1 (Again), 2 (Hard), 3 (Good), 4 (Easy), Space (Flip), F (Fullscreen)

### Task 4: Audio Study Listener (Web Speech API)
- Create `src/components/study/AudioPlayer.tsx` using `window.speechSynthesis`
- Add "Listen to Notes" and "Listen to Flashcard" audio playback with play/pause/rate controls

### Task 5: Auth Modal & Onboarding Tour
- Create `src/components/layout/AuthModal.tsx` (Sign In / Register / Guest Mode)
- Create `src/components/layout/OnboardingModal.tsx` (3-step visual interactive onboarding)
- Connect to Navbar "Sign In" button and header controls

### Task 6: Legal & Support Modals (Privacy, Terms, Contact)
- Create `src/components/layout/LegalModals.tsx` for Terms of Service, Privacy Policy, and Contact Us form

### Task 7: Data Export & Import Engine (JSON & CSV/Anki)
- Add export to JSON and CSV in `src/lib/storage.ts`
- Add import JSON button in `DashboardPage.tsx` with validation and success toast

### Task 8: Dedicated Sub-Routes (`/quizzes-ai/pdf`, `/quizzes-ai/video`) & Routing Updates
- Update `src/App.tsx` and navbar to seamlessly route to specialized video and PDF creators
- Full build verification with `npm run build`
