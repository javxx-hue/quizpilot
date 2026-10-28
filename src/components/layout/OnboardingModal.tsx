import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, UploadCloud, Brain, Trophy, ChevronRight, Check } from 'lucide-react';
import { Language } from '../../lib/i18n';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onStartCreating: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  lang,
  onStartCreating,
}) => {
  const [step, setStep] = useState(0);
  const isUz = lang === 'uz';

  const steps = [
    {
      icon: <UploadCloud size={32} className="text-creation-quiz-strong" />,
      title: isUz ? 'Istalgan materialni yuklang' : 'Upload Any Study Material',
      desc: isUz
        ? 'Darsliklar, PDF konspektlar, YouTube video havolasi yoki shunchaki matnni kiritishingiz kifoya.'
        : 'Feed textbooks, lecture slides, YouTube video URLs, or raw notes directly into QuizPilot.',
    },
    {
      icon: <Brain size={32} className="text-creation-flashcards-strong" />,
      title: isUz ? 'Aktiv Eslash (Active Recall)' : 'Active Recall & Spaced Repetition',
      desc: isUz
        ? 'AI tushunchalarni ajratib, 3D aylanuvchi flesh-kartalar va tushuntirishli testlarni tuzadi.'
        : 'AI generates 3D flashcards and contextual quizzes with real-time hints and explanations.',
    },
    {
      icon: <Trophy size={32} className="text-creation-exam-strong" />,
      title: isUz ? 'Imtihonga 100% tayyorlaning' : 'Ace Your Exams with Confidence',
      desc: isUz
        ? 'Taymerli imtihon simulyatori orqali zaif nuqtalaringizni aniqlang va bilimlaringizni mustahkamlang.'
        : 'Take timed practice simulations, discover weak spots, and master your syllabus faster.',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((p) => p + 1);
    } else {
      onClose();
      onStartCreating();
    }
  };

  const curr = steps[step];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="text-center p-2 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-secondary mx-auto flex items-center justify-center border border-border shadow-soft">
          {curr.icon}
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-serif font-bold text-foreground">
            {curr.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {curr.desc}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                step === i ? 'bg-primary w-6' : 'bg-secondary'
              }`}
            />
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between gap-3 border-t border-border">
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            {isUz ? 'O\'tkazib yuborish' : 'Skip'}
          </button>

          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            icon={step === steps.length - 1 ? <Check size={16} /> : <ChevronRight size={16} />}
          >
            {step === steps.length - 1 ? (isUz ? 'Boshlash' : 'Get Started') : (isUz ? 'Keyingisi' : 'Next')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
