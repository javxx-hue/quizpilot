import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Youtube, Lightbulb, Sparkles, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { Language, getTranslations } from '../../lib/i18n';
import { extractTextFromPdf } from '../../lib/pdfParser';
import { generateStudySet, describeGenerationError } from '../../lib/ai';
import { saveStudySet } from '../../lib/storage';
import { StudySet } from '../../types';
import { getYouTubeInfo, fetchYouTubeTitle, YouTubeVideoInfo } from '../../lib/youtubeParser';
import { toast } from '../ui/Toast';

interface QuickInputBoxProps {
  lang: Language;
  onSetGenerated: (set: StudySet) => void;
  defaultTab?: 'text' | 'pdf' | 'youtube' | 'topic';
}

export const QuickInputBox: React.FC<QuickInputBoxProps> = ({
  lang,
  onSetGenerated,
  defaultTab = 'text',
}) => {
  const t = getTranslations(lang).quickInput;
  const [activeTab, setActiveTab] = useState<'text' | 'pdf' | 'youtube' | 'topic'>(defaultTab);
  const [inputText, setInputText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [ytInfo, setYtInfo] = useState<YouTubeVideoInfo | null>(null);
  const [ytTitle, setYtTitle] = useState<string>('');
  const [topicPrompt, setTopicPrompt] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Watch YouTube URL changes
  useEffect(() => {
    const info = getYouTubeInfo(videoUrl);
    setYtInfo(info);
    if (info) {
      fetchYouTubeTitle(videoUrl).then((title) => {
        if (title) setYtTitle(title);
      });
    } else {
      setYtTitle('');
    }
  }, [videoUrl]);

  const handleGenerate = async () => {
    let rawContent = '';
    let sourceType: 'text' | 'pdf' | 'youtube' | 'prompt' | 'topic' = activeTab;
    let inferredTitle = '';

    if (activeTab === 'text') {
      if (!inputText.trim()) return;
      rawContent = inputText;
    } else if (activeTab === 'pdf') {
      if (!pdfFile) return;
      rawContent = await extractTextFromPdf(pdfFile);
      inferredTitle = pdfFile.name.replace(/\.[^/.]+$/, '');
    } else if (activeTab === 'youtube') {
      // No transcript support yet: the title alone is not study material.
      toast.error(lang === 'uz' ? 'YouTube videodan yaratish tez orada qo\'shiladi. Hozircha matn yoki PDF yuklang.' : 'YouTube support is coming soon. Use text or PDF for now.');
      return;
    } else if (activeTab === 'topic') {
      if (!topicPrompt.trim()) return;
      rawContent = `Mavzu va asosiy savollar: ${topicPrompt}. Tushunchalar, formulalar, tarixiy va amaliy faktlar.`;
      inferredTitle = topicPrompt;
    }

    try {
      setIsGenerating(true);
      const generatedSet = await generateStudySet({
        rawContent,
        sourceType,
        targetType: 'quiz',
        title: inferredTitle,
        count: 5,
        difficulty: 'medium',
        language: lang,
      });

      saveStudySet(generatedSet);
      toast.success(lang === 'uz' ? 'AI test muvaffaqiyatli yaratildi!' : 'AI Quiz generated successfully!');
      onSetGenerated(generatedSet);
    } catch (e) {
      console.error('Generation failed', e);
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

  const canGenerate = () => {
    if (activeTab === 'text') return inputText.trim().length > 10;
    if (activeTab === 'pdf') return pdfFile !== null;
    if (activeTab === 'youtube') return ytInfo !== null;
    if (activeTab === 'topic') return topicPrompt.trim().length > 3;
    return false;
  };

  const handleSampleClick = (sampleText: string) => {
    setActiveTab('text');
    setInputText(
      lang === 'uz'
        ? `${sampleText}: Bu jarayon tirik organizmlarda poydevor ahamiyatga ega bo'lib, energiya hosil bo'lishi va metabolizm sikllarini ta'minlaydi. Fotosintez natijasida quyosh energiyasi kimyoviy bog'lar energiyasiga aylanadi va biosferaga kislorod ajralib chiqadi.`
        : `${sampleText}: An essential biological mechanism responsible for energy transduction and cellular metabolism. Through this pathway, solar radiation converts into stable chemical bonds while releasing oxygen into the atmosphere.`
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl bg-card border border-border/80 shadow-elevated p-4 sm:p-6 transition-all">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-secondary/70 rounded-2xl border border-border/60 mb-4">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'text' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText size={15} />
          {t.tabText}
        </button>
        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'pdf' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload size={15} />
          {t.tabPdf}
        </button>
        <button
          onClick={() => setActiveTab('youtube')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'youtube' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Youtube size={15} className="text-red-500" />
          {t.tabVideo}
        </button>
        <button
          onClick={() => setActiveTab('topic')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'topic' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lightbulb size={15} className="text-amber-500" />
          {t.tabTopic}
        </button>
      </div>

      {/* Input Body */}
      <div className="mb-4">
        {activeTab === 'text' && (
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.placeholderText}
            rows={4}
            className="w-full p-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none transition-all"
          />
        )}

        {activeTab === 'pdf' && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border hover:border-primary/50 bg-background rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all hover:bg-secondary/30"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {pdfFile ? (
              <div className="flex flex-col items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={36} />
                <span className="font-semibold text-sm text-foreground">{pdfFile.name}</span>
                <span className="text-xs text-muted-foreground">({Math.round(pdfFile.size / 1024)} KB) - {t.pdfSelected}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload size={32} className="text-primary/70 mb-1" />
                <p className="text-sm font-medium text-foreground">{t.dropPdfHere}</p>
                <p className="text-xs text-muted-foreground">PDF (max 30MB)</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'youtube' && (
          <div className="space-y-3">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder={t.placeholderVideo}
              className="w-full p-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
            />

            {/* Live Video Preview Card */}
            {ytInfo && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 border border-border animate-in fade-in">
                <div className="relative w-28 h-18 rounded-xl overflow-hidden bg-black shrink-0">
                  <img
                    src={ytInfo.thumbnailUrl}
                    alt="YouTube Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center">
                      <Play size={12} className="ml-0.5 fill-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wide">
                    YouTube Video
                  </span>
                  <h4 className="text-xs sm:text-sm font-medium text-foreground truncate">
                    {ytTitle || 'YouTube Video tahlil qilinmoqda...'}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    AI video mavzusi va asosiy faktlarini ajratib oladi
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'topic' && (
          <input
            type="text"
            value={topicPrompt}
            onChange={(e) => setTopicPrompt(e.target.value)}
            placeholder={t.placeholderTopic}
            className="w-full p-4 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
          />
        )}
      </div>

      {/* Bottom Action & Sample Prompts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>{t.samplePrompts}</span>
          <button
            onClick={() => handleSampleClick(t.sample1)}
            className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            {t.sample1}
          </button>
          <button
            onClick={() => handleSampleClick(t.sample2)}
            className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            {t.sample2}
          </button>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleGenerate}
          disabled={!canGenerate() || isGenerating}
          icon={isGenerating ? <Sparkles size={16} className="animate-spin text-amber-400" /> : <Sparkles size={16} className="text-amber-400" />}
          className="shadow-sm"
        >
          {isGenerating ? t.generating : t.generateBtn}
          {!isGenerating && <ArrowRight size={15} className="ml-1" />}
        </Button>
      </div>
    </div>
  );
};
