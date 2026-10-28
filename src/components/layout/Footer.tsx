import React from 'react';
import { Send, Heart } from 'lucide-react';
import { Language, getTranslations } from '../../lib/i18n';

interface FooterProps {
  lang: Language;
  onNavigate: (route: string) => void;
  onOpenLegalModal: (type: 'terms' | 'privacy' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate, onOpenLegalModal }) => {
  const t = getTranslations(lang);

  return (
    <footer className="border-t border-border bg-card/60 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/80">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <Send size={16} className="transform -rotate-12 translate-x-0.5" />
              </div>
              <span className="text-xl font-serif font-bold text-foreground">
                QuizPilot
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.footer.desc}
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.product}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('/quizzes-ai')} className="text-foreground/80 hover:text-foreground transition-colors">
                  {t.nav.quizzes}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/flashcards-ai')} className="text-foreground/80 hover:text-foreground transition-colors">
                  {t.nav.flashcards}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/ai-notes')} className="text-foreground/80 hover:text-foreground transition-colors">
                  {t.nav.notes}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/exam-simulator')} className="text-foreground/80 hover:text-foreground transition-colors">
                  {t.nav.examSimulator}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="text-foreground/80 hover:text-foreground transition-colors">
                  {t.nav.dashboard}
                </button>
              </li>
            </ul>
          </div>

          {/* Study Formats */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Formats
            </h4>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>PDF to Quiz</li>
              <li>YouTube to Flashcards</li>
              <li>Lecture Notes to Summary</li>
              <li>Practice Test Simulator</li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>
                <button
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-foreground transition-colors"
                >
                  {t.footer.privacy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-foreground transition-colors"
                >
                  {t.footer.terms}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('contact')}
                  className="hover:text-foreground transition-colors"
                >
                  {t.footer.contact}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>{t.footer.copyright}</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart size={13} className="text-rose-500 fill-rose-500" /> for smarter learning
          </p>
        </div>
      </div>
    </footer>
  );
};
