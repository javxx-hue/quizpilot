import React from 'react';
import { UploadCloud, Cpu, Trophy } from 'lucide-react';
import { Language, getTranslations } from '../../lib/i18n';

interface HowItWorksProps {
  lang: Language;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ lang }) => {
  const t = getTranslations(lang).howItWorks;

  const steps = [
    {
      step: '01',
      icon: <UploadCloud size={28} className="text-creation-quiz-strong" />,
      bg: 'bg-creation-quiz/15 border-creation-quiz/30',
      title: t.step1Title,
      desc: t.step1Desc,
    },
    {
      step: '02',
      icon: <Cpu size={28} className="text-creation-flashcards-strong" />,
      bg: 'bg-creation-flashcards/15 border-creation-flashcards/30',
      title: t.step2Title,
      desc: t.step2Desc,
    },
    {
      step: '03',
      icon: <Trophy size={28} className="text-creation-exam-strong" />,
      bg: 'bg-creation-exam/15 border-creation-exam/30',
      title: t.step3Title,
      desc: t.step3Desc,
    },
  ];

  return (
    <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3">
          {t.badge}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground">
          {t.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-card border border-border/80 p-8 shadow-soft flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-all"
          >
            <div className="text-4xl font-serif font-bold text-border/70 group-hover:text-primary/20 transition-colors absolute top-6 right-6 select-none">
              {item.step}
            </div>
            <div>
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 shadow-xs ${item.bg}`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
