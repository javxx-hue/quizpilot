import React, { useState, useRef } from 'react';
import { StudyStats } from '../components/dashboard/StudyStats';
import { SetCard } from '../components/dashboard/SetCard';
import { Button } from '../components/ui/Button';
import { Plus, Search, Sparkles, HelpCircle, Layers, FileText, Timer, Download, Upload, RotateCcw, Crown, Check, BookOpen } from 'lucide-react';
import { StudySet, StudySetType, Subject, UserStats } from '../types';
import { TodayPlan } from '../components/prep/TodayPlan';
import { Language, getTranslations } from '../lib/i18n';
import { exportSetsToJson, importSetsFromJson, loadDemoSampleSets, resetToFreshState } from '../lib/storage';
import { toast } from '../components/ui/Toast';

interface DashboardPageProps {
  studySets: StudySet[];
  subjects: Subject[];
  stats: UserStats;
  lang: Language;
  onOpenSet: (set: StudySet) => void;
  onDeleteSet: (id: string) => void;
  onOpenCreateModal: (type?: StudySetType) => void;
  onOpenBeta: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  studySets,
  subjects,
  stats,
  lang,
  onOpenSet,
  onDeleteSet,
  onOpenCreateModal,
  onOpenBeta,
}) => {
  const t = getTranslations(lang).dashboard;
  const isUz = lang === 'uz';
  const [activeTab, setActiveTab] = useState<StudySetType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importSetsFromJson(content);
      if (res.success) {
        toast.success(isUz ? `${res.count} ta to'plam yuklandi!` : `Imported ${res.count} sets!`);
      } else {
        toast.error(isUz ? 'JSON fayl formati noto\'g\'ri' : 'Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetToClean = () => {
    if (window.confirm(isUz ? 'Barcha ma\'lumotlar tozalansinmi va yangi hisob holatiga qaytarilsinmi?' : 'Reset everything to clean fresh state?')) {
      resetToFreshState();
      toast.info(isUz ? 'Barcha ma\'lumotlar yangilandi (toza holat)!' : 'Reset to fresh day-one state!');
    }
  };

  const handleLoadSamples = () => {
    loadDemoSampleSets();
    toast.success(isUz ? 'Namunaviy o\'quv to\'plamlari yuklandi!' : 'Loaded sample study kits!');
  };

  // Filter sets by type and search query
  const filteredSets = studySets.filter((set) => {
    const matchesTab = activeTab === 'all' || set.type === activeTab;
    const matchesSearch =
      set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              {t.title}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={importFileRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            onClick={handleResetToClean}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-border text-xs flex items-center gap-1 transition-colors"
            title={isUz ? 'Hisobni tozalash va 0 holatga qaytarish' : 'Reset to fresh clean state'}
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">{isUz ? 'Tozalash' : 'Reset'}</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => importFileRef.current?.click()}
            icon={<Upload size={14} />}
            title={isUz ? 'JSON to\'plamlarni import qilish' : 'Import JSON sets'}
          >
            {isUz ? 'Import' : 'Import'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportSetsToJson();
              toast.success(isUz ? 'To\'plamlar yuklab olindi!' : 'Exported JSON backup!');
            }}
            icon={<Download size={14} />}
            title={isUz ? 'To\'plamlarni JSON shaklida yuklab olish' : 'Export JSON sets'}
          >
            {isUz ? 'Eksport' : 'Export'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenCreateModal()}
            icon={<Plus size={15} />}
            className="shadow-sm"
          >
            {t.createBtn}
          </Button>
        </div>
      </div>

      <TodayPlan subjects={subjects} studySets={studySets} lang={lang} />

      {/* Beta banner (payments are not live yet) */}
      <div className="mb-6 p-4 rounded-2xl bg-secondary/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles size={18} className="text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              {isUz ? 'Beta davrida hammasi bepul' : 'Everything is free during the beta'}
            </h4>
            <p className="text-xs text-muted-foreground">
              {isUz ? 'Fikr va takliflaringiz mahsulotni shakllantiradi.' : 'Your feedback shapes the product.'}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenBeta} className="text-xs shrink-0">
          {isUz ? 'Batafsil' : 'Learn more'}
        </Button>
      </div>

      {/* User Progress Stats (Fresh: 0 Streak, 0 Quizzes, etc.) */}
      <StudyStats stats={stats} lang={lang} />

      {/* Quick Launch Creator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <button
          onClick={() => onOpenCreateModal('quiz')}
          className="p-3.5 rounded-2xl bg-card border border-border/80 hover:border-creation-quiz hover:bg-creation-quiz/10 transition-all text-left group flex items-center gap-3 shadow-soft"
        >
          <div className="w-10 h-10 rounded-xl bg-creation-quiz/20 text-creation-quiz-strong flex items-center justify-center shrink-0">
            <HelpCircle size={18} />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground group-hover:text-creation-quiz-strong block">
              + {lang === 'uz' ? 'AI Test' : 'New Quiz'}
            </span>
            <span className="text-[11px] text-muted-foreground">PDF yoki matndan</span>
          </div>
        </button>

        <button
          onClick={() => onOpenCreateModal('flashcards')}
          className="p-3.5 rounded-2xl bg-card border border-border/80 hover:border-creation-flashcards hover:bg-creation-flashcards/10 transition-all text-left group flex items-center gap-3 shadow-soft"
        >
          <div className="w-10 h-10 rounded-xl bg-creation-flashcards/20 text-creation-flashcards-strong flex items-center justify-center shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground group-hover:text-creation-flashcards-strong block">
              + {lang === 'uz' ? 'Flesh-karta' : 'New Flashcards'}
            </span>
            <span className="text-[11px] text-muted-foreground">3D yodlash</span>
          </div>
        </button>

        <button
          onClick={() => onOpenCreateModal('notes')}
          className="p-3.5 rounded-2xl bg-card border border-border/80 hover:border-creation-notes hover:bg-creation-notes/10 transition-all text-left group flex items-center gap-3 shadow-soft"
        >
          <div className="w-10 h-10 rounded-xl bg-creation-notes/20 text-creation-notes-strong flex items-center justify-center shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground group-hover:text-creation-notes-strong block">
              + {lang === 'uz' ? 'Qaydlar' : 'New Notes'}
            </span>
            <span className="text-[11px] text-muted-foreground">Aqlli konspekt</span>
          </div>
        </button>

        <button
          onClick={() => onOpenCreateModal('exam')}
          className="p-3.5 rounded-2xl bg-card border border-border/80 hover:border-creation-exam hover:bg-creation-exam/10 transition-all text-left group flex items-center gap-3 shadow-soft"
        >
          <div className="w-10 h-10 rounded-xl bg-creation-exam/20 text-creation-exam-strong flex items-center justify-center shrink-0">
            <Timer size={18} />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground group-hover:text-creation-exam-strong block">
              + {lang === 'uz' ? 'Imtihon' : 'Exam Sim'}
            </span>
            <span className="text-[11px] text-muted-foreground">Taymerli sinov</span>
          </div>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-secondary/80 rounded-xl border border-border/60 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.tabAll} ({studySets.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'quiz' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.tabQuizzes}
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'flashcards' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.tabFlashcards}
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'notes' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.tabNotes}
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'exam' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.tabExams}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Grid of Sets or Empty State */}
      {filteredSets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              lang={lang}
              onOpen={onOpenSet}
              onDelete={onDeleteSet}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-10 sm:p-14 text-center max-w-lg mx-auto my-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-primary">
            <Sparkles size={28} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-1.5">
              {isUz ? 'QuizPilot\'ga xush kelibsiz! 🎉' : 'Welcome to QuizPilot! 🎉'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {isUz
                ? 'Siz yangi boshlang\'ich hisobdasiz. O\'zingizning birinchi AI testingizni yarating yoki namuna to\'plamlarni yuklang.'
                : 'You are on a clean day-one account. Create your first AI study set or load sample demo decks to explore.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => onOpenCreateModal()}
              icon={<Plus size={16} />}
              className="w-full sm:w-auto shadow-sm"
            >
              {t.createBtn}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={handleLoadSamples}
              icon={<BookOpen size={16} />}
              className="w-full sm:w-auto"
            >
              {isUz ? 'Namunalarni yuklash' : 'Load Sample Kits'}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
