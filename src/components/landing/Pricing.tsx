import React, { useState } from 'react';
import { Check, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, getTranslations } from '../../lib/i18n';
import { Button } from '../ui/Button';
type Plan = 'free' | 'pro' | 'institution';

interface PricingProps {
  lang: Language;
  onSelectPlan: (plan: Plan) => void;
}

export const Pricing: React.FC<PricingProps> = ({ lang, onSelectPlan }) => {
  const t = getTranslations(lang).pricing;
  const isUz = lang === 'uz';
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3">
          {t.badge}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-4">
          {t.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t.subtitle}
        </p>
        <p className="mt-3 inline-block px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          {isUz ? 'Beta davrida barcha imkoniyatlar bepul. Narxlar taxminiy.' : 'Everything is free during the beta. Prices are tentative.'}
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="inline-flex items-center gap-3 p-1.5 bg-secondary/80 rounded-2xl border border-border mt-8">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              !isYearly ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
            }`}
          >
            {t.monthly}
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isYearly ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
            }`}
          >
            <span>{t.yearly}</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* Tier 1: Free Starter */}
        <div className="rounded-3xl bg-card border border-border p-8 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
              {t.freeTitle}
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              {t.freeDesc}
            </p>
            <div className="text-4xl font-serif font-bold text-foreground mb-6">
              {t.freePrice}
              <span className="text-xs font-sans text-muted-foreground font-normal ml-1">/ abadiy</span>
            </div>
            <ul className="space-y-3 text-sm text-foreground/90 border-t border-border/60 pt-6">
              {[t.freeFeature1, t.freeFeature2, t.freeFeature3, t.freeFeature4].map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-8">
            <Button
              variant="outline"
              size="md"
              onClick={() => onSelectPlan('free')}
              className="w-full"
            >
              {t.btnFree}
            </Button>
          </div>
        </div>

        {/* Tier 2: Pro Scholar (Highlighted) */}
        <div className="rounded-3xl bg-card border-2 border-primary p-8 shadow-elevated flex flex-col justify-between relative transform md:-translate-y-2">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sparkles size={12} className="text-amber-400" />
            Eng mashhur
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
              {t.proTitle}
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              {t.proDesc}
            </p>
            <div className="text-4xl font-serif font-bold text-foreground mb-6">
              {isYearly ? '$5' : t.proPrice}
              <span className="text-xs font-sans text-muted-foreground font-normal ml-1">/ oy</span>
            </div>
            <ul className="space-y-3 text-sm text-foreground/90 border-t border-border/60 pt-6">
              {[t.proFeature1, t.proFeature2, t.proFeature3, t.proFeature4].map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-8">
            <Button
              variant="primary"
              size="md"
              onClick={() => onSelectPlan('pro')}
              className="w-full shadow-md"
            >
              {t.btnPro}
            </Button>
          </div>
        </div>

        {/* Tier 3: Institution */}
        <div className="rounded-3xl bg-card border border-border p-8 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
              {t.institutionTitle}
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              {t.institutionDesc}
            </p>
            <div className="text-4xl font-serif font-bold text-foreground mb-6">
              {isYearly ? '$22' : t.institutionPrice}
              <span className="text-xs font-sans text-muted-foreground font-normal ml-1">/ oy</span>
            </div>
            <ul className="space-y-3 text-sm text-foreground/90 border-t border-border/60 pt-6">
              <li className="flex items-center gap-2.5">
                <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Barcha Pro imkoniyatlar</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Jamoaviy o'quv kabineti va testlar</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Talabalar tahlili va o'zlashtirish reytingi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Prioritet qo'llab-quvvatlash</span>
              </li>
            </ul>
          </div>
          <div className="pt-8">
            <Button
              variant="outline"
              size="md"
              onClick={() => onSelectPlan('institution')}
              className="w-full"
            >
              {t.btnInstitution}
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};
