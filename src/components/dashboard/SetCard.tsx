import React from 'react';
import { TypeBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Trash2, ArrowRight, BookOpen, Clock, HelpCircle, Layers, FileText, Timer, Download } from 'lucide-react';
import { StudySet } from '../../types';
import { Language, getTranslations } from '../../lib/i18n';
import { exportFlashcardsToCsv } from '../../lib/storage';
import { toast } from '../ui/Toast';

interface SetCardProps {
  set: StudySet;
  lang: Language;
  onOpen: (set: StudySet) => void;
  onDelete: (id: string) => void;
}

export const SetCard: React.FC<SetCardProps> = ({ set, lang, onOpen, onDelete }) => {
  const t = getTranslations(lang).dashboard;
  const isSample = set.id.startsWith('sample-');

  const icons = {
    quiz: <HelpCircle size={18} className="text-creation-quiz-strong" />,
    flashcards: <Layers size={18} className="text-creation-flashcards-strong" />,
    notes: <FileText size={18} className="text-creation-notes-strong" />,
    exam: <Timer size={18} className="text-creation-exam-strong" />,
  };

  return (
    <div className="rounded-2xl bg-card border border-border/80 hover:border-primary/40 p-5 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between group">
      <div>
        {/* Top Badges & Delete */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <TypeBadge type={set.type} />
            {isSample && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                {t.sampleBadge}
              </span>
            )}
            <span className="text-xs text-muted-foreground uppercase font-semibold">
              • {set.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {set.type === 'flashcards' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  exportFlashcardsToCsv(set);
                  toast.success('Anki CSV fayli yuklab olindi!');
                }}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
                title="Anki CSV formatda yuklash"
              >
                <Download size={14} />
              </button>
            )}

            {!isSample && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(set.id);
                  toast.info('To\'plam o\'chirildi');
                }}
                className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete set"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Set Title */}
        <h3 className="text-lg font-serif font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {set.title}
        </h3>

        {/* Description / Snippet */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
          {set.description || set.sourceSnippet || 'AI study material'}
        </p>
      </div>

      {/* Card Footer Info */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <BookOpen size={13} />
            {set.itemCount} {set.type === 'notes' ? (lang === 'uz' ? 'sahifa' : 'doc') : (lang === 'uz' ? 'ta' : 'items')}
          </span>
          {typeof set.lastScore === 'number' && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Natija: {set.lastScore}%
            </span>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onOpen(set)}
          icon={<ArrowRight size={13} />}
          className="text-xs py-1 px-2.5"
        >
          {t.startPractice}
        </Button>
      </div>
    </div>
  );
};
