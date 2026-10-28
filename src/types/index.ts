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
  rating?: 'again' | 'hard' | 'good' | 'easy';
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

export type UserTier = 'free' | 'pro' | 'institution';

export interface SubscriptionInfo {
  tier: UserTier;
  planName: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  startDate: string;
  renewsAt: string;
  paymentMethod: 'card' | 'payme' | 'click' | 'voucher' | 'stripe';
  last4?: string;
  status: 'active' | 'cancelled';
  transactionId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'email' | 'guest';
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
}

export interface PaymentGatewayConfig {
  stripeProLink: string;
  stripeInstitutionLink: string;
  paymeMerchantUrl: string;
  clickMerchantUrl: string;
}
