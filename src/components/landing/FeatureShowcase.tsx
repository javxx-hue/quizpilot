import React, { useState } from 'react';
import { HelpCircle, Layers, FileText, Timer, Check, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { Language, getTranslations } from '../../lib/i18n';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface FeatureShowcaseProps {
  lang: Language;
  onNavigate: (route: string) => void;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ lang, onNavigate }) => {
  const t = getTranslations(lang).features;
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards' | 'notes' | 'exam'>('quiz');
  const [quizSelected, setQuizSelected] = useState<number | null>(1); // default option 1 selected
  const [cardFlipped, setCardFlipped] = useState(false);

  return (
    <section id="features" className="py-20 bg-secondary/30 border-y border-border/70 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-card rounded-2xl border border-border shadow-soft mb-8">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'quiz'
                ? 'bg-creation-quiz/25 text-creation-quiz-strong font-bold shadow-xs border border-creation-quiz/40'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <HelpCircle size={17} />
            {t.quizTab}
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'flashcards'
                ? 'bg-creation-flashcards/25 text-creation-flashcards-strong font-bold shadow-xs border border-creation-flashcards/40'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers size={17} />
            {t.flashcardsTab}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'notes'
                ? 'bg-creation-notes/25 text-creation-notes-strong font-bold shadow-xs border border-creation-notes/40'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText size={17} />
            {t.notesTab}
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'exam'
                ? 'bg-creation-exam/25 text-creation-exam-strong font-bold shadow-xs border border-creation-exam/40'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Timer size={17} />
            {t.examTab}
          </button>
        </div>

        {/* Feature Interactive Showcase Card */}
        <div className="rounded-3xl bg-card border border-border shadow-elevated p-6 sm:p-10 transition-all">
          
          {/* TAB 1: AI Quizzes */}
          {activeTab === 'quiz' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-creation-quiz/20 text-creation-quiz-strong text-xs font-semibold">
                  Active Recall Practice
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-foreground">
                  {t.quizTab}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.quizDesc}
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onNavigate('/quizzes-ai')}
                    icon={<ArrowRight size={15} />}
                  >
                    {t.tryFeature}
                  </Button>
                </div>
              </div>

              {/* Interactive Quiz Mockup Preview */}
              <div className="lg:col-span-7 bg-background rounded-2xl p-5 sm:p-6 border border-border/80 shadow-soft space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/60 pb-3">
                  <span className="font-semibold text-foreground">Savol 3 / 10</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">✨ AI Hint faol</span>
                </div>
                <h4 className="text-base sm:text-lg font-medium text-foreground">
                  {lang === 'uz'
                    ? 'Fotosintez jarayonida suv molekulalari qaysi bosqichda fotolizga uchraydi?'
                    : 'During photosynthesis, at which specific stage does photolysis of water occur?'}
                </h4>
                <div className="space-y-2">
                  {[
                    lang === 'uz' ? 'Qorong\'ulik bosqichida (Kalvin sikli)' : 'Dark reaction (Calvin cycle)',
                    lang === 'uz' ? 'Yorug\'lik bosqichida (Tilakoid membranasi)' : 'Light-dependent reaction (Thylakoid membrane)',
                    lang === 'uz' ? 'Mitoxondriya kristalarida' : 'Mitochondrial cristae',
                    lang === 'uz' ? 'Sitoplazma ribosomalarida' : 'Cytoplasmic ribosomes',
                  ].map((option, idx) => (
                    <div
                      key={idx}
                      onClick={() => setQuizSelected(idx)}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between cursor-pointer transition-all ${
                        quizSelected === idx
                          ? idx === 1
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-xs'
                            : 'bg-rose-500/15 border-rose-500/40 text-rose-800 dark:text-rose-300'
                          : 'bg-card border-border hover:bg-secondary/40 text-foreground'
                      }`}
                    >
                      <span>{option}</span>
                      {quizSelected === idx && idx === 1 && (
                        <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                {quizSelected === 1 && (
                  <div className="p-3 rounded-xl bg-creation-quiz/20 border border-creation-quiz/40 text-xs text-creation-quiz-strong leading-relaxed animate-in fade-in">
                    <strong>💡 AI Izoh:</strong> Suv fotolizi yorug'lik kvantlari ta'sirida xloroplastning tilakoidlarida yuz beradi va erkin kislorod ajraladi.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Flashcards */}
          {activeTab === 'flashcards' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-creation-flashcards/20 text-creation-flashcards-strong text-xs font-semibold">
                  Spaced Repetition
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-foreground">
                  {t.flashcardsTab}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.flashcardsDesc}
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onNavigate('/flashcards-ai')}
                    icon={<ArrowRight size={15} />}
                  >
                    {t.tryFeature}
                  </Button>
                </div>
              </div>

              {/* Interactive 3D Flip Card Preview */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div
                  onClick={() => setCardFlipped(!cardFlipped)}
                  className="w-full max-w-md h-56 rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/30 p-6 flex flex-col justify-between cursor-pointer shadow-card transition-all hover:scale-[1.01] hover:border-creation-flashcards/50 select-none relative"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Karta 1 / 8</span>
                    <span className="flex items-center gap-1 text-creation-flashcards-strong">
                      <RefreshCw size={13} className="animate-spin-slow" />
                      {cardFlipped ? 'Orqa tomon' : 'Old tomon (bosing)'}
                    </span>
                  </div>

                  <div className="text-center px-4">
                    {!cardFlipped ? (
                      <div>
                        <h4 className="text-xl sm:text-2xl font-serif text-foreground mb-2">
                          {lang === 'uz' ? 'Mitoxondriya' : 'Mitochondria'}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {lang === 'uz' ? 'Javobni eslang va kartani aylantiring' : 'Recall the definition and flip the card'}
                        </p>
                      </div>
                    ) : (
                      <div className="animate-in fade-in">
                        <p className="text-sm sm:text-base font-medium text-foreground mb-2">
                          {lang === 'uz'
                            ? 'Hujayraning energiya stansiyasi. Oziq moddalarni parchalab ATF hosil qiladi.'
                            : 'The powerhouse of the cell, generating most chemical energy through ATP synthesis.'}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          Misol: Mushak hujayralarida ko'p miqdorda bo'ladi.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Active Recall rating buttons */}
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/50 text-xs">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-400 font-medium">Again</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium">Hard</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-400 font-medium">Good</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium">Easy</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Structured Notes */}
          {activeTab === 'notes' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-creation-notes/20 text-creation-notes-strong text-xs font-semibold">
                  Smart Summaries
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-foreground">
                  {t.notesTab}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.notesDesc}
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onNavigate('/ai-notes')}
                    icon={<ArrowRight size={15} />}
                  >
                    {t.tryFeature}
                  </Button>
                </div>
              </div>

              {/* Notes Mockup Preview */}
              <div className="lg:col-span-7 bg-background rounded-2xl p-5 sm:p-6 border border-border/80 shadow-soft space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                  <FileText size={16} className="text-amber-500" />
                  <span className="text-sm font-semibold text-foreground">Konspekt: Kvant Fizikasi Asoslari</span>
                </div>
                <div className="space-y-2 text-xs text-foreground/90">
                  <div className="p-3 bg-card rounded-xl border border-border">
                    <strong className="block text-foreground mb-1">📌 Asosiy xulosa:</strong>
                    Kvant olamida energiya uzluksiz emas, balki diskret porsiyalar (kvantlar) ko'rinishida yutiladi va nurlanadi.
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-card rounded-xl border border-border">
                      <span className="font-semibold block text-primary">Plank Doimiysi</span>
                      <span className="text-muted-foreground text-[11px]">h = 6.626 × 10⁻³⁴ J·s</span>
                    </div>
                    <div className="p-2.5 bg-card rounded-xl border border-border">
                      <span className="font-semibold block text-primary">Fotoeffekt Qonuni</span>
                      <span className="text-muted-foreground text-[11px]">E = hν = A + Ek</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Exam Simulator */}
          {activeTab === 'exam' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-creation-exam/20 text-creation-exam-strong text-xs font-semibold">
                  Exam Pressure Mode
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-foreground">
                  {t.examTab}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.examDesc}
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onNavigate('/exam-simulator')}
                    icon={<ArrowRight size={15} />}
                  >
                    {t.tryFeature}
                  </Button>
                </div>
              </div>

              {/* Exam Simulator Mockup */}
              <div className="lg:col-span-7 bg-background rounded-2xl p-5 sm:p-6 border border-border/80 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Timer size={18} className="text-rose-500 animate-pulse" />
                    <span className="text-sm font-semibold font-mono text-rose-600 dark:text-rose-400">14:32 qoldi</span>
                  </div>
                  <span className="text-xs bg-secondary px-2.5 py-1 rounded-lg font-medium text-foreground">
                    12 / 20 javob berildi
                  </span>
                </div>
                {/* Question matrix chips */}
                <div className="grid grid-cols-8 gap-1.5 py-2">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-7 rounded-lg text-xs font-semibold flex items-center justify-center border ${
                        i < 6
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
                          : i === 6
                          ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40'
                          : 'bg-card text-muted-foreground border-border'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Yashil: Yechilgan | Sariq: Belgilangan | Kulrang: Hali o'qilmagan
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
