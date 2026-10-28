import React, { useState, useEffect } from 'react';
import { StudySet, Flashcard } from '../../types';
import { Button } from '../ui/Button';
import { RotateCw, ArrowLeft, ArrowRight, Shuffle, RotateCcw, Check, Sparkles, Trophy, Maximize, Minimize, Volume2 } from 'lucide-react';
import { Language, getTranslations } from '../../lib/i18n';
import { recordCardMastered } from '../../lib/storage';

interface FlashcardPlayerProps {
  set: StudySet;
  lang: Language;
  onFinish: () => void;
}

export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ set, lang, onFinish }) => {
  const t = getTranslations(lang).flashcards;
  const initialCards: Flashcard[] = set.flashcards || [];

  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentCard = cards[currentIndex];
  const total = cards.length;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '1') {
        handleRating('again');
      } else if (e.key === '2') {
        handleRating('hard');
      } else if (e.key === '3') {
        handleRating('good');
      } else if (e.key === '4') {
        handleRating('easy');
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, cards]);

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (rating === 'good' || rating === 'easy') {
      recordCardMastered();
    }
    handleNext();
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'uz' ? 'tr-TR' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (total === 0 || !currentCard) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center bg-card rounded-3xl border border-border">
        <h3 className="text-xl font-serif font-bold">Kartalar mavjud emas</h3>
        <Button variant="primary" onClick={onFinish} className="mt-4">Kabinetga qaytish</Button>
      </div>
    );
  }

  // Completion State
  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto my-8 p-8 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-elevated text-center animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 bg-creation-flashcards/20 text-creation-flashcards-strong shadow-sm">
          <Trophy size={40} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
          {t.completedTitle}
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          {t.completedDesc}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="outline" size="md" onClick={handleReset} icon={<RotateCcw size={16} />}>
            {t.reset}
          </Button>
          <Button variant="primary" size="md" onClick={onFinish} icon={<Check size={16} />}>
            {lang === 'uz' ? 'Kabinetga qaytish' : 'Back to Dashboard'}
          </Button>
        </div>
      </div>
    );
  }

  const progressPct = ((currentIndex + 1) / total) * 100;

  return (
    <div className="max-w-2xl mx-auto my-4 sm:my-8 px-4">
      
      {/* Deck Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
            {set.title}
          </h2>
          <span className="text-xs text-muted-foreground">
            {t.card} {currentIndex + 1} / {total}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleSpeak(isFlipped ? currentCard.back : currentCard.front)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Ovozli eshitish"
          >
            <Volume2 size={16} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="To'liq ekran (F)"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <Button variant="ghost" size="sm" onClick={handleShuffle} icon={<Shuffle size={14} />}>
            {t.shuffle}
          </Button>
          <Button variant="ghost" size="sm" onClick={onFinish}>
            {lang === 'uz' ? 'Chiqish' : 'Exit'}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-secondary mb-6 overflow-hidden">
        <div
          className="h-full bg-creation-flashcards-strong transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="w-full h-80 sm:h-96 perspective-1000 cursor-pointer select-none mb-6"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-card border border-border shadow-elevated p-8 flex flex-col justify-between backface-hidden">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider text-creation-flashcards-strong">
                Savol / Tushuncha
              </span>
              <span className="flex items-center gap-1">
                <RotateCw size={13} />
                {t.flipHint}
              </span>
            </div>

            <div className="my-auto text-center px-4">
              <h3 className="text-2xl sm:text-3xl font-serif text-foreground font-normal leading-relaxed">
                {currentCard.front}
              </h3>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              [Space] yoki bosish orqali aylantiring
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-card via-secondary/20 to-creation-flashcards/10 border border-creation-flashcards/40 shadow-elevated p-8 flex flex-col justify-between backface-hidden rotate-y-180">
            <div className="flex items-center justify-between text-xs text-creation-flashcards-strong font-semibold uppercase tracking-wider">
              <span>Ta'rif / Javob</span>
              <span>✓ Ko'rib chiqildi</span>
            </div>

            <div className="my-auto text-center px-4 space-y-3">
              <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
                {currentCard.back}
              </p>
              {currentCard.example && (
                <p className="text-xs sm:text-sm text-muted-foreground italic border-t border-border/50 pt-2">
                  {currentCard.example}
                </p>
              )}
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Quyidagi reytinglardan birini tanlang
            </div>
          </div>
        </div>
      </div>

      {/* Active Recall Rating Buttons */}
      {isFlipped ? (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 animate-in fade-in">
            <button
              onClick={() => handleRating('again')}
              className="p-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs sm:text-sm font-semibold transition-all flex flex-col items-center gap-1"
            >
              <span>{t.ratings.again}</span>
              <kbd className="text-[10px] font-mono opacity-60">[1]</kbd>
            </button>
            <button
              onClick={() => handleRating('hard')}
              className="p-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold transition-all flex flex-col items-center gap-1"
            >
              <span>{t.ratings.hard}</span>
              <kbd className="text-[10px] font-mono opacity-60">[2]</kbd>
            </button>
            <button
              onClick={() => handleRating('good')}
              className="p-3 rounded-2xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-semibold transition-all flex flex-col items-center gap-1"
            >
              <span>{t.ratings.good}</span>
              <kbd className="text-[10px] font-mono opacity-60">[3]</kbd>
            </button>
            <button
              onClick={() => handleRating('easy')}
              className="p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold transition-all flex flex-col items-center gap-1"
            >
              <span>{t.ratings.easy}</span>
              <kbd className="text-[10px] font-mono opacity-60">[4]</kbd>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            icon={<ArrowLeft size={16} />}
          >
            {lang === 'uz' ? 'Oldingisi' : 'Previous'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsFlipped(true)}
            icon={<RotateCw size={15} />}
          >
            {t.flipBtn}
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleNext}
            icon={<ArrowRight size={16} />}
          >
            {lang === 'uz' ? 'Keyingisi' : 'Next'}
          </Button>
        </div>
      )}

      {/* Keyboard Shortcuts Hint Legend */}
      <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap items-center justify-center gap-4 text-[11px] text-muted-foreground">
        <span><kbd className="px-1 py-0.5 rounded bg-secondary border">Space</kbd> Aylantirish</span>
        <span><kbd className="px-1 py-0.5 rounded bg-secondary border">←</kbd> <kbd className="px-1 py-0.5 rounded bg-secondary border">→</kbd> Navigatsiya</span>
        <span><kbd className="px-1 py-0.5 rounded bg-secondary border">1-4</kbd> Baholash</span>
        <span><kbd className="px-1 py-0.5 rounded bg-secondary border">F</kbd> To'liq ekran</span>
      </div>

    </div>
  );
};
