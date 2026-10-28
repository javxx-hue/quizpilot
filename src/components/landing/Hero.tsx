import React from 'react';
import { Sparkles, Users, Award, CheckCircle } from 'lucide-react';
import { QuickInputBox } from './QuickInputBox';
import { Language, getTranslations } from '../../lib/i18n';
import { StudySet } from '../../types';

interface HeroProps {
  lang: Language;
  onSetGenerated: (set: StudySet) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onSetGenerated }) => {
  const t = getTranslations(lang).hero;

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      {/* Subtle decorative background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-creation-notes/15 via-creation-flashcards/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-border text-xs sm:text-sm font-medium text-foreground mb-6 shadow-xs animate-in fade-in">
          <Sparkles size={14} className="text-amber-500 shrink-0" />
          <span>{t.badge}</span>
        </div>

        {/* Hero Title in DM Serif Text */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal tracking-tight text-foreground leading-[1.12] mb-6">
          {t.titleStart}
          <span className="italic font-normal underline decoration-highlight-orange/60 decoration-wavy decoration-2">
            {t.titleHighlight}
          </span>
          {t.titleEnd}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          {t.subtitle}
        </p>

        {/* Interactive Quick Generation Box */}
        <div className="mb-12">
          <QuickInputBox lang={lang} onSetGenerated={onSetGenerated} />
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground pt-4 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <span className="font-medium text-foreground">{t.stats.students}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-foreground">{t.stats.questions}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-amber-500" />
            <span className="font-medium text-foreground">{t.stats.satisfaction}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
