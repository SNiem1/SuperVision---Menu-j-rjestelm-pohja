import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { useReviews } from '../context/ReviewsContext';
import { Star, MessageSquarePlus, User, Calendar, CheckCircle, Loader2 } from 'lucide-react';

interface ReviewSectionProps {
  menuItem: MenuItem;
  language: 'fi' | 'en';
  onReviewAdded?: () => void;
}

export default function ReviewSection({ menuItem, language, onReviewAdded }: ReviewSectionProps) {
  const { reviewsByItem, getStats, addReview, fetchItemReviews, isItemLoading } = useReviews();

  useEffect(() => {
    fetchItemReviews(menuItem.id);
  }, [menuItem.id, fetchItemReviews]);

  const reviews = reviewsByItem.get(menuItem.id) || [];
  const ratingStats = getStats(menuItem.id);
  const isLoading = isItemLoading(menuItem.id);

  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!comment.trim()) {
      setErrorMsg(
        language === 'fi'
          ? 'Kirjoitathan arvostelun ennen tallentamista.'
          : 'Please write a review comment before saving.'
      );
      return;
    }

    await addReview(menuItem.id, rating, author, comment, language);
    setIsSuccess(true);
    setAuthor('');
    setComment('');
    setRating(5);

    // Notify parent if needed
    if (onReviewAdded) {
      onReviewAdded();
    }

    // Hide success message after 4 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'fi' ? 'fi-FI' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="space-y-6 pt-5 border-t border-brand-gold/25" id={`review-section-${menuItem.id}`}>
      {/* Review Summary / Average Header */}
      <div className="flex items-center justify-between p-4 bg-brand-cream border border-brand-gold/20 rounded-2xl shadow-2xs">
        <div>
          <h4 className="font-serif font-bold text-sm md:text-base text-brand-blue uppercase tracking-widest">
            {language === 'fi' ? 'Asiakkaiden Arviot' : 'Customer Reviews'}
          </h4>
          <p className="text-[11px] text-brand-blue/80 mt-0.5">
            {reviews.length > 0
              ? (language === 'fi' ? `${reviews.length} annettua arviota` : `${reviews.length} reviews submitted`)
              : (language === 'fi' ? 'Ei vielä arvioita. Ole ensimmäinen!' : 'No reviews yet. Be the first!')}
          </p>
        </div>
        
        {reviews.length > 0 && (
          <div className="flex flex-col items-end shrink-0">
            <div className="flex flex-row flex-nowrap items-center space-x-1.5 bg-white px-3 py-1.5 rounded-full border border-brand-gold/30 shadow-2xs whitespace-nowrap shrink-0">
              <Star className="w-4 h-4 fill-brand-gold text-brand-gold shrink-0" />
              <span className="font-sans font-extrabold text-sm text-brand-blue leading-none">
                {language === 'fi' ? ratingStats.average.toFixed(1).replace('.', ',') : ratingStats.average.toFixed(1)}
              </span>
              <span className="text-[10px] text-brand-blue/70 leading-none">/ 5</span>
            </div>
            <span className="text-[9px] tracking-widest text-brand-gold-text font-extrabold uppercase mt-1 whitespace-nowrap">
              {language === 'fi' ? 'Keskiarvo' : 'Average Rating'}
            </span>
          </div>
        )}
      </div>

      {/* Write a review form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-brand-gold/20 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-brand-blue">
          <MessageSquarePlus className="w-5 h-5 text-brand-gold" />
          <h5 className="font-serif font-bold uppercase tracking-wider text-sm">
            {language === 'fi' ? 'Kirjoita oma arvio' : 'Write your review'}
          </h5>
        </div>

        {isSuccess && (
          <div className="flex items-center space-x-2.5 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs sm:text-sm animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>
              {language === 'fi'
                ? 'Kiitos! Arvostelusi on tallennettu onnistuneesti.'
                : 'Thank you! Your review has been saved successfully.'}
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-xs sm:text-sm">
            {errorMsg}
          </div>
        )}

        {/* Interactive Star Rating Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-brand-blue/80 uppercase tracking-wider">
            {language === 'fi' ? 'Arvosana *' : 'Rating *'}
          </label>
          <div
            role="radiogroup"
            aria-label={language === 'fi' ? 'Arvosana' : 'Rating'}
            className="flex items-center flex-wrap gap-2 py-1"
          >
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const fill = (hoverRating !== null ? hoverRating >= star : rating >= star)
                  ? 'fill-brand-gold text-brand-gold'
                  : 'text-gray-300';
                return (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={rating === star}
                    aria-label={
                      language === 'fi'
                        ? `${star} tähteä viidestä`
                        : `${star} out of 5 stars`
                    }
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-brand-gold/15 transition-transform duration-200 hover:scale-110 focus:outline-hidden cursor-pointer"
                    id={`star-btn-${menuItem.id}-${star}`}
                  >
                    <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${fill} transition-colors duration-150`} />
                  </button>
                );
              })}
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm text-brand-blue ml-2">
              {hoverRating !== null ? hoverRating : rating} / 5
            </span>
          </div>
        </div>

        {/* Author Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-brand-blue/80 uppercase tracking-wider" htmlFor={`author-input-${menuItem.id}`}>
            {language === 'fi' ? 'Nimesi (valinnainen)' : 'Your Name (optional)'}
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-brand-blue/40" />
            <input
              type="text"
              id={`author-input-${menuItem.id}`}
              placeholder={language === 'fi' ? 'Esim. Pekka S.' : 'E.g. Pekka S.'}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-brand-cream/50 rounded-xl border border-brand-gold/25 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-all duration-200 text-brand-blue font-sans placeholder:text-xs sm:placeholder:text-sm"
            />
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-brand-blue/80 uppercase tracking-wider" htmlFor={`comment-input-${menuItem.id}`}>
            {language === 'fi' ? 'Arvostelusi teksti *' : 'Your Review Comment *'}
          </label>
          <textarea
            id={`comment-input-${menuItem.id}`}
            placeholder={
              language === 'fi'
                ? 'Miltä ruoka maistui? Mikä oli hyvää?'
                : 'How was the food? What did you enjoy?'
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-brand-cream/50 rounded-xl border border-brand-gold/25 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-all duration-200 text-brand-blue font-sans placeholder:text-xs sm:placeholder:text-sm"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-serif font-bold text-xs sm:text-sm py-3 px-6 rounded-full tracking-wider uppercase transition-colors duration-300 shadow-sm cursor-pointer"
          id={`submit-review-btn-${menuItem.id}`}
        >
          {language === 'fi' ? 'Tallenna arvio' : 'Save Review'}
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-3.5">
        <h5 className="font-serif font-semibold text-sm text-brand-blue uppercase tracking-wider px-1">
          {language === 'fi' ? 'Arvostelujen historia' : 'Review History'}
        </h5>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-xs text-brand-blue/70 space-x-2 bg-white/40 border border-brand-gold/10 rounded-2xl">
              <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
              <span>{language === 'fi' ? 'Ladataan arvosteluja...' : 'Loading reviews...'}</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-xs italic text-brand-blue/80 bg-white/40 border border-dashed border-brand-gold/25 rounded-2xl">
              {language === 'fi' ? 'Ei vielä tallennettuja arvioita.' : 'No saved reviews yet.'}
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-gold/15 shadow-xs space-y-2 hover:border-brand-gold/30 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-sm text-brand-blue">{rev.author}</span>
                  <span className="flex items-center text-xs text-brand-blue/80">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {formatDate(rev.timestamp)}
                  </span>
                </div>

                {/* Stars Display */}
                <div className="flex space-x-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        rev.rating >= star ? 'fill-brand-gold text-brand-gold' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-[#1e1e1a]/90 leading-relaxed font-sans italic">
                  "{rev.comment}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
