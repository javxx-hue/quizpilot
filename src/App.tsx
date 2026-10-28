import React, { useState, useEffect, lazy, Suspense } from 'react';
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


import {
  initStorage,
  getStudySets,
  getSubjects,
  getUserStats,
  deleteStudySet,
  getSavedLanguage,
  setSavedLanguage,
  getSavedTheme,
  setSavedTheme,
  subscribeStorage,
} from './lib/storage';
import { Language } from './lib/i18n';
import { isMastered } from './lib/srs';
import { useAuth } from './lib/auth';
import { startSync } from './lib/sync';
import { StudySet, StudySetType, Subject, UserStats } from './types';

// Pages load on demand to keep the first download small on mobile data
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const QuizzesPage = lazy(() => import('./pages/QuizzesPage').then((m) => ({ default: m.QuizzesPage })));
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage').then((m) => ({ default: m.FlashcardsPage })));
const NotesPage = lazy(() => import('./pages/NotesPage').then((m) => ({ default: m.NotesPage })));
const ExamPage = lazy(() => import('./pages/ExamPage').then((m) => ({ default: m.ExamPage })));
const SubjectsPage = lazy(() => import('./pages/SubjectsPage').then((m) => ({ default: m.SubjectsPage })));
const SubjectPage = lazy(() => import('./pages/SubjectPage').then((m) => ({ default: m.SubjectPage })));
const QuestionPracticePage = lazy(() => import('./pages/QuestionPracticePage').then((m) => ({ default: m.QuestionPracticePage })));
const QuizRunner = lazy(() => import('./components/study/QuizRunner').then((m) => ({ default: m.QuizRunner })));
const FlashcardPlayer = lazy(() => import('./components/study/FlashcardPlayer').then((m) => ({ default: m.FlashcardPlayer })));
const NotesViewer = lazy(() => import('./components/study/NotesViewer').then((m) => ({ default: m.NotesViewer })));
const ExamSimulator = lazy(() => import('./components/study/ExamSimulator').then((m) => ({ default: m.ExamSimulator })));

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
  const { user } = useAuth();

  // Mirror local data to Supabase while signed in
  useEffect(() => {
    if (!user) return;
    return startSync((status) => {
      if (status === 'error') console.warn('Cloud sync failed; data is still saved in this browser.');
    });
  }, [user?.id]);

  const [lang, setLang] = useState<Language>(getSavedLanguage());
  const [theme, setTheme] = useState<'light' | 'dark'>(getSavedTheme());
  const [studySets, setStudySets] = useState<StudySet[]>(getStudySets());
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [subjects, setSubjects] = useState<Subject[]>(getSubjects());

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
      setSubjects(getSubjects());
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

  // Derived from card states, so re-rating the same card can't inflate it
  const cardsMastered = studySets.reduce((sum, s) => sum + (s.flashcards?.filter(isMastered).length ?? 0), 0);
  const dashboardStats = { ...stats, cardsMastered };

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
        <Suspense fallback={<div className="py-24 text-center text-sm text-muted-foreground">{lang === 'uz' ? 'Yuklanmoqda...' : 'Loading...'}</div>}>
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
                subjects={subjects}
                stats={dashboardStats}
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
          <Route path="/subjects" element={<SubjectsPage subjects={subjects} studySets={studySets} lang={lang} />} />
          <Route path="/subjects/:id" element={<SubjectPage subjects={subjects} studySets={studySets} lang={lang} />} />
          <Route path="/subjects/:id/q/:qid" element={<QuestionPracticePage subjects={subjects} lang={lang} />} />
          <Route path="/study/:id" element={<StudyRoute studySets={studySets} lang={lang} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
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
