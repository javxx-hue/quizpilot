import React, { useState } from 'react';
import { StudySet } from '../types';
import { NotesViewer } from '../components/study/NotesViewer';
import { Button } from '../components/ui/Button';
import { Plus, FileText, ArrowLeft } from 'lucide-react';
import { Language, getTranslations } from '../lib/i18n';
import { SetCard } from '../components/dashboard/SetCard';

interface NotesPageProps {
  studySets: StudySet[];
  lang: Language;
  onOpenCreateModal: (type?: 'notes') => void;
  onDeleteSet: (id: string) => void;
  onNavigate: (route: string) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({
  studySets,
  lang,
  onOpenCreateModal,
  onDeleteSet,
  onNavigate,
}) => {
  const t = getTranslations(lang);
  const noteSets = studySets.filter((s) => s.type === 'notes');
  const [activeNoteSet, setActiveNoteSet] = useState<StudySet | null>(noteSets[0] || null);

  if (activeNoteSet) {
    return (
      <NotesViewer
        set={activeNoteSet}
        lang={lang}
        onBack={() => setActiveNoteSet(null)}
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
            {t.features.notesTab}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.features.notesDesc}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onOpenCreateModal('notes')}
          icon={<Plus size={16} />}
        >
          Yangi Konspekt Yaratish
        </Button>
      </div>

      {noteSets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noteSets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              lang={lang}
              onOpen={(s) => setActiveNoteSet(s)}
              onDelete={onDeleteSet}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center max-w-md mx-auto my-8">
          <FileText size={36} className="text-creation-notes-strong mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-foreground mb-1">
            Qaydlar mavjud emas
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Murakkab darsliklardan asosiy qisqacha mazmun va konspekt yarating.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenCreateModal('notes')}
            icon={<Plus size={15} />}
          >
            Konspekt yaratish
          </Button>
        </div>
      )}
    </div>
  );
};
