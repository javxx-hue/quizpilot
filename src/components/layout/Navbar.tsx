import React, { useState } from 'react';
import { Send, Sun, Moon, Key, Menu, X, Sparkles, HelpCircle, LogIn, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Language, getTranslations } from '../../lib/i18n';
import { ApiKeyModal } from './ApiKeyModal';
import { useAuth } from '../../lib/auth';
import { connectTelegram, isTelegramConfigured } from '../../lib/telegram';
import { toast } from '../ui/Toast';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onOpenCreateModal: () => void;
  onOpenAuthModal: () => void;
  onOpenOnboarding: () => void;
  onOpenBeta: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  lang,
  onLanguageChange,
  theme,
  onThemeToggle,
  onOpenCreateModal,
  onOpenAuthModal,
  onOpenOnboarding,
  onOpenBeta,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const { user: currentUser, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const t = getTranslations(lang);

  const navLinks = [
    { label: lang === 'uz' ? 'Fanlarim' : 'My subjects', route: '/subjects' },
    { label: t.nav.quizzes, route: '/quizzes-ai' },
    { label: t.nav.flashcards, route: '/flashcards-ai' },
    { label: t.nav.notes, route: '/ai-notes' },
    { label: t.nav.examSimulator, route: '/exam-simulator' },
    { label: t.nav.dashboard, route: '/dashboard' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(lang === 'uz' ? 'Tizimdan chiqdingiz' : 'Signed out');
    } catch {
      toast.error(lang === 'uz' ? 'Chiqishda xatolik' : 'Sign out failed');
    }
  };

  const handleLinkClick = (route: string) => {
    setMobileMenuOpen(false);
    if (route.startsWith('#')) {
      if (currentRoute !== '/') {
        onNavigate('/');
        setTimeout(() => {
          document.querySelector(route)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.querySelector(route)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(route);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/85 border-b border-border/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-sm">
              <Send size={18} className="transform -rotate-12 translate-x-0.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold tracking-tight text-foreground">
                QuizPilot
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className={`text-xs xl:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  currentRoute === link.route
                    ? 'text-primary font-semibold bg-secondary/80'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Tour / Guide */}
            <button
              onClick={onOpenOnboarding}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors hidden sm:flex"
              title={lang === 'uz' ? 'Qo\'llanma' : 'Onboarding Tour'}
            >
              <HelpCircle size={17} />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center rounded-xl bg-secondary/70 p-0.5 border border-border/70 text-xs font-semibold">
              <button
                onClick={() => onLanguageChange('uz')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === 'uz' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="O'zbekcha"
              >
                UZ
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  lang === 'en' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors hidden sm:flex"
              title={t.nav.apiKey}
            >
              <Key size={17} />
            </button>

            {/* User Profile or Sign In Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-secondary/70 transition-all text-xs font-semibold shadow-xs"
                >
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[90px] truncate text-foreground hidden md:inline">{currentUser.name}</span>
                  {currentUser.provider === 'google' && (
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.14 0 9.97 0 12s.45 3.86 1.24 5.42l4.04-3.13z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                    </svg>
                  )}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-card border border-border shadow-xl p-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-border/60">
                      <div className="text-xs font-bold text-foreground truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{currentUser.email}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                          Beta
                        </span>
                        {currentUser.provider === 'google' && (
                          <span className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-1 rounded font-medium">Google</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('/dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-secondary rounded-xl mt-1 font-medium"
                    >
                      {lang === 'uz' ? 'Mening to\'plamlarim' : 'My Study Sets'}
                    </button>
                    {isTelegramConfigured && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          connectTelegram().catch(() => toast.error(lang === 'uz' ? 'Telegram ulanmadi' : 'Could not connect Telegram'));
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-foreground hover:bg-secondary rounded-xl font-medium"
                      >
                        {lang === 'uz' ? 'Telegram eslatmalari' : 'Telegram reminders'}
                      </button>
                    )}
                    <div className="border-t border-border/60 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleSignOut();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl font-semibold flex items-center gap-1.5"
                      >
                        <LogOut size={13} />
                        <span>{lang === 'uz' ? 'Chiqish' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenAuthModal}
                className="hidden sm:inline-flex text-xs items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.14 0 9.97 0 12s.45 3.86 1.24 5.42l4.04-3.13z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                </svg>
                <span>{t.nav.signIn}</span>
              </Button>
            )}

            {/* Beta badge (payments are not live yet) */}
            <button
              onClick={onOpenBeta}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors"
            >
              <Sparkles size={14} />
              <span>{lang === 'uz' ? 'Beta: bepul' : 'Beta: free'}</span>
            </button>

            {/* Create CTA Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenCreateModal}
              icon={<Sparkles size={14} className="text-amber-400" />}
              className="hidden sm:inline-flex"
            >
              {t.hero.ctaPrimary}
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-xl text-foreground hover:bg-secondary/60"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2 border-t border-border/70">
              {currentUser ? (
                <div className="p-3 rounded-2xl bg-secondary/70 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title={lang === 'uz' ? 'Chiqish' : 'Sign Out'}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/60 rounded-xl"
                >
                  <LogIn size={16} />
                  {t.nav.signIn}
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOnboarding();
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/60 rounded-xl"
              >
                <HelpCircle size={16} />
                {lang === 'uz' ? 'Qo\'llanma (Tour)' : 'Onboarding Tour'}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setApiKeyModalOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/60 rounded-xl"
              >
                <Key size={16} />
                {t.nav.apiKey}
              </button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCreateModal();
                }}
                icon={<Sparkles size={16} className="text-amber-400" />}
                className="w-full justify-center"
              >
                {t.hero.ctaPrimary}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        lang={lang}
      />
    </>
  );
};
