export type StudySetType = 'quiz' | 'flashcards' | 'notes' | 'exam';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Language = 'uz' | 'en';

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
  rating?: 'again' | 'hard' | 'good' | 'easy'; // last rating given
  srs?: SrsState; // absent until first review
}

// FSRS card state as stored JSON (dates as ISO strings), see lib/srs.ts
export interface SrsState {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number; // ts-fsrs State: 0 New, 1 Learning, 2 Review, 3 Relearning
  last_review?: string;
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
  difficulty: Difficulty;
  sourceType: 'text' | 'pdf' | 'youtube' | 'prompt' | 'topic';
  sourceSnippet?: string;
  questions?: QuizQuestion[];
  flashcards?: Flashcard[];
  notes?: StudyNote;
  lastScore?: number;
  completedAt?: number;
}

export interface UserStats {
  streakDays: number;
  lastStudyDate: string; // YYYY-MM-DD
  quizzesTaken: number;
  cardsMastered: number;
  totalStudyMinutes: number;
  averageScore: number;
}

export interface GenerationOptions {
  type: StudySetType;
  questionCount?: number;
  difficulty?: Difficulty;
  language?: Language;
  topic?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'email';
  createdAt: string;
}
