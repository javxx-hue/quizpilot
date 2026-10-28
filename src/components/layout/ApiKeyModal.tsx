import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Key, Sparkles, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { getApiKey, setApiKey } from '../../lib/storage';
import { Language, getTranslations } from '../../lib/i18n';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, lang }) => {
  const t = getTranslations(lang).settings;
  const [keyInput, setKeyInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getApiKey());
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    setApiKey(keyInput);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.title} maxWidth="md">
      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <Sparkles size={16} className="shrink-0 mt-0.5" />
          <p>{t.smartModeNote}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
            <Key size={15} />
            {t.geminiKeyLabel}
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder={t.geminiKeyPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <ShieldCheck size={13} />
            {t.geminiHelp}
          </p>
        </div>

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {t.getKeyLink}
          <ExternalLink size={12} />
        </a>

        <div className="pt-2 flex justify-end gap-2.5 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            {lang === 'uz' ? 'Yopish' : 'Close'}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} icon={isSaved ? <Check size={15} /> : undefined}>
            {isSaved ? t.keySaved : t.saveBtn}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
