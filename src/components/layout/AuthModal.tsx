import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Mail, Lock, User, ArrowRight, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { Language } from '../../lib/i18n';
import { toast } from '../ui/Toast';
import { setCurrentUser, getCurrentUser } from '../../lib/storage';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const isUz = lang === 'uz';

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const userName = name.trim() || email.split('@')[0];
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: userName,
      email: email.trim(),
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    toast.success(isUz ? `Xush kelibsiz, ${userName}!` : `Welcome, ${userName}!`);
    onClose();
  };

  const handleSelectGoogleAccount = (accEmail: string, accName: string) => {
    const newUser: UserProfile = {
      id: `goog_${Date.now()}`,
      name: accName,
      email: accEmail,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(accName)}&backgroundColor=4285f4,34a853,fbbc05,ea4335`,
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    setShowGoogleChooser(false);
    toast.success(isUz ? `Google orqali kirdingiz: ${accName}` : `Signed in with Google: ${accName}`);
    onClose();
  };

  const handleGuestLogin = () => {
    const guestUser: UserProfile = {
      id: `guest_${Date.now()}`,
      name: isUz ? 'Mehmon foydalanuvchi' : 'Guest Student',
      email: 'guest@quizpilot.io',
      provider: 'guest',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(guestUser);
    toast.success(isUz ? 'Mehmon rejimi faollashdi!' : 'Signed in as guest demo user!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-4">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Sparkles size={22} className="text-amber-400" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-foreground">
            {isRegister ? (isUz ? 'Ro\'yxatdan o\'tish' : 'Create an Account') : (isUz ? 'QuizPilot\'ga Kirish' : 'Sign In to QuizPilot')}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isUz ? 'O\'quv to\'plamlaringizni barcha qurilmalarda sinxronlang' : 'Sync your study materials across all devices'}
          </p>
        </div>

        {/* Google Chooser Sub-view */}
        {showGoogleChooser ? (
          <div className="space-y-3 p-4 rounded-2xl bg-secondary/50 border border-border animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.14 0 9.97 0 12s.45 3.86 1.24 5.42l4.04-3.13z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                </svg>
                {isUz ? 'Google hisobingizni tanlang' : 'Choose Google Account'}
              </span>
              <button
                type="button"
                onClick={() => setShowGoogleChooser(false)}
                className="text-[11px] text-muted-foreground hover:underline"
              >
                {isUz ? 'Orqaga' : 'Back'}
              </button>
            </div>

            {/* Quick pre-filled accounts for easy 1-click test */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('talaba.study@gmail.com', 'Talaba O\'quvchi')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-border/70 bg-card hover:bg-secondary text-left transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  T
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-foreground">Talaba O'quvchi</div>
                  <div className="text-[11px] text-muted-foreground truncate">talaba.study@gmail.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectGoogleAccount('asilbek.student@gmail.com', 'Asilbek Valiyev')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-border/70 bg-card hover:bg-secondary text-left transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-foreground">Asilbek Valiyev</div>
                  <div className="text-[11px] text-muted-foreground truncate">asilbek.student@gmail.com</div>
                </div>
              </button>
            </div>

            {/* Custom Google Email Input */}
            <div className="pt-2 border-t border-border/60">
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                {isUz ? 'Yoki boshqa Google pochta kiriting:' : 'Or enter custom Google account:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="nomingiz@gmail.com"
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (!googleEmailInput.includes('@')) {
                      toast.error(isUz ? 'Google pochtasini to\'g\'ri kiriting' : 'Enter valid Google email');
                      return;
                    }
                    const userName = googleEmailInput.split('@')[0].replace(/[._]/g, ' ');
                    handleSelectGoogleAccount(googleEmailInput, userName);
                  }}
                >
                  {isUz ? 'Ulash' : 'Connect'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Primary Google Auth Button */}
            <button
              type="button"
              onClick={() => setShowGoogleChooser(true)}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-secondary/70 text-foreground font-semibold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.99] group"
            >
              <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.14 0 9.97 0 12s.45 3.86 1.24 5.42l4.04-3.13z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>
                {isRegister ? (isUz ? 'Google orqali ro\'yxatdan o\'tish' : 'Sign up with Google') : (isUz ? 'Google orqali kirish' : 'Continue with Google')}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-border w-full" />
              <span className="bg-card px-2.5 text-[10px] uppercase font-bold text-muted-foreground absolute">
                {isUz ? 'yoki email orqali' : 'or with email'}
              </span>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {isUz ? 'Ismingiz' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ali Valiyev"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="talaba@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  {isUz ? 'Parol' : 'Password'}
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <Button variant="primary" size="md" className="w-full shadow-sm mt-2">
                {isRegister ? (isUz ? 'Hisob yaratish' : 'Create Account') : (isUz ? 'Kirish' : 'Sign In')}
              </Button>
            </form>

            <Button
              variant="outline"
              size="sm"
              onClick={handleGuestLogin}
              className="w-full text-xs"
            >
              {isUz ? 'Mehmon sifatida davom etish (Demo)' : 'Continue as Guest (Demo Mode)'}
            </Button>
          </>
        )}

        {/* Toggle between Register and Sign In */}
        <p className="text-center text-xs text-muted-foreground pt-1">
          {isRegister ? (isUz ? 'Allaqachon hisobingiz bormi?' : 'Already have an account?') : (isUz ? 'Hisobingiz yo\'qmi?' : "Don't have an account?")}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setShowGoogleChooser(false);
            }}
            className="text-primary font-bold hover:underline"
          >
            {isRegister ? (isUz ? 'Kirish' : 'Sign In') : (isUz ? 'Ro\'yxatdan o\'tish' : 'Sign Up')}
          </button>
        </p>

      </div>
    </Modal>
  );
};
