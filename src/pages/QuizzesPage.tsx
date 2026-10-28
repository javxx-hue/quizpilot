import React, { useState } from 'react';
import { StudySet } from '../types';
import { QuizRunner } from '../components/study/QuizRunner';
import { Button } from '../components/ui/Button';
import { Plus, HelpCircle, ArrowLeft } from 'lucide-react';
import { Language, getTranslations } from '../lib/i18n';
import { SetCard } from '../components/dashboard/SetCard';

interface QuizzesPageProps {
  studySets: StudySet[];
  lang: Language;
  onOpenCreateModal: (type?: 'quiz') => void;
  onDeleteSet: (id: string) => void;
  onNavigate: (route: string) => void;
}

export const QuizzesPage: React.FC<QuizzesPageProps> = ({
  studySets,
  lang,
  onOpenCreateModal,
  onDeleteSet,
  onNavigate,
}) => {
  const t = getTranslations(lang);
  const quizSets = studySets.filter((s) => s.type === 'quiz');
  const [activeQuizSet, setActiveQuizSet] = useState<StudySet | null>(quizSets[0] || null);

  if (activeQuizSet) {
    return (
      <QuizRunner
        set={activeQuizSet}
        lang={lang}
        onFinish={() => setActiveQuizSet(null)}
        onRetake={() => {
          // Trigger re-mount
          const current = activeQuizSet;
          setActiveQuizSet(null);
          setTimeout(() => setActiveQuizSet(current), 50);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft size={14} />
            Kabinetga qaytish
          </button>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            {t.features.quizTab}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.features.quizDesc}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onOpenCreateModal('quiz')}
          icon={<Plus size={16} />}
        >
          Yangi Test Yaratish
        </Button>
      </div>

      {quizSets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizSets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              lang={lang}
              onOpen={(s) => setActiveQuizSet(s)}
              onDelete={onDeleteSet}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center max-w-md mx-auto my-8">
          <HelpCircle size={36} className="text-creation-quiz-strong mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-foreground mb-1">
            Testlar mavjud emas
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            O'zingizning birinchi AI testingizni yarating.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenCreateModal('quiz')}
            icon={<Plus size={15} />}
          >
            Test yaratish
          </Button>
        </div>
      )}
    </div>
  );
};
