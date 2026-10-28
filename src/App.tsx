import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CreationModal } from './components/creation/CreationModal';
import { AuthModal } from './components/layout/AuthModal';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { LegalModals } from './components/layout/LegalModals';
import { BetaModal } from './components/layout/BetaModal';
import { ToastContainer } from './components/ui/Toast';
import { Button } from './components/ui/Button';

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
  deleteStudySet,
  getSavedLanguage,
  setSavedLanguage,
  getSavedTheme,
  setSavedTheme,
  subscribeStorage,
} from './lib/storage';
import { Language } from './lib/i18n';
import { StudySet, StudySetType, UserStats } from './types';

type SourceType = 'text' | 'pdf' | 'youtube' | 'topic';

// Renders the runner for /study/:id. The set comes from the list, so a page
// refresh or a shared link to the same browser still opens it.
const StudyRoute: React.FC<{ studySets: StudySet[]; lang: Language }> = ({ studySets, lang }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(0);
  const set = studySets.find((s) => s.id === id);
  const isUz = lang === 'uz';

  if (!set) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          {isUz ? 'To\'plam topilmadi' : 'Study set not found'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isUz ? 'U o\'chirilgan yoki boshqa qurilmada yaratilgan bo\'lishi mumkin.' : 'It may have been deleted or created on another device.'}
        </p>
        <Button variant="primary" size="md" onClick={() => navigate('/dashboard')}>
          {isUz ? 'Kabinetga qaytish' : 'Back to dashboard'}
        </Button>
      </div>
    );
  }

  const finish = () => navigate('/dashboard');
  const retake = () => setAttempt((n) => n + 1);

  switch (set.type) {
    case 'quiz':
      return <QuizRunner key={attempt} set={set} lang={lang} onFinish={finish} onRetake={retake} />;
    case 'flashcards':
      return <FlashcardPlayer key={attempt} set={set} lang={lang} onFinish={finish} />;
    case 'notes':
      return <NotesViewer set={set} lang={lang} onBack={finish} />;
    case 'exam':
      return <ExamSimulator key={attempt} set={set} lang={lang} onFinish={finish} onRetake={retake} />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default function App() {
  // Initialize storage on first load
  useEffect(() => {
    initStorage();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const [lang, setLang] = useState<Language>(getSavedLanguage());
  const [theme, setTheme] = useState<'light' | 'dark'>(getSavedTheme());
  const [studySets, setStudySets] = useState<StudySet[]>(getStudySets());
  const [stats, setStats] = useState<UserStats>(getUserStats());

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialType, setCreateModalInitialType] = useState<StudySetType>('quiz');
  const [createModalInitialSource, setCreateModalInitialSource] = useState<SourceType>('text');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'contact' | null>(null);
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);

  // Sync with storage updates
  useEffect(() => {
    const unsubscribe = subscribeStorage(() => {
      setStudySets(getStudySets());
      setStats(getUserStats());
    });
    return () => unsubscribe();
  }, []);

  // Sync theme class on body
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Scroll to top on page change, or to the #section in the URL
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash]);

  const handleOpenCreateModal = (type: StudySetType = 'quiz', source: SourceType = 'text') => {
    setCreateModalInitialType(type);
    setCreateModalInitialSource(source);
    setIsCreateModalOpen(true);
  };

  // Components still call onNavigate(route); some routes open modals instead of pages.
  const handleNavigate = (route: string) => {
    if (route === '/pricing') {
      navigate('/#pricing');
    } else if (route === '/quizzes-ai/pdf') {
      navigate('/quizzes-ai');
      handleOpenCreateModal('quiz', 'pdf');
    } else if (route === '/quizzes-ai/video') {
      navigate('/quizzes-ai');
      handleOpenCreateModal('quiz', 'youtube');
    } else if (route === '/auth') {
      setIsAuthModalOpen(true);
    } else if (route === '/onboarding') {
      setIsOnboardingOpen(true);
    } else if (route === '/terms' || route === '/privacy' || route === '/contact') {
      setLegalModalType(route.substring(1) as 'terms' | 'privacy' | 'contact');
    } else {
      navigate(route);
    }
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

  const openSet = (set: StudySet) => navigate(`/study/${set.id}`);

  const handleDeleteSet = (id: string) => {
    deleteStudySet(id);
    if (location.pathname === `/study/${id}`) navigate('/dashboard');
  };

  const openBeta = () => setIsBetaModalOpen(true);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Navbar
        currentRoute={location.pathname}
        onNavigate={handleNavigate}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onOpenCreateModal={() => handleOpenCreateModal('quiz')}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenBeta={openBeta}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                lang={lang}
                onNavigate={handleNavigate}
                onSetGenerated={openSet}
                onOpenCreateModal={() => handleOpenCreateModal('quiz')}
                onOpenBeta={openBeta}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                studySets={studySets}
                stats={stats}
                lang={lang}
                onOpenSet={openSet}
                onDeleteSet={handleDeleteSet}
                onOpenCreateModal={handleOpenCreateModal}
                onOpenBeta={openBeta}
              />
            }
          />
          <Route
            path="/quizzes-ai"
            element={
              <QuizzesPage
                studySets={studySets}
                lang={lang}
                onOpenCreateModal={(type) => handleOpenCreateModal(type || 'quiz')}
                onDeleteSet={handleDeleteSet}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/flashcards-ai"
            element={
              <FlashcardsPage
                studySets={studySets}
                lang={lang}
                onOpenCreateModal={(type) => handleOpenCreateModal(type || 'flashcards')}
                onDeleteSet={handleDeleteSet}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/ai-notes"
            element={
              <NotesPage
                studySets={studySets}
                lang={lang}
                onOpenCreateModal={(type) => handleOpenCreateModal(type || 'notes')}
                onDeleteSet={handleDeleteSet}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/exam-simulator"
            element={
              <ExamPage
                studySets={studySets}
                lang={lang}
                onOpenCreateModal={(type) => handleOpenCreateModal(type || 'exam')}
                onDeleteSet={handleDeleteSet}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route path="/study/:id" element={<StudyRoute studySets={studySets} lang={lang} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <CreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        lang={lang}
        initialType={createModalInitialType}
        initialSourceType={createModalInitialSource}
        onSetCreated={openSet}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} lang={lang} />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        lang={lang}
        onStartCreating={() => handleOpenCreateModal('quiz')}
      />

      <LegalModals type={legalModalType} onClose={() => setLegalModalType(null)} lang={lang} />

      <BetaModal isOpen={isBetaModalOpen} onClose={() => setIsBetaModalOpen(false)} lang={lang} />

      <ToastContainer />

      <Footer lang={lang} onNavigate={handleNavigate} onOpenLegalModal={(type) => setLegalModalType(type)} />
    </div>
  );
}
