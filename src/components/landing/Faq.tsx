import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Language, getTranslations } from '../../lib/i18n';

interface FaqProps {
  lang: Language;
}

export const Faq: React.FC<FaqProps> = ({ lang }) => {
  const t = getTranslations(lang).faq;
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 },
  ];

  return (
    <section className="py-20 bg-secondary/30 border-t border-border/70 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground">
            {t.title}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-card border border-border/80 overflow-hidden shadow-soft transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif text-base sm:text-lg text-foreground hover:bg-secondary/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-foreground' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-muted-foreground leading-relaxed animate-in fade-in border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
