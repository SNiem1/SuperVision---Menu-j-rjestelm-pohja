import React, { useState } from 'react';
import { MenuItem, Allergen } from '../types';
import { useReviews } from '../context/ReviewsContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ALLERGENS, MENU_ITEMS } from '../data/menuData';
import { restaurantConfig } from '../config/restaurant';
import { isDishCustomizable } from '../data/customizations';
import { Star, MessageSquare, ChevronDown, ChevronUp, Sparkles, Plus, Check, AlertTriangle, Info, X, Utensils, Edit2, AlertCircle, ChefHat } from 'lucide-react';
import ReviewSection from './ReviewSection';

interface MenuItemCardProps {
  key?: string | number;
  menuItem: MenuItem;
  language: 'fi' | 'en';
  onAddToOrder: (menuItem: MenuItem, selectedOptionIndex?: number) => void;
  onOpenAR?: (menuItem: MenuItem) => void;
  onOpenAdminEdit?: (menuItem: MenuItem) => void;
  onOpenCustomizer?: (menuItem: MenuItem, selectedOptionIndex?: number) => void;
  itemNumber?: number;
}

export default function MenuItemCard({ menuItem, language, onAddToOrder, onOpenAR, onOpenAdminEdit, onOpenCustomizer, itemNumber }: MenuItemCardProps) {
  const { getStats } = useReviews();
  const { isAuthenticated, openAdmin } = useAdminAuth();
  const ratingStats = getStats(menuItem.id);

  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const [isAllergenPopoverOpen, setIsAllergenPopoverOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const itemIndex = MENU_ITEMS.findIndex((m) => m.id === menuItem.id);
  const displayIndex = itemNumber ?? (itemIndex >= 0 ? itemIndex + 1 : undefined);

  const isEagerImage = displayIndex !== undefined && displayIndex <= 2;
  const canBeCustomized = isDishCustomizable(menuItem);

  const freeFromList = menuItem.allergens
    .map((k) => ALLERGENS[k])
    .filter((a): a is Allergen => a?.kind === 'free-from');

  const containsList = menuItem.allergens
    .map((k) => ALLERGENS[k])
    .filter((a): a is Allergen => a?.kind === 'contains');

  const originList = menuItem.allergens
    .map((k) => ALLERGENS[k])
    .filter((a): a is Allergen => a?.kind === 'origin');

  const handleAddToCart = () => {
    onAddToOrder(menuItem, menuItem.priceOptions ? selectedOptionIndex : undefined);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 1200);
  };

  // Determine current display price
  const currentPrice = menuItem.priceOptions 
    ? menuItem.priceOptions[selectedOptionIndex].value 
    : menuItem.price;

  return (
    <div
      className="bg-white/90 backdrop-blur-xs rounded-3xl border border-brand-gold/25 p-5 sm:p-6 md:p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col space-y-4 group"
      id={`menu-card-${menuItem.id}`}
    >
      {/* Visual Image Layer with Offset Drop Shadow Layout */}
      <div className="relative pt-1 pr-2 pb-1">
        {/* Subtle background offset layer for double card shadow effect */}
        <div className="absolute top-1 left-0 right-2 bottom-1 bg-brand-gold/15 rounded-2xl border border-brand-gold/15 transform translate-y-1.5 translate-x-1.5 pointer-events-none" />
        
        <div className="relative rounded-2xl overflow-hidden border border-brand-gold/20 aspect-[4/3] bg-black/5 w-full">
          {!imgError && menuItem.imageUrl ? (
            <img
              src={menuItem.imageUrl}
              alt={menuItem.name[language]}
              width={400}
              height={300}
              loading={isEagerImage ? 'eager' : 'lazy'}
              decoding="async"
              {...(isEagerImage ? { fetchPriority: 'high' } : {})}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-blue/95 via-brand-blue to-[#132c38] flex flex-col items-center justify-center p-6 text-center text-brand-cream border border-brand-gold/30">
              <Utensils className="w-9 h-9 text-brand-gold mb-2 opacity-90" />
              <span className="font-serif font-extrabold text-sm tracking-widest text-brand-gold uppercase">{restaurantConfig.name}</span>
              <span className="text-[11px] text-white/75 italic mt-1 line-clamp-1">{menuItem.name[language]}</span>
            </div>
          )}

          {/* Sold Out / Unavailable Image Overlay */}
          {menuItem.isAvailable === false && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-15 animate-fade-in">
              <div className="bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xl flex items-center space-x-1.5 border border-amber-300 ring-2 ring-black/30">
                <AlertCircle className="w-4 h-4 text-white animate-pulse" />
                <span>{language === 'fi' ? 'Tilapäisesti loppu' : 'Currently Sold Out'}</span>
              </div>
              {menuItem.unavailableReason && (
                <p className="text-amber-100 text-xs font-sans mt-2 max-w-[220px] font-medium leading-snug drop-shadow-sm">
                  {menuItem.unavailableReason[language]}
                </p>
              )}
            </div>
          )}

          {/* Image container without overlay buttons */}
        </div>
      </div>

      {/* Details Container */}
      <div className="flex flex-col flex-grow space-y-2.5 pt-1">
        {/* Name and Price Row */}
        <div className="relative pr-24 min-h-[2.25rem] md:min-h-[2.75rem] flex items-center">
          <h3 className={`font-sans font-extrabold text-[#171b18] tracking-wide uppercase leading-snug ${
            menuItem.name[language].length > 25 ? 'text-base md:text-lg' : 'text-lg md:text-xl'
          }`}>
            {displayIndex !== undefined && (
              <span className="font-serif font-extrabold text-brand-blue mr-2 text-lg md:text-xl inline-block">
                {displayIndex}.
              </span>
            )}
            {menuItem.name[language]}
          </h3>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 font-serif font-extrabold text-xl md:text-2xl text-brand-gold-text whitespace-nowrap">
            {currentPrice.toFixed(2).replace('.', ',')} €
          </span>
        </div>

        {/* Portion/Size Toggles if available */}
        {menuItem.priceOptions && (
          <div className="flex flex-wrap gap-2 py-1">
            {menuItem.priceOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOptionIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 border ${
                  selectedOptionIndex === idx
                    ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                    : 'bg-brand-cream/80 text-brand-blue border-brand-gold/25 hover:bg-black/5'
                }`}
                id={`price-opt-${menuItem.id}-${idx}`}
              >
                {opt.label[language]}: {opt.value.toFixed(2).replace('.', ',')} €
              </button>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-xs md:text-sm text-[#171b18]/80 font-sans leading-relaxed italic py-0.5">
          {menuItem.description[language]}
        </p>

        {/* Allergens Row */}
        {menuItem.allergens.length > 0 && (
          <div className="flex flex-col gap-2 pt-1">
            {freeFromList.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAllergenPopoverOpen(true)}
                className="self-start text-left flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#f1f5f2] hover:bg-[#e6efe9] text-[#1b4332] border border-[#2d6a4f]/25 transition-colors shadow-2xs cursor-pointer group"
                id={`allergen-freefrom-btn-${menuItem.id}`}
              >
                <Check className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0 stroke-[2.5]" />
                <span>{freeFromList.map((a) => a.name[language]).join(', ')}</span>
                <Info className="w-3 h-3 text-[#2d6a4f]/60 group-hover:text-[#1b4332] shrink-0 ml-0.5" />
              </button>
            )}

            {containsList.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAllergenPopoverOpen(true)}
                className="self-start text-left flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#faf4ed] hover:bg-[#f5e9dc] text-[#78350f] border border-[#b45309]/25 transition-colors shadow-2xs cursor-pointer group"
                id={`allergen-contains-btn-${menuItem.id}`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#b45309] shrink-0" />
                <span>
                  {language === 'fi' ? 'Sisältää: ' : 'Contains: '}
                  {containsList.map((a) => a.partitiveName?.[language] || a.name[language]).join(', ')}
                </span>
                <Info className="w-3 h-3 text-[#b45309]/60 group-hover:text-[#78350f] shrink-0 ml-0.5" />
              </button>
            )}

            {originList.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAllergenPopoverOpen(true)}
                className="self-start text-left flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#f2f4f8] hover:bg-[#e7ecf4] text-brand-blue border border-brand-gold/35 transition-colors shadow-2xs cursor-pointer group"
                id={`allergen-origin-btn-${menuItem.id}`}
              >
                <span>
                  {originList
                    .map((a) => (a.iconSymbol ? `${a.iconSymbol} ${a.name[language]}` : a.name[language]))
                    .join(', ')}
                </span>
                <Info className="w-3 h-3 text-brand-blue/60 group-hover:text-brand-blue shrink-0 ml-0.5" />
              </button>
            )}
          </div>
        )}

        {/* Add to Order Button / Out of Stock Banner / Customize Button */}
        <div className="pt-3">
          {menuItem.isAvailable === false ? (
            <div className="space-y-2">
              <div
                className="w-full py-3 px-4 rounded-full font-serif text-xs md:text-sm font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 flex items-center justify-center space-x-2 select-none shadow-2xs"
                id={`sold-out-badge-${menuItem.id}`}
              >
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{language === 'fi' ? 'Tilapäisesti loppu' : 'Currently sold out'}</span>
              </div>
              {menuItem.unavailableReason && (
                <p className="text-[11px] text-amber-900/90 text-center font-sans font-medium px-2 leading-tight">
                  {menuItem.unavailableReason[language]}
                </p>
              )}
            </div>
          ) : canBeCustomized ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenCustomizer?.(menuItem, menuItem.priceOptions ? selectedOptionIndex : undefined)}
                className="w-full py-2.5 px-3 rounded-full font-serif text-xs md:text-sm font-bold uppercase tracking-wider bg-white hover:bg-brand-cream/80 text-brand-blue border-2 border-brand-gold/60 hover:border-brand-gold transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-2xs active:scale-95 cursor-pointer min-h-[44px]"
                id={`customize-btn-${menuItem.id}`}
                title={language === 'fi' ? 'Muokkaa annosta (jätä pois tai vaihda ainesosia)' : 'Customize dish (remove or swap ingredients)'}
              >
                <ChefHat className="w-4 h-4 text-brand-gold-text shrink-0" />
                <span className="truncate">{language === 'fi' ? 'Muokkaa' : 'Customize'}</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-2.5 px-3 rounded-full font-serif text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-1.5 border shadow-xs cursor-pointer min-h-[44px] ${
                  isAddedFeedback
                    ? 'bg-emerald-600 text-white border-emerald-600 scale-[0.98]'
                    : 'bg-brand-blue hover:bg-brand-blue/90 text-white border-brand-blue/80 active:scale-95'
                }`}
                id={`add-to-order-btn-${menuItem.id}`}
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4 text-white animate-bounce" />
                    <span className="truncate">{language === 'fi' ? 'Lisätty!' : 'Added!'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-brand-gold" />
                    <span className="truncate">{language === 'fi' ? 'Lisää' : 'Add'}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-3 px-6 rounded-full font-serif text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 border shadow-xs cursor-pointer min-h-[44px] ${
                isAddedFeedback
                  ? 'bg-emerald-600 text-white border-emerald-600 scale-[0.98]'
                  : 'bg-brand-blue hover:bg-brand-blue/90 text-white border-brand-blue/80 active:scale-95'
              }`}
              id={`add-to-order-btn-${menuItem.id}`}
            >
              {isAddedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-white animate-bounce" />
                  <span>{language === 'fi' ? 'Lisätty tilaukseen!' : 'Added to order!'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-brand-gold" />
                  <span>{language === 'fi' ? 'Lisää tilaukseen' : 'Add to order'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Decorative Dashed Divider */}
      <div className="border-t border-dashed border-[#171b18]/15 pt-1" />

      {/* Bottom Row - Stars and Reviews Toggle */}
      <div className="flex justify-between items-center py-1">
        {/* Rating Stars */}
        <button
          onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
          className="flex items-center space-x-1.5 group focus:outline-none cursor-pointer py-1"
          title={language === 'fi' ? 'Näytä arvostelut' : 'Show reviews'}
          id={`stars-toggle-${menuItem.id}`}
        >
          <div className="flex space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const fillClass =
                ratingStats.count > 0 && Math.round(ratingStats.average) >= star
                  ? 'fill-brand-gold text-brand-gold'
                  : 'text-gray-300';
              return (
                <Star
                  key={star}
                  className={`w-4 h-4 ${fillClass} transition-transform duration-200 group-hover:scale-110`}
                />
              );
            })}
          </div>
          <span className="text-xs font-sans text-brand-blue group-hover:text-brand-gold-text transition-colors font-semibold ml-1">
            ({ratingStats.count})
          </span>
        </button>

        {/* Review Trigger Button */}
        <button
          onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-[11px] font-serif font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
            isReviewsExpanded
              ? 'bg-brand-blue text-white border-brand-blue'
              : 'bg-white text-brand-blue border-brand-gold/30 hover:bg-brand-gold/10'
          }`}
          id={`reviews-btn-${menuItem.id}`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{language === 'fi' ? 'Arvostelut' : 'Reviews'}</span>
          {isReviewsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Review Section */}
      {isReviewsExpanded && (
        <div className="pt-3 animate-fade-in">
          <ReviewSection
            menuItem={menuItem}
            language={language}
          />
        </div>
      )}

      {/* Allergen Details Popover Modal */}
      {isAllergenPopoverOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsAllergenPopoverOpen(false)}
          id={`allergen-popover-overlay-${menuItem.id}`}
        >
          <div
            className="bg-brand-cream border-2 border-brand-gold rounded-3xl shadow-2xl p-5 sm:p-6 max-w-sm w-full relative text-[#171b18] animate-zoom-in space-y-4"
            onClick={(e) => e.stopPropagation()}
            id={`allergen-popover-card-${menuItem.id}`}
          >
            <div className="flex items-center justify-between border-b border-brand-gold/30 pb-3">
              <div className="flex items-center space-x-2.5">
                <Info className="w-4 h-4 text-brand-blue" />
                <h4 className="font-serif font-bold text-sm text-brand-blue uppercase tracking-wider">
                  {language === 'fi' ? 'Ruoka-aineet & Merkinnät' : 'Dietary & Allergen Info'}
                </h4>
              </div>
              <button
                onClick={() => setIsAllergenPopoverOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/10 text-brand-blue transition-colors cursor-pointer"
                id={`close-allergen-popover-${menuItem.id}`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-serif font-bold text-xs text-brand-blue uppercase tracking-wide">
              {menuItem.name[language]}
            </p>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {menuItem.allergens.map((key) => {
                const info = ALLERGENS[key];
                if (!info) return null;
                return (
                  <div
                    key={key}
                    className={`p-3 rounded-2xl border flex items-start space-x-2.5 ${
                      info.kind === 'free-from'
                        ? 'bg-[#f1f5f2] border-[#2d6a4f]/25 text-[#1b4332]'
                        : info.kind === 'contains'
                        ? 'bg-[#faf4ed] border-[#b45309]/25 text-[#78350f]'
                        : 'bg-[#f2f4f8] border-brand-gold/35 text-brand-blue'
                    }`}
                  >
                    <span
                      className={`font-extrabold text-[10px] px-2 py-0.5 rounded-full text-white shrink-0 mt-0.5 ${
                        info.kind === 'free-from'
                          ? 'bg-[#2d6a4f]'
                          : info.kind === 'contains'
                          ? 'bg-[#b45309]'
                          : 'bg-brand-blue text-brand-gold'
                      }`}
                    >
                      {info.iconSymbol || key}
                    </span>
                    <div className="min-w-0">
                      <span className="font-bold text-xs block">
                        {info.name[language]}
                      </span>
                      {info.description && (
                        <p className="text-[11px] opacity-90 leading-tight mt-0.5">
                          {info.description[language]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-brand-gold/20 flex justify-end">
              <button
                onClick={() => setIsAllergenPopoverOpen(false)}
                className="px-6 py-2 bg-brand-blue text-white rounded-full text-xs font-serif font-bold uppercase tracking-wider cursor-pointer hover:bg-brand-blue/90 transition-colors"
              >
                {language === 'fi' ? 'Sulje' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
