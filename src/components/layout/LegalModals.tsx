import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Send, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../../lib/i18n';
import { toast } from '../ui/Toast';

interface LegalModalProps {
  type: 'terms' | 'privacy' | 'contact' | null;
  onClose: () => void;
  lang: Language;
}

export const LegalModals: React.FC<LegalModalProps> = ({ type, onClose, lang }) => {
  const isUz = lang === 'uz';
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success(isUz ? 'Xabaringiz yuborildi! Tez orada javob beramiz.' : 'Message sent! We will reply soon.');
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={type !== null}
      onClose={onClose}
      title={
        type === 'terms'
          ? (isUz ? 'Foydalanish Shartlari' : 'Terms of Service')
          : type === 'privacy'
          ? (isUz ? 'Maxfiylik Siyosati' : 'Privacy Policy')
          : (isUz ? 'Biz bilan bog\'lanish' : 'Contact Support')
      }
      maxWidth="lg"
    >
      {type === 'terms' && (
        <div className="space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed max-h-96 overflow-y-auto pr-2">
          <p>
            <strong>1. Xizmat haqida:</strong> QuizPilot.io foydalanuvchilarga sun'iy intellekt vositasida ta'lim materiallari (testlar, kartochkalar, konspektlar) yaratish platformasini taqdim etadi.
          </p>
          <p>
            <strong>2. Foydalanuvchi majburiyatlari:</strong> Foydalanuvchi intellektual mulk huquqlarini buzuvchi yoki noqonuniy materiallarni tizimga yuklamaslikka rozi bo'ladi.
          </p>
          <p>
            <strong>3. Xizmat barqarorligi:</strong> Biz tizimning uzluksiz va xavfsiz ishlashini ta'minlashga intilamiz.
          </p>
          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={onClose}>
              {isUz ? 'Tushundim' : 'Got it'}
            </Button>
          </div>
        </div>
      )}

      {type === 'privacy' && (
        <div className="space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed max-h-96 overflow-y-auto pr-2">
          <p>
            <strong>1. Maxfiylik ustuvorligi:</strong> Siz yuklagan PDF fayllar va shaxsiy konspektlar bevosita brauzeringizda qayta ishlanadi va uchinchi tomon serverlariga saqlanmaydi.
          </p>
          <p>
            <strong>2. API Kalitlari xavfsizligi:</strong> Kiritilgan Gemini API kaliti faqat sizning mahalliy brauzeringiz xotirasida (LocalStorage) saqlanadi.
          </p>
          <p>
            <strong>3. Cookie va kuzatuv:</strong> Biz shaxsiy identifikatsiya ma'lumotlarini sotmaymiz.
          </p>
          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={onClose}>
              {isUz ? 'Tushundim' : 'Got it'}
            </Button>
          </div>
        </div>
      )}

      {type === 'contact' && (
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {isUz ? 'Ismingiz' : 'Name'}
            </label>
            <input
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Ali Valiyev"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="aloqa@example.com"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {isUz ? 'Xabar yoki taklif' : 'Message'}
            </label>
            <textarea
              required
              rows={4}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder={isUz ? 'Savol yoki taklifingizni yozing...' : 'How can we help you?'}
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={onClose}>
              {isUz ? 'Bekor qilish' : 'Cancel'}
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={sent ? <CheckCircle2 size={16} /> : <Send size={15} />}
            >
              {sent ? (isUz ? 'Yuborildi!' : 'Sent!') : (isUz ? 'Xabarni yuborish' : 'Send Message')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
