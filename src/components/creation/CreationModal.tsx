import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FileText, Upload, Youtube, Lightbulb, Sparkles, CheckCircle2, HelpCircle, Layers, Timer, Play } from 'lucide-react';
import { Language, getTranslations } from '../../lib/i18n';
import { StudySet, StudySetType, Difficulty } from '../../types';
import { extractTextFromPdf } from '../../lib/pdfParser';
import { generateStudySet, describeGenerationError } from '../../lib/ai';
import { saveStudySet } from '../../lib/storage';
import { getYouTubeInfo, fetchYouTubeTitle, YouTubeVideoInfo } from '../../lib/youtubeParser';
import { toast } from '../ui/Toast';

interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSetCreated: (set: StudySet) => void;
  initialType?: StudySetType;
  initialSourceType?: 'text' | 'pdf' | 'youtube' | 'topic';
}

export const CreationModal: React.FC<CreationModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSetCreated,
  initialType = 'quiz',
  initialSourceType = 'text',
}) => {
  const t = getTranslations(lang).creation;
  const [sourceType, setSourceType] = useState<'text' | 'pdf' | 'youtube' | 'topic'>(initialSourceType);
  const [targetType, setTargetType] = useState<StudySetType>(initialType);
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [ytInfo, setYtInfo] = useState<YouTubeVideoInfo | null>(null);
  const [ytTitle, setYtTitle] = useState<string>('');
  const [topicPrompt, setTopicPrompt] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [count, setCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTargetType(initialType);
      setSourceType(initialSourceType);
    }
  }, [isOpen, initialType, initialSourceType]);

  useEffect(() => {
    const info = getYouTubeInfo(videoUrl);
    setYtInfo(info);
    if (info) {
      fetchYouTubeTitle(videoUrl).then((fetchedTitle) => {
        if (fetchedTitle) {
          setYtTitle(fetchedTitle);
          if (!title) setTitle(fetchedTitle);
        }
      });
    }
  }, [videoUrl]);

  const handleGenerate = async () => {
    let rawContent = '';
    let inferredTitle = title.trim();

    if (sourceType === 'text') {
      if (!inputText.trim()) return;
      rawContent = inputText;
    } else if (sourceType === 'pdf') {
      if (!pdfFile) return;
      rawContent = await extractTextFromPdf(pdfFile);
      if (!inferredTitle) inferredTitle = pdfFile.name.replace(/\.[^/.]+$/, '');
    } else if (sourceType === 'youtube') {
      // No transcript support yet: the title alone is not study material.
      toast.error(lang === 'uz' ? 'YouTube videodan yaratish tez orada qo\'shiladi. Hozircha matn yoki PDF yuklang.' : 'YouTube support is coming soon. Use text or PDF for now.');
      return;
    } else if (sourceType === 'topic') {
      if (!topicPrompt.trim()) return;
      rawContent = `Topic and study domain: ${topicPrompt}. Detailed concepts, facts, and explanations.`;
      if (!inferredTitle) inferredTitle = topicPrompt;
    }

    try {
      setIsGenerating(true);
      const newSet = await generateStudySet({
        rawContent,
        sourceType,
        targetType,
        title: inferredTitle,
        count,
        difficulty,
        language: lang,
      });

      saveStudySet(newSet);
      toast.success(lang === 'uz' ? 'To\'plam muvaffaqiyatli yaratildi!' : 'Study kit created successfully!');
      onSetCreated(newSet);
      onClose();
    } catch (e) {
      console.error('Failed to create study set', e);
      toast.error(describeGenerationError(e, lang));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const canSubmit = () => {
    if (sourceType === 'text') return inputText.trim().length > 10;
    if (sourceType === 'pdf') return pdfFile !== null;
    if (sourceType === 'youtube') return ytInfo !== null;
    if (sourceType === 'topic') return topicPrompt.trim().length > 3;
    return false;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.modalTitle} maxWidth="xl">
      <div className="space-y-5">
        
        {/* Step 1: Select Material Type */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t.studyType}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setTargetType('quiz')}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${
                targetType === 'quiz'
                  ? 'bg-creation-quiz/20 border-creation-quiz text-creation-quiz-strong font-bold shadow-xs'
                  : 'bg-background border-border text-foreground hover:bg-secondary/40'
              }`}
            >
              <HelpCircle size={18} />
              <span>{t.typeQuiz}</span>
            </button>
            <button
              type="button"
              onClick={() => setTargetType('flashcards')}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${
                targetType === 'flashcards'
                  ? 'bg-creation-flashcards/20 border-creation-flashcards text-creation-flashcards-strong font-bold shadow-xs'
                  : 'bg-background border-border text-foreground hover:bg-secondary/40'
              }`}
            >
              <Layers size={18} />
              <span>{t.typeFlashcards}</span>
            </button>
            <button
              type="button"
              onClick={() => setTargetType('notes')}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${
                targetType === 'notes'
                  ? 'bg-creation-notes/20 border-creation-notes text-creation-notes-strong font-bold shadow-xs'
                  : 'bg-background border-border text-foreground hover:bg-secondary/40'
              }`}
            >
              <FileText size={18} />
              <span>{t.typeNotes}</span>
            </button>
            <button
              type="button"
              onClick={() => setTargetType('exam')}
              className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${
                targetType === 'exam'
                  ? 'bg-creation-exam/20 border-creation-exam text-creation-exam-strong font-bold shadow-xs'
                  : 'bg-background border-border text-foreground hover:bg-secondary/40'
              }`}
            >
              <Timer size={18} />
              <span>{t.typeExam}</span>
            </button>
          </div>
        </div>

        {/* Step 2: Content Source Tabs */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t.sourceType}
          </label>
          <div className="flex flex-wrap gap-1.5 p-1 bg-secondary/80 rounded-xl border border-border/60 mb-3">
            <button
              type="button"
              onClick={() => setSourceType('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sourceType === 'text' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground'
              }`}
            >
              <FileText size={14} />
              {t.sourceText}
            </button>
            <button
              type="button"
              onClick={() => setSourceType('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sourceType === 'pdf' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground'
              }`}
            >
              <Upload size={14} />
              {t.sourcePdf}
            </button>
            <button
              type="button"
              onClick={() => setSourceType('youtube')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sourceType === 'youtube' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground'
              }`}
            >
              <Youtube size={14} className="text-red-500" />
              {t.sourceYoutube}
            </button>
            <button
              type="button"
              onClick={() => setSourceType('topic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sourceType === 'topic' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground'
              }`}
            >
              <Lightbulb size={14} className="text-amber-500" />
              {t.sourceTopic}
            </button>
          </div>

          {sourceType === 'text' && (
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'uz' ? "Konspekt, maqola yoki darslik matnini bu yerga joylashtiring..." : "Paste your notes or text here..."}
              rows={4}
              className="w-full p-3.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
            />
          )}

          {sourceType === 'pdf' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/50 bg-background rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-secondary/30"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {pdfFile ? (
                <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={32} />
                  <span className="font-semibold text-sm text-foreground">{pdfFile.name}</span>
                  <span className="text-xs text-muted-foreground">({Math.round(pdfFile.size / 1024)} KB)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                  <Upload size={28} className="text-primary/70 mb-1" />
                  <p className="text-sm font-medium text-foreground">{lang === 'uz' ? 'PDF faylni yuklash' : 'Upload PDF Document'}</p>
                  <p className="text-xs text-muted-foreground">PDF (max 30MB)</p>
                </div>
              )}
            </div>
          )}

          {sourceType === 'youtube' && (
            <div className="space-y-3">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />

              {ytInfo && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border animate-in fade-in">
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-black shrink-0">
                    <img
                      src={ytInfo.thumbnailUrl}
                      alt="YouTube Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center">
                        <Play size={10} className="ml-0.5 fill-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-semibold text-red-600 uppercase">YouTube Video</span>
                    <h4 className="text-xs font-medium text-foreground truncate">{ytTitle || 'YouTube Video'}</h4>
                    <p className="text-[10px] text-muted-foreground">AI mavzuni tahlil qilib to'plam tuzadi</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {sourceType === 'topic' && (
            <input
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder={lang === 'uz' ? 'Masalan: Inson skeleti va suyaklar tuzilishi' : 'e.g., Human Skeletal System & Anatomy'}
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          )}
        </div>

        {/* Step 3: Optional Title & Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-border/60">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {t.titleInput}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {t.countLabel}
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={5}>5 {lang === 'uz' ? 'ta' : 'items'}</option>
              <option value={10}>10 {lang === 'uz' ? 'ta' : 'items'}</option>
              <option value={15}>15 {lang === 'uz' ? 'ta' : 'items'}</option>
              <option value={20}>20 {lang === 'uz' ? 'ta' : 'items'}</option>
              <option value={30}>30 {lang === 'uz' ? 'ta' : 'items'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {t.difficultyLabel}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="easy">{t.diffEasy}</option>
              <option value="medium">{t.diffMedium}</option>
              <option value="hard">{t.diffHard}</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end gap-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            {lang === 'uz' ? 'Bekor qilish' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleGenerate}
            disabled={!canSubmit() || isGenerating}
            icon={isGenerating ? <Sparkles size={16} className="animate-spin text-amber-400" /> : <Sparkles size={16} className="text-amber-400" />}
          >
            {isGenerating ? t.creatingWait : t.submitBtn}
          </Button>
        </div>

      </div>
    </Modal>
  );
};
