import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles } from 'lucide-react';
import { Language } from '../../lib/i18n';

interface BetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

// Shown wherever an upgrade/payment button used to be. Real payments
// (Payme/Click with server-side webhook verification) come in v1.1.
export const BetaModal: React.FC<BetaModalProps> = ({ isOpen, onClose, lang }) => {
  const isUz = lang === 'uz';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-sm">
          <Sparkles size={22} className="text-amber-400" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-foreground">
          {isUz ? 'Beta davrida hammasi bepul' : 'Everything is free during the beta'}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isUz
            ? 'Hozir barcha imkoniyatlardan bepul foydalanishingiz mumkin. Pullik tariflar keyinroq Payme va Click orqali qo\'shiladi, bu haqda oldindan xabar beramiz.'
            : 'All features are free right now. Paid plans will arrive later via Payme and Click, and we will announce them in advance.'}
        </p>
        <Button variant="primary" size="md" className="w-full" onClick={onClose}>
          {isUz ? 'Tushunarli' : 'Got it'}
        </Button>
      </div>
    </Modal>
  );
};
