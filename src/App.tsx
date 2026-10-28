import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CreationModal } from './components/creation/CreationModal';
import { AuthModal } from './components/layout/AuthModal';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { LegalModals } from './components/layout/LegalModals';
import { PaymentModal } from './components/layout/PaymentModal';
import { ToastContainer } from './components/ui/Toast';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { NotesPage } from './pages/NotesPage';
import { ExamPage } from './pages/ExamPage';

import { QuizRunner } from './components/study/QuizRunner';
import { FlashcardPlayer } from './components/study/FlashcardPlayer';
import { NotesViewer } from './components/study/NotesViewer';
import { ExamSimulator } from './components/study/ExamSimulator';

import {
  initStorage,
  getStudySets,
  getUserStats,
  getUserTier,
  setUserTier,
  deleteStudySet,
  getSavedLanguage,
  setSavedLanguage,
  getSavedTheme,
  setSavedTheme,
  subscribeStorage,
} from './lib/storage';
import { toast } from './components/ui/Toast';
import { Language } from './lib/i18n';
import { StudySet, StudySetType, UserStats, UserTier } from './types';

export default function App() {
  // Initialize storage on first load
  useEffect(() => {
    initStorage();
  }, []);

  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [lang, setLang] = useState<Language>(getSavedLanguage());
  const [theme, setTheme] = useState<'light' | 'dark'>(getSavedTheme());
  const [studySets, setStudySets] = useState<StudySet[]>(getStudySets());
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [userTier, setUserTierState] = useState<UserTier>(getUserTier());
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialType, setCreateModalInitialType] = useState<StudySetType>('quiz');
  const [createModalInitialSource, setCreateModalInitialSource] = useState<'text' | 'pdf' | 'youtube' | 'topic'>('text');
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'contact' | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalPlan, setPaymentModalPlan] = useState<UserTier>('pro');

  const [activeStudySet, setActiveStudySet] = useState<StudySet | null>(null);

  // Sync with storage updates
  useEffect(() => {
    const unsubscribe = subscribeStorage(() => {
      setStudySets(getStudySets());
      setStats(getUserStats());
      setUserTierState(getUserTier());
    });
    return () => unsubscribe();
  }, []);

  // Check for returning payment redirect (e.g. from Stripe or Payme)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
      const plan = (params.get('tier') as UserTier) || 'pro';
      const method = (params.get('method') as any) || 'stripe';
      const amount = params.get('amount') ? Number(params.get('amount')) : 7;
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const verifiedSub = {
        tier: plan,
        planName: plan === 'institution' ? 'Institution Pro' : 'Pro Scholar',
        amount: amount,
        currency: method === 'payme' ? 'UZS' : 'USD',
        interval: 'monthly' as const,
        startDate: now.toISOString().split('T')[0],
        renewsAt: nextMonth.toISOString().split('T')[0],
        paymentMethod: method,
        status: 'active' as const,
        transactionId: `TX-${Date.now().toString(36).toUpperCase()}`,
      };

      setUserTier(plan, verifiedSub);
      setUserTierState(plan);
      toast.success(lang === 'uz' ? 'Haqiqiy to\'lov tasdiqlandi! PRO tarifingiz faollashdi! 🎉' : 'Payment confirmed! PRO activated! 🎉');

      // Clean URL params
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [lang]);

  // Sync theme class on body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle route change
  const handleNavigate = (route: string) => {
    setActiveStudySet(null);
    
    // Sub-route handling
    if (route === '/pricing') {
      if (currentRoute !== '/') {
        setCurrentRoute('/');
        setTimeout(() => {
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (route === '/quizzes-ai/pdf') {
      setCurrentRoute('/quizzes-ai');
      handleOpenCreateModal('quiz', 'pdf');
    } else if (route === '/quizzes-ai/video') {
      setCurrentRoute('/quizzes-ai');
      handleOpenCreateModal('quiz', 'youtube');
    } else if (route === '/auth') {
      setIsAuthModalOpen(true);
    } else if (route === '/onboarding') {
      setIsOnboardingOpen(true);
    } else if (route === '/terms' || route === '/privacy' || route === '/contact') {
      setLegalModalType(route.substring(1) as any);
    } else {
      setCurrentRoute(route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPaymentModal = (plan: UserTier = 'pro') => {
    setPaymentModalPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setSavedLanguage(newLang);
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setSavedTheme(nextTheme);
  };

  const handleOpenCreateModal = (type: StudySetType = 'quiz', source: 'text' | 'pdf' | 'youtube' | 'topic' = 'text') => {
    setCreateModalInitialType(type);
    setCreateModalInitialSource(source);
    setIsCreateModalOpen(true);
  };

  const handleSetGenerated = (newSet: StudySet) => {
    setActiveStudySet(newSet);
  };

  const handleDeleteSet = (id: string) => {
    deleteStudySet(id);
    if (activeStudySet?.id === id) {
      setActiveStudySet(null);
    }
  };

  // Render direct study runner if active
  const renderActiveStudySet = () => {
    if (!activeStudySet) return null;

    if (activeStudySet.type === 'quiz') {
      return (
        <QuizRunner
          set={activeStudySet}
          lang={lang}
          onFinish={() => {
            setActiveStudySet(null);
            handleNavigate('/dashboard');
          }}
          onRetake={() => {
            const current = activeStudySet;
            setActiveStudySet(null);
            setTimeout(() => setActiveStudySet(current), 50);
          }}
        />
      );
    }

    if (activeStudySet.type === 'flashcards') {
      return (
        <FlashcardPlayer
          set={activeStudySet}
          lang={lang}
          onFinish={() => {
            setActiveStudySet(null);
            handleNavigate('/dashboard');
          }}
        />
      );
    }

    if (activeStudySet.type === 'notes') {
      return (
        <NotesViewer
          set={activeStudySet}
          lang={lang}
          onBack={() => {
            setActiveStudySet(null);
            handleNavigate('/dashboard');
          }}
        />
      );
    }

    if (activeStudySet.type === 'exam') {
      return (
        <ExamSimulator
          set={activeStudySet}
          lang={lang}
          onFinish={() => {
            setActiveStudySet(null);
            handleNavigate('/dashboard');
          }}
          onRetake={() => {
            const current = activeStudySet;
            setActiveStudySet(null);
            setTimeout(() => setActiveStudySet(current), 50);
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onOpenCreateModal={() => handleOpenCreateModal('quiz')}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        userTier={userTier}
        onOpenPaymentModal={handleOpenPaymentModal}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeStudySet ? (
          renderActiveStudySet()
        ) : (
          <>
            {currentRoute === '/' && (
              <LandingPage
                lang={lang}
                onNavigate={handleNavigate}
                onSetGenerated={handleSetGenerated}
                onOpenCreateModal={() => handleOpenCreateModal('quiz')}
                userTier={userTier}
                onOpenPaymentModal={handleOpenPaymentModal}
              />
            )}

            {currentRoute === '/dashboard' && (
              <DashboardPage
                studySets={studySets}
                stats={stats}
                lang={lang}
                userTier={userTier}
                onOpenSet={(set) => setActiveStudySet(set)}
                onDeleteSet={handleDeleteSet}
                onOpenCreateModal={handleOpenCreateModal}
                onOpenPaymentModal={handleOpenPaymentModal}
              />
            )}

            {currentRoute === '/quizzes-ai' && (
              <QuizzesPage
                studySets={studySets}
                lang={lang}
                onOpenCreateModal={(type) => handleOpenCreateModal(type || 'quiz')}
                onDeleteSet={handleDeleteSet}
                onNavigate={handleNavigate}
              />
            )}

            {currentRoute === '/flashcards-ai' && (
              <FlashcardsPage
                studySets={studySets}
                lang={lang}
                onOpenCreateModal={(type) => handleOpenCreateModal(type || 'flashcards')}
                onDeleteSet={handleDeleteSet}
                onNavigate={handleNavigate}
              />
            )}

            {currentRoute === '/ai-notes' && (
              <NotesPage
                studySets={studySets}
                lang={lang}
                onOpenCreateModal={(type) => handleOpenCreateModal(type || 'notes')}
                onDeleteSet={handleDeleteSet}
                onNavigate={handleNavigate}
              />
            )}

            {currentRoute === '/exam-simulator' && (
              <ExamPage
                studySets={studySets}
                lang={lang}
                onOpenCreateModal={(type) => handleOpenCreateModal(type || 'exam')}
                onDeleteSet={handleDeleteSet}
                onNavigate={handleNavigate}
              />
            )}
          </>
        )}
      </main>

      {/* Global Creation Modal */}
      <CreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        lang={lang}
        initialType={createModalInitialType}
        initialSourceType={createModalInitialSource}
        onSetCreated={handleSetGenerated}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
      />

      {/* Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        lang={lang}
        onStartCreating={() => handleOpenCreateModal('quiz')}
      />

      {/* Legal & Contact Modals */}
      <LegalModals
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        lang={lang}
      />

      {/* Payment / Upgrade Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        lang={lang}
        initialPlan={paymentModalPlan}
      />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Footer */}
      <Footer
        lang={lang}
        onNavigate={handleNavigate}
        onOpenLegalModal={(type) => setLegalModalType(type)}
      />

    </div>
  );
}
