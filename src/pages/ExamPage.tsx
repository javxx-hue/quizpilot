import React, { useState } from 'react';
import { StudySet } from '../types';
import { ExamSimulator } from '../components/study/ExamSimulator';
import { Button } from '../components/ui/Button';
import { Plus, Timer, ArrowLeft } from 'lucide-react';
import { Language, getTranslations } from '../lib/i18n';
import { SetCard } from '../components/dashboard/SetCard';

interface ExamPageProps {
  studySets: StudySet[];
  lang: Language;
  onOpenCreateModal: (type?: 'exam') => void;
  onDeleteSet: (id: string) => void;
  onNavigate: (route: string) => void;
}

export const ExamPage: React.FC<ExamPageProps> = ({
  studySets,
  lang,
  onOpenCreateModal,
  onDeleteSet,
  onNavigate,
}) => {
  const t = getTranslations(lang);
  const examSets = studySets.filter((s) => s.type === 'exam' || (s.type === 'quiz' && (s.questions?.length || 0) >= 5));
  const [activeExam, setActiveExam] = useState<StudySet | null>(examSets[0] || null);

  if (activeExam) {
    return (
      <ExamSimulator
        set={activeExam}
        lang={lang}
        onFinish={() => setActiveExam(null)}
        onRetake={() => {
          const current = activeExam;
          setActiveExam(null);
          setTimeout(() => setActiveExam(current), 50);
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
            {t.features.examTab}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.features.examDesc}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onOpenCreateModal('exam')}
          icon={<Plus size={16} />}
        >
          Yangi Imtihon Boshlash
        </Button>
      </div>

      {examSets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examSets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              lang={lang}
              onOpen={(s) => setActiveExam(s)}
              onDelete={onDeleteSet}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center max-w-md mx-auto my-8">
          <Timer size={36} className="text-creation-exam-strong mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-foreground mb-1">
            Imtihonlar mavjud emas
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Taymerli imtihon sinovini yaratib o'z bilimlaringizni sinab ko'ring.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenCreateModal('exam')}
            icon={<Plus size={15} />}
          >
            Imtihon yaratish
          </Button>
        </div>
      )}
    </div>
  );
};
