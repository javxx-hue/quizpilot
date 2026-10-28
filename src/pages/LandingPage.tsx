import React from 'react';
import { Hero } from '../components/landing/Hero';
import { FeatureShowcase } from '../components/landing/FeatureShowcase';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Testimonials } from '../components/landing/Testimonials';
import { Pricing } from '../components/landing/Pricing';
import { Faq } from '../components/landing/Faq';
import { Language } from '../lib/i18n';
import { StudySet, UserTier } from '../types';

interface LandingPageProps {
  lang: Language;
  onNavigate: (route: string) => void;
  onSetGenerated: (set: StudySet) => void;
  onOpenCreateModal: () => void;
  userTier: UserTier;
  onOpenPaymentModal: (plan?: UserTier) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onNavigate,
  onSetGenerated,
  onOpenCreateModal,
  userTier,
  onOpenPaymentModal,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero lang={lang} onSetGenerated={onSetGenerated} />
      <FeatureShowcase lang={lang} onNavigate={onNavigate} />
      <HowItWorks lang={lang} />
      <Testimonials lang={lang} />
      <Pricing
        lang={lang}
        userTier={userTier}
        onSelectPlan={(plan) => {
          if (plan === 'free') {
            onOpenCreateModal();
          } else {
            onOpenPaymentModal(plan as UserTier);
          }
        }}
      />
      <Faq lang={lang} />
    </div>
  );
};

