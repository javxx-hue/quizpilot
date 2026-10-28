import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Mail, Lock, User, Sparkles, AlertCircle } from 'lucide-react';
import { Language } from '../../lib/i18n';
import { toast } from '../ui/Toast';
import { useAuth } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.14 0 9.97 0 12s.45 3.86 1.24 5.42l4.04-3.13z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
  </svg>
);

function describeAuthError(error: unknown, isUz: boolean): string {
  const message = error instanceof Error ? error.message : '';
  if (message === 'SUPABASE_NOT_CONFIGURED') {
    return isUz ? 'Hisoblar hali sozlanmagan.' : 'Accounts are not set up yet.';
  }
  if (/invalid login credentials/i.test(message)) {
    return isUz ? 'Email yoki parol noto\'g\'ri.' : 'Wrong email or password.';
  }
  if (/already registered/i.test(message)) {
    return isUz ? 'Bu email bilan hisob allaqachon bor. Kirish bo\'limidan foydalaning.' : 'This email is already registered. Please sign in.';
  }
  if (/password/i.test(message)) {
    return isUz ? 'Parol kamida 8 belgidan iborat bo\'lishi kerak.' : 'Password must be at least 8 characters.';
  }
  if (/email not confirmed/i.test(message)) {
    return isUz ? 'Avval emailingizga yuborilgan havola orqali tasdiqlang.' : 'Please confirm your email first.';
  }
  return isUz ? 'Xatolik yuz berdi, qayta urinib ko\'ring.' : 'Something went wrong, please try again.';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, lang }) => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const isUz = lang === 'uz';

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsBusy(true);
    try {
      if (isRegister) {
        const { needsConfirmation } = await signUp(email.trim(), password, name.trim());
        toast.success(
          needsConfirmation
            ? isUz ? 'Emailingizga tasdiqlash havolasi yuborildi.' : 'Check your email to confirm your account.'
            : isUz ? 'Hisob yaratildi!' : 'Account created!'
        );
      } else {
        await signIn(email.trim(), password);
        toast.success(isUz ? 'Xush kelibsiz!' : 'Welcome back!');
      }
      setPassword('');
      onClose();
    } catch (error) {
      toast.error(describeAuthError(error, isUz));
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogle = async () => {
    try {
      // Redirects away to Google; the session is picked up on return
      await signInWithGoogle();
    } catch (error) {
      toast.error(describeAuthError(error, isUz));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Sparkles size={22} className="text-amber-400" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-foreground">
            {isRegister ? (isUz ? 'Ro\'yxatdan o\'tish' : 'Create an Account') : (isUz ? 'Kirish' : 'Sign In')}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isUz ? 'O\'quv to\'plamlaringizni barcha qurilmalarda sinxronlang' : 'Sync your study materials across all devices'}
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>
              {isUz
                ? 'Hisoblar hali sozlanmagan (.env faylida Supabase kalitlari yo\'q). Saytdan hisobsiz foydalanishingiz mumkin.'
                : 'Accounts are not set up yet (Supabase keys missing in .env). You can keep using the site without an account.'}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          disabled={!isSupabaseConfigured}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-secondary/70 text-foreground font-semibold text-xs sm:text-sm shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoogleIcon />
          <span>{isUz ? 'Google orqali davom etish' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-border w-full" />
          <span className="bg-card px-2.5 text-[10px] uppercase font-bold text-muted-foreground absolute">
            {isUz ? 'yoki email orqali' : 'or with email'}
          </span>
        </div>

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
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                autoComplete="email"
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
                minLength={8}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <Button variant="primary" size="md" className="w-full shadow-sm mt-2" disabled={isBusy || !isSupabaseConfigured}>
            {isRegister ? (isUz ? 'Hisob yaratish' : 'Create Account') : (isUz ? 'Kirish' : 'Sign In')}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground pt-1">
          {isRegister ? (isUz ? 'Allaqachon hisobingiz bormi?' : 'Already have an account?') : (isUz ? 'Hisobingiz yo\'qmi?' : "Don't have an account?")}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary font-bold hover:underline"
          >
            {isRegister ? (isUz ? 'Kirish' : 'Sign In') : (isUz ? 'Ro\'yxatdan o\'tish' : 'Sign Up')}
          </button>
        </p>
      </div>
    </Modal>
  );
};
