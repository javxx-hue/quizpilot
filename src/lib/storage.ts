import { StudySet, UserStats, Language } from '../types';
import { sampleStudySets } from './sampleData';

const STORAGE_KEYS = {
  SETS: 'quizpilot_study_sets',
  STATS: 'quizpilot_user_stats',
  API_KEY: 'quizpilot_gemini_api_key',
  LANG: 'quizpilot_language',
  THEME: 'quizpilot_theme',
};

// Listeners for reactive updates
type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

export function subscribeStorage(callback: StorageListener): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

// Clean fresh new user stats
const defaultStats: UserStats = {
  streakDays: 0,
  lastStudyDate: '',
  quizzesTaken: 0,
  cardsMastered: 0,
  totalStudyMinutes: 0,
  averageScore: 0,
};

// Initialize default data if empty (fresh start)
export function initStorage(): void {
  if (typeof window === 'undefined') return;
  
  if (localStorage.getItem(STORAGE_KEYS.SETS) === null) {
    localStorage.setItem(STORAGE_KEYS.SETS, JSON.stringify([]));
  }
  if (localStorage.getItem(STORAGE_KEYS.STATS) === null) {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(defaultStats));
  }
}

// Reset to a brand new clean account
export function resetToFreshState(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SETS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(defaultStats));
  notifyListeners();
}

// Load demo sample sets
export function loadDemoSampleSets(): void {
  if (typeof window === 'undefined') return;
  const current = getStudySets();
  const currentIds = new Set(current.map((s) => s.id));
  const newSamples = sampleStudySets.filter((s) => !currentIds.has(s.id));
  localStorage.setItem(STORAGE_KEYS.SETS, JSON.stringify([...current, ...newSamples]));
  notifyListeners();
}

// Study Sets
export function getStudySets(): StudySet[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse study sets from storage', e);
    return [];
  }
}

export function saveStudySet(set: StudySet): void {
  const existing = getStudySets();
  const index = existing.findIndex((s) => s.id === set.id);
  let updated: StudySet[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = set;
  } else {
    updated = [set, ...existing];
  }
  localStorage.setItem(STORAGE_KEYS.SETS, JSON.stringify(updated));
  notifyListeners();
}

export function deleteStudySet(id: string): void {
  const existing = getStudySets();
  const updated = existing.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SETS, JSON.stringify(updated));
  notifyListeners();
}

export function getStudySetById(id: string): StudySet | undefined {
  const sets = getStudySets();
  return sets.find((s) => s.id === id);
}

// User Stats & Streak
export function getUserStats(): UserStats {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return defaultStats;
    return JSON.parse(raw);
  } catch {
    return defaultStats;
  }
}

export function recordQuizCompletion(scorePercentage: number, questionsCount: number): void {
  const stats = getUserStats();
  const today = new Date().toISOString().split('T')[0];
  
  let newStreak = stats.streakDays;
  if (stats.lastStudyDate !== today) {
    // Check if yesterday or gap
    const lastDate = new Date(stats.lastStudyDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  const updatedStats: UserStats = {
    ...stats,
    streakDays: newStreak,
    lastStudyDate: today,
    quizzesTaken: stats.quizzesTaken + 1,
    averageScore: Math.round((stats.averageScore * stats.quizzesTaken + scorePercentage) / (stats.quizzesTaken + 1)),
    totalStudyMinutes: stats.totalStudyMinutes + Math.ceil(questionsCount * 1.5),
  };

  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
  notifyListeners();
}

export function recordCardMastered(): void {
  const stats = getUserStats();
  const updatedStats: UserStats = {
    ...stats,
    cardsMastered: stats.cardsMastered + 1,
  };
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
  notifyListeners();
}

// API Key
export function getApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

export function setApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
  notifyListeners();
}

// Language
export function getSavedLanguage(): Language {
  if (typeof window === 'undefined') return 'uz';
  return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'uz';
}

export function setSavedLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LANG, lang);
  notifyListeners();
}

// Theme
export function getSavedTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
}

export function setSavedTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  notifyListeners();
}

// -------------------------------------------------------------
// Data Export & Import Helpers
// -------------------------------------------------------------
export function exportSetsToJson(): void {
  const sets = getStudySets();
  const blob = new Blob([JSON.stringify(sets, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quizpilot-study-sets-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importSetsFromJson(jsonContent: string): { success: boolean; count: number } {
  try {
    const parsed = JSON.parse(jsonContent);
    if (!Array.isArray(parsed)) return { success: false, count: 0 };

    const current = getStudySets();
    const currentIds = new Set(current.map((s) => s.id));
    
    // Add new sets
    const newSets = parsed.filter((s) => s.id && !currentIds.has(s.id));
    const merged = [...newSets, ...current];
    localStorage.setItem(STORAGE_KEYS.SETS, JSON.stringify(merged));
    notifyListeners();
    return { success: true, count: newSets.length };
  } catch {
    return { success: false, count: 0 };
  }
}

export function exportFlashcardsToCsv(set: StudySet): void {
  if (!set.flashcards || set.flashcards.length === 0) return;
  
  const rows = set.flashcards.map((fc) => {
    const front = `"${(fc.front || '').replace(/"/g, '""')}"`;
    const back = `"${(fc.back || '').replace(/"/g, '""')}"`;
    return `${front},${back}`;
  });

  const csvContent = 'Front,Back\n' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${set.title.replace(/\s+/g, '-').toLowerCase()}-anki-cards.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
