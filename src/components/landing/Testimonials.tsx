import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, Sparkles, Send, CheckCircle2, UserCheck, HeartHandshake } from 'lucide-react';
import { Language } from '../../lib/i18n';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { getUserFeedbacks, addUserFeedback, getCurrentUser, subscribeStorage } from '../../lib/storage';
import { FeedbackItem } from '../../types';
import { toast } from '../ui/Toast';

interface TestimonialsProps {
  lang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const isUz = lang === 'uz';
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(getUserFeedbacks());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Feedback form state
  const currentUser = getCurrentUser();
  const [name, setName] = useState(currentUser?.name || '');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const unsub = subscribeStorage(() => {
      setFeedbacks(getUserFeedbacks());
      const u = getCurrentUser();
      if (u && !name) setName(u.name);
    });
    return () => unsub();
  }, []);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    addUserFeedback({
      name: name.trim(),
      role: role.trim() || (isUz ? 'O\'rganuvchi' : 'Learner'),
      rating,
      text: comment.trim(),
    });

    toast.success(isUz ? 'Fikringiz uchun tashakkur! Saytda e\'lon qilindi.' : 'Thank you for your feedback! Posted.');
    setComment('');
    setIsModalOpen(false);
  };

  return (
    <section className="py-20 bg-secondary/30 border-y border-border/70 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Transparent & Honest Early Stage Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/20">
            <Sparkles size={13} className="text-emerald-500" />
            <span>{isUz ? 'Erta sinov bosqichi (Beta)' : 'Early Access Beta'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground">
            {isUz ? 'Biz yangi ishga tushdik — Fikringiz biz uchun muhim!' : 'We just launched — Your feedback shapes QuizPilot!'}
          </h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {isUz
              ? 'Platformamiz endigina ishga tushirildi. Sun\'iy ma\'lumotlar yoki soxta foydalanuvchilar o\'rniga, biz dastlabki o\'rganuvchilarimizning xolis fikr va takliflariga tayanamiz.'
              : 'Our platform has just launched. Instead of inflated numbers, we rely on genuine feedback from our very first learners to build a truly great tool.'}
          </p>

          <div className="mt-6 flex justify-center">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
              icon={<MessageSquarePlus size={16} />}
              className="shadow-sm"
            >
              {isUz ? 'O\'z fikringiz yoki taklifingizni qoldiring' : 'Leave your feedback or suggestion'}
            </Button>
          </div>
        </div>

        {/* Real User Reviews Display OR Honest Early Adopter Cards */}
        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-soft flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star key={idx} size={15} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-5 mt-5 border-t border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">{item.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-soft flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <UserCheck size={24} />
              </div>
              <h3 className="text-base font-serif font-bold text-foreground mb-2">
                {isUz ? 'Birinchi sinovchi bo\'ling' : 'Be the first reviewer'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isUz
                  ? 'Saytda test yarating, flesh-kartalarni ko\'ring va taassurotlaringizni qoldiring. Sizning sharhingiz birinchilardan bo\'lib bu yerda ko\'rinadi.'
                  : 'Generate a quiz, study with cards, and share your thoughts. Your feedback will be featured right here.'}
              </p>
            </div>

            <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-soft flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <Sparkles size={24} />
              </div>
              <h3 className="text-base font-serif font-bold text-foreground mb-2">
                {isUz ? '100% Shaffof rivojlanish' : '100% Transparent growth'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isUz
                  ? 'Bizda yolg\'on statistikalar yoki soxta sharhlar yo\'q. Har bir baholash va taklif haqiqiy o\'rganuvchilar tomonidan kiritiladi.'
                  : 'No fabricated reviews or fake metrics. Everything here is powered by real students and educators.'}
              </p>
            </div>

            <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-soft flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <HeartHandshake size={24} />
              </div>
              <h3 className="text-base font-serif font-bold text-foreground mb-2">
                {isUz ? 'Sizning taklifingiz muhim' : 'Your ideas matter'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isUz
                  ? 'O\'qish samaradorligini oshirish uchun qaysi vosita yetishmayapti? Taklifingiz asosida keyingi versiyalarda yangi imkoniyatlar qo\'shiladi.'
                  : 'Missing a specific study tool? Your direct suggestions directly decide our upcoming features.'}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Leave Feedback Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isUz ? 'QuizPilot haqida fikr yoki taklif qoldirish' : 'Share Feedback on QuizPilot'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {isUz ? 'Ismingiz' : 'Your Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Asilbek Valiyev"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {isUz ? 'Kasbingiz yoki ta\'lim yo\'nalishingiz' : 'Role or Field of Study'}
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder={isUz ? 'Masalan: Dasturchi, Tibbiyot talabasi, Repetitor' : 'e.g. Medical Student, Software Engineer, Teacher'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              {isUz ? 'Baholash (Yulduzlar)' : 'Rating'}
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-500 hover:scale-110 transition-transform"
                >
                  <Star
                    size={22}
                    className={star <= rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-foreground ml-2">{rating} / 5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {isUz ? 'Fikringiz, taassurotlaringiz yoki taklifingiz' : 'Your review or suggestions'}
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isUz ? 'QuizPilot menga qanday yordam berdi yoki nimalarni yaxshilash kerak...' : 'How QuizPilot helped you or what we could improve...'}
              className="w-full p-3.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              {isUz ? 'Bekor qilish' : 'Cancel'}
            </Button>
            <Button variant="primary" size="sm" icon={<Send size={14} />}>
              {isUz ? 'Fikrni yuborish' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </Modal>

    </section>
  );
};
