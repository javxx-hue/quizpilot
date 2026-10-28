import React, { useState } from 'react';
import { StudySet } from '../types';
import { FlashcardPlayer } from '../components/study/FlashcardPlayer';
import { Button } from '../components/ui/Button';
import { Plus, Layers, ArrowLeft } from 'lucide-react';
import { Language, getTranslations } from '../lib/i18n';
import { SetCard } from '../components/dashboard/SetCard';

interface FlashcardsPageProps {
  studySets: StudySet[];
  lang: Language;
  onOpenCreateModal: (type?: 'flashcards') => void;
  onDeleteSet: (id: string) => void;
  onNavigate: (route: string) => void;
}

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({
  studySets,
  lang,
  onOpenCreateModal,
  onDeleteSet,
  onNavigate,
}) => {
  const t = getTranslations(lang);
  const flashcardSets = studySets.filter((s) => s.type === 'flashcards');
  const [activeDeck, setActiveDeck] = useState<StudySet | null>(flashcardSets[0] || null);

  if (activeDeck) {
    return (
      <FlashcardPlayer
        set={activeDeck}
        lang={lang}
        onFinish={() => setActiveDeck(null)}
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
            {t.features.flashcardsTab}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.features.flashcardsDesc}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onOpenCreateModal('flashcards')}
          icon={<Plus size={16} />}
        >
          Yangi Flesh-karta Yaratish
        </Button>
      </div>

      {flashcardSets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcardSets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              lang={lang}
              onOpen={(s) => setActiveDeck(s)}
              onDelete={onDeleteSet}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center max-w-md mx-auto my-8">
          <Layers size={36} className="text-creation-flashcards-strong mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-foreground mb-1">
            Flesh-kartalar mavjud emas
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Mavzuni tez yodlash uchun kartochkalar to'plamini yarating.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenCreateModal('flashcards')}
            icon={<Plus size={15} />}
          >
            Karta yaratish
          </Button>
        </div>
      )}
    </div>
  );
};
