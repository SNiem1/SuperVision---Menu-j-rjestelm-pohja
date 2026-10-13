import React, { useState } from 'react';
import { OrderItem } from '../types';
import { useReviews } from '../context/ReviewsContext';
import { Utensils, Star, X, Check, Sparkles, Send, Clock, ExternalLink, Trash2 } from 'lucide-react';
import Modal from './Modal';

interface YourFoodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eatenItems: (OrderItem & { orderedAt: string })[];
  language: 'fi' | 'en';
  onNavigateToMenuItem?: (menuItemId: string) => void;
  onRemoveEatenItem?: (index: number) => void;
  onClearEatenItems?: () => void;
}

export default function YourFoodsModal({
  isOpen,
  onClose,
  eatenItems,
  language,
  onNavigateToMenuItem,
  onRemoveEatenItem,
  onClearEatenItems,
}: YourFoodsModalProps) {
  const { addReview } = useReviews();

  // Store user-submitted ratings and comments per item in local component state
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [userComments, setUserComments] = useState<Record<string, string>>({});
  const [userAuthors, setUserAuthors] = useState<Record<string, string>>({});
  const [submittedItemIds, setSubmittedItemIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleRatingChange = (itemId: string, rating: number) => {
    setUserRatings((prev) => ({ ...prev, [itemId]: rating }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    setUserComments((prev) => ({ ...prev, [itemId]: comment }));
  };

  const handleAuthorChange = (itemId: string, author: string) => {
    setUserAuthors((prev) => ({ ...prev, [itemId]: author }));
  };

  const handleSubmitReview = async (item: OrderItem & { orderedAt: string }) => {
    const rating = userRatings[item.id] || 5;
    const comment = userComments[item.id] || '';
    const author = userAuthors[item.id] || '';

    await addReview(item.menuItemId, rating, author, comment, language);

    setSubmittedItemIds((prev) => ({ ...prev, [item.id]: true }));
  };

  // Group or reverse eaten items so newest appear first
  const reversedEatenItems = [...eatenItems].reverse();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="your-foods-modal-title"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md transition-opacity duration-300"
      className="bg-brand-cream border border-brand-gold/40 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden relative text-[#171b18] animate-slide-in-from-bottom duration-300 my-0 sm:my-auto"
    >
      {/* Mobile drag handle indicator */}
      <div className="bg-brand-blue sm:hidden pt-2 pb-0 flex justify-center">
        <div className="w-12 h-1 bg-white/30 rounded-full" />
      </div>

      {/* Modal Header */}
      <div className="bg-brand-blue text-white px-5 py-4 sm:px-7 sm:py-5 flex justify-between items-center border-b border-brand-gold/30">
        <div className="flex items-center space-x-3 sm:space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 flex items-center justify-center shadow-inner flex-shrink-0">
            <Utensils className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <h2 id="your-foods-modal-title" className="font-serif font-black text-base sm:text-xl uppercase tracking-wider text-brand-gold leading-tight">
              {language === 'fi' ? 'Sinun ruokasi' : 'Your Foods'}
            </h2>
            <p className="text-[11px] sm:text-xs text-white/75 font-sans mt-0.5 leading-snug">
              {language === 'fi'
                ? 'Kaikki maistamasi ja tilaamasi annokset'
                : 'All dishes you have ordered and enjoyed'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all duration-150 flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          id="close-your-foods-btn"
          aria-label={language === 'fi' ? 'Sulje' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 space-y-5 sm:space-y-6 touch-pan-y">
        {/* Elegant Banner Emphasizing Reviews */}
        <div className="bg-white/90 border border-brand-gold/30 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-brand-gold/15 text-brand-blue flex items-center justify-center flex-shrink-0 border border-brand-gold/30">
            <Sparkles className="w-5 h-5 text-brand-gold" />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-serif font-bold text-xs sm:text-base text-brand-blue tracking-wide">
              {language === 'fi' ? 'Anna arvostelu syömistäsi annoksista' : 'Rate the dishes you enjoyed'}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#171b18]/75 mt-0.5 leading-relaxed">
              {language === 'fi'
                ? 'Jätä arvosana ja lyhyt kommentti jokaisesta maistamastasi ruoasta!'
                : 'Rate and leave a review for each dish you tasted!'}
            </p>
          </div>
        </div>

        {/* List of Eaten Items */}
        {eatenItems.length === 0 ? (
          <div className="text-center py-12 px-6 space-y-3 bg-white/60 rounded-3xl border border-dashed border-brand-gold/30">
            <div className="w-14 h-14 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto border border-brand-gold/20">
              <Utensils className="w-7 h-7 text-brand-gold" />
            </div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-brand-blue">
              {language === 'fi' ? 'Ei vielä tallennettuja ruokia' : 'No saved dishes yet'}
            </h4>
            <p className="text-xs sm:text-sm text-[#171b18]/70 max-w-sm mx-auto leading-relaxed">
              {language === 'fi'
                ? 'Kun tilaat annoksia, ne siirtyvät tänne automaattisesti arvosteltavaksi!'
                : 'When you place an order, your dishes move here automatically for reviewing!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {reversedEatenItems.map((item, index) => {
              const currentRating = userRatings[item.id] || 5;
              const currentComment = userComments[item.id] || '';
              const currentAuthor = userAuthors[item.id] || '';
              const isSubmitted = submittedItemIds[item.id];

              const formattedDate = new Date(item.orderedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              const originalIndex = eatenItems.length - 1 - index;

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-white rounded-2xl border border-brand-gold/30 p-4 sm:p-5 shadow-xs space-y-3.5 hover:border-brand-gold/60 transition-all duration-200"
                >
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-black/5 pb-3.5">
                    <div className="flex items-center space-x-3.5">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name[language]}
                          width={56}
                          height={56}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                            const fallback = (e.target as HTMLElement).nextElementSibling;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border border-brand-gold/20 shadow-2xs flex-shrink-0"
                        />
                      ) : null}
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-brand-blue border border-brand-gold/30 flex items-center justify-center flex-shrink-0 ${item.imageUrl ? 'hidden' : ''}`}>
                        <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#171b18] leading-tight truncate">
                          {item.quantity}x {item.name[language]}
                        </h4>
                        {item.selectedOptionLabel && (
                          <span className="inline-block mt-0.5 text-[10px] sm:text-[11px] font-semibold text-brand-blue bg-brand-gold/15 px-2.5 py-0.5 rounded-full border border-brand-gold/20">
                            {item.selectedOptionLabel[language]}
                          </span>
                        )}
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-[#171b18]/80 mt-1">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-brand-gold/80" />
                            <span>{formattedDate}</span>
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-brand-blue">
                            {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
                      {onNavigateToMenuItem && (
                        <button
                          onClick={() => {
                            onClose();
                            onNavigateToMenuItem(item.menuItemId);
                          }}
                          className="text-[11px] sm:text-xs font-semibold text-brand-blue hover:text-brand-blue hover:underline flex items-center space-x-1 transition-colors py-2 px-3 min-w-[44px] min-h-[44px] justify-center cursor-pointer"
                          title={language === 'fi' ? 'Katso ruokalistalla' : 'View in menu'}
                        >
                          <span>{language === 'fi' ? 'Ruokalistalla' : 'In menu'}</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </button>
                      )}

                      {onRemoveEatenItem && (
                        <button
                          onClick={() => onRemoveEatenItem(originalIndex)}
                          className="text-[11px] sm:text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50/80 hover:bg-rose-100 px-3.5 py-2 min-w-[44px] min-h-[44px] rounded-full border border-rose-200/80 transition-all flex items-center justify-center space-x-1 active:scale-95 cursor-pointer"
                          title={language === 'fi' ? 'Poista tämä annos' : 'Delete this item'}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>{language === 'fi' ? 'Poista' : 'Delete'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ELEGANT REVIEW INPUT FORM */}
                  <div className="bg-brand-cream/60 border border-brand-gold/25 rounded-2xl p-3.5 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] sm:text-xs font-serif font-bold uppercase tracking-wider text-brand-blue flex items-center space-x-1.5">
                        <Star className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                        <span>
                          {language === 'fi' ? 'Arvosana & kokemus:' : 'Rating & Feedback:'}
                        </span>
                      </span>

                      {isSubmitted && (
                        <span className="inline-flex items-center space-x-1 text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{language === 'fi' ? 'Tallennettu!' : 'Saved!'}</span>
                        </span>
                      )}
                    </div>

                    {/* Interactive 5-Star Selector */}
                    <div
                      role="radiogroup"
                      aria-label={language === 'fi' ? 'Valitse arvosana' : 'Select rating'}
                      className="flex items-center flex-wrap gap-1.5 py-0.5"
                    >
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            role="radio"
                            aria-checked={currentRating === starVal}
                            aria-label={language === 'fi' ? `Anna ${starVal} tähteä` : `Rate ${starVal} stars`}
                            onClick={() => handleRatingChange(item.id, starVal)}
                            className="p-1.5 rounded-full hover:bg-brand-gold/15 active:scale-110 transition-transform duration-150 focus:outline-hidden cursor-pointer"
                            title={`${starVal} / 5`}
                          >
                            <Star
                              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                                starVal <= currentRating
                                  ? 'text-brand-gold fill-brand-gold'
                                  : 'text-gray-300 fill-gray-100'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="font-serif font-bold text-xs sm:text-sm text-brand-blue ml-2">
                        {currentRating} / 5
                      </span>
                    </div>

                    {/* Comment & Author Inputs */}
                    <div className="space-y-2.5 pt-0.5">
                      <textarea
                        value={currentComment}
                        onChange={(e) => handleCommentChange(item.id, e.target.value)}
                        placeholder={
                          language === 'fi'
                            ? 'Kirjoita arvostelu...'
                            : 'Write your review...'
                        }
                        className="w-full p-3 text-xs sm:text-sm bg-white border border-brand-gold/30 rounded-xl focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 text-[#171b18] resize-none transition-all placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm"
                        rows={2}
                      />

                      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between pt-0.5">
                        <input
                          type="text"
                          value={currentAuthor}
                          onChange={(e) => handleAuthorChange(item.id, e.target.value)}
                          placeholder={
                            language === 'fi'
                              ? 'Nimesi tai nimimerkki (valinnainen)'
                              : 'Your name or nickname (optional)'
                          }
                          className="w-full sm:w-1/2 p-3 text-xs sm:text-sm bg-white border border-brand-gold/30 rounded-xl focus:outline-hidden focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/40 text-[#171b18] transition-all placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm"
                        />

                        <button
                          type="button"
                          onClick={() => handleSubmitReview(item)}
                          className="w-full sm:w-auto px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-brand-gold font-serif font-bold text-xs uppercase tracking-wider rounded-full border border-brand-gold/40 transition-all active:scale-98 flex items-center justify-center space-x-1.5 shadow-2xs min-h-[44px] cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>
                            {isSubmitted
                              ? language === 'fi'
                                ? 'Päivitä arvostelu'
                                : 'Update Review'
                              : language === 'fi'
                              ? 'Lähetä arvostelu'
                              : 'Submit Review'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="p-4 sm:p-5 bg-brand-cream border-t border-brand-gold/25 flex flex-wrap items-center justify-between gap-3 pb-[env(safe-area-inset-bottom)]">
        {onClearEatenItems && eatenItems.length > 0 ? (
          <button
            onClick={() => {
              if (
                window.confirm(
                  language === 'fi'
                    ? 'Haluatko varmasti poistaa kaikki annokset listalta?'
                    : 'Are you sure you want to remove all items from your list?'
                )
              ) {
                onClearEatenItems();
              }
            }}
            className="px-4 py-2.5 min-h-[44px] text-rose-700 hover:text-rose-900 bg-rose-50/90 hover:bg-rose-100 border border-rose-200/80 rounded-full text-xs font-serif font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>{language === 'fi' ? 'Tyhjennä lista' : 'Clear all'}</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onClose}
          className="w-full sm:w-auto px-8 py-3 min-h-[44px] bg-brand-blue text-white font-serif font-bold text-xs uppercase tracking-wider rounded-full hover:bg-brand-blue/90 active:scale-98 transition-all shadow-xs border border-brand-gold/30 cursor-pointer"
        >
          {language === 'fi' ? 'Sulje' : 'Close'}
        </button>
      </div>
    </Modal>
  );
}

