import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem, DishCustomizationSelection, Translation } from '../types';
import { getDishCustomization, calculateCustomizationPrice } from '../data/customizations';
import { X, Check, SlidersHorizontal, AlertCircle, RotateCcw, Plus, Utensils, MessageSquare, Sparkles } from 'lucide-react';
import Modal from './Modal';

interface DishCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: MenuItem | null;
  language: 'fi' | 'en';
  initialSelection?: DishCustomizationSelection;
  initialOptionIndex?: number;
  onSave: (
    dish: MenuItem,
    selection: DishCustomizationSelection,
    selectedOptionIndex?: number
  ) => void;
  isEditingExisting?: boolean;
}

export default function DishCustomizationModal({
  isOpen,
  onClose,
  dish,
  language,
  initialSelection,
  initialOptionIndex = 0,
  onSave,
  isEditingExisting = false,
}: DishCustomizationModalProps) {
  const customization = dish ? getDishCustomization(dish) : undefined;

  // Selected portion size (if priceOptions exist)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(initialOptionIndex);

  // Removals state: array of removed ingredient IDs
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  // Swaps state: Record<groupId, optionId>
  const [selectedSwaps, setSelectedSwaps] = useState<Record<string, string>>({});

  // Optional special instructions for kitchen
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Added feedback state for button
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);

  // Initialize or reset state when modal opens or dish/initialSelection changes
  useEffect(() => {
    if (isOpen && dish) {
      setSelectedOptionIndex(initialOptionIndex);

      if (initialSelection) {
        setRemovedIds(initialSelection.removedIds || []);
        setSelectedSwaps(initialSelection.selectedSwaps || {});
        setSpecialNotes(initialSelection.specialNotes || '');
      } else {
        setRemovedIds([]);
        // Initialize default swaps for all groups
        const defaults: Record<string, string> = {};
        if (customization?.swapGroups) {
          for (const group of customization.swapGroups) {
            if (group.defaultOptionId) {
              defaults[group.id] = group.defaultOptionId;
            } else if (group.options[0]) {
              defaults[group.id] = group.options[0].id;
            }
          }
        }
        setSelectedSwaps(defaults);
        setSpecialNotes('');
      }
      setIsSavedFeedback(false);
    }
  }, [isOpen, dish, initialSelection, initialOptionIndex, customization]);

  if (!isOpen || !dish || !customization) return null;

  // Base price according to selected price option
  const basePrice = dish.priceOptions
    ? dish.priceOptions[selectedOptionIndex]?.value ?? dish.price
    : dish.price;

  const currentSelection: DishCustomizationSelection = {
    removedIds,
    selectedSwaps,
    specialNotes,
  };

  const finalPrice = calculateCustomizationPrice(basePrice, dish, currentSelection);

  // Toggle removal of an ingredient
  const handleToggleRemoval = (removalId: string) => {
    setRemovedIds((prev) =>
      prev.includes(removalId)
        ? prev.filter((id) => id !== removalId)
        : [...prev, removalId]
    );
  };

  // Change swap choice in a group
  const handleSelectSwap = (groupId: string, optionId: string) => {
    setSelectedSwaps((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  // Reset all removals (restore all default ingredients)
  const handleResetRemovals = () => {
    setRemovedIds([]);
  };

  // Reset all swaps back to default choices
  const handleResetSwaps = () => {
    const defaults: Record<string, string> = {};
    if (customization.swapGroups) {
      for (const group of customization.swapGroups) {
        if (group.defaultOptionId) {
          defaults[group.id] = group.defaultOptionId;
        } else if (group.options[0]) {
          defaults[group.id] = group.options[0].id;
        }
      }
    }
    setSelectedSwaps(defaults);
  };

  const hasAnyRemovals = removedIds.length > 0;

  // Count non-default swaps
  const nonDefaultSwapCount = useMemo(() => {
    if (!customization.swapGroups) return 0;
    let count = 0;
    for (const group of customization.swapGroups) {
      const chosen = selectedSwaps[group.id];
      if (chosen && group.defaultOptionId && chosen !== group.defaultOptionId) {
        count++;
      }
    }
    return count;
  }, [customization, selectedSwaps]);

  const hasModifications = hasAnyRemovals || nonDefaultSwapCount > 0 || specialNotes.trim().length > 0;

  const handleSubmit = () => {
    setIsSavedFeedback(true);
    setTimeout(() => {
      onSave(
        dish,
        {
          removedIds,
          selectedSwaps,
          specialNotes: specialNotes.trim() || undefined,
        },
        dish.priceOptions ? selectedOptionIndex : undefined
      );
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="dish-customization-title"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/75 backdrop-blur-xs animate-fade-in"
      className="bg-brand-cream border-2 border-brand-gold/40 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden relative text-[#171b18] animate-zoom-in"
    >
      {/* Header */}
      <div className="bg-brand-blue text-white p-4 sm:p-5 md:p-6 flex items-start justify-between border-b border-brand-gold/40 relative flex-shrink-0">
        <div className="flex items-start space-x-3.5 pr-6">
          <div className="p-2.5 bg-brand-gold/20 text-brand-gold rounded-2xl border border-brand-gold/30 flex-shrink-0 mt-0.5">
            <SlidersHorizontal className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-gold px-2.5 py-0.5 bg-brand-gold/15 rounded-full border border-brand-gold/30">
                {language === 'fi' ? 'Ruuan muokkaus' : 'Customize Dish'}
              </span>
              {hasModifications && (
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  {language === 'fi' ? 'Räätälöity' : 'Customized'}
                </span>
              )}
            </div>
            <h2
              id="dish-customization-title"
              className="font-serif text-lg sm:text-xl md:text-2xl font-black tracking-wide text-white mt-1 uppercase"
            >
              {dish.name[language]}
            </h2>
            <p className="text-xs text-brand-cream/80 font-sans mt-0.5 line-clamp-1 italic">
              {dish.description[language]}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white p-2.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
          aria-label={language === 'fi' ? 'Sulje' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Portion size selection (if dish has size options) */}
      {dish.priceOptions && dish.priceOptions.length > 0 && (
        <div className="bg-white/80 border-b border-brand-gold/25 px-5 py-3 flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
          <span className="text-xs font-serif font-bold uppercase tracking-wider text-brand-blue">
            {language === 'fi' ? 'Valitse annoskoko:' : 'Select portion size:'}
          </span>
          <div className="flex items-center gap-2">
            {dish.priceOptions.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedOptionIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedOptionIndex === idx
                    ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                    : 'bg-white text-brand-blue border-brand-gold/30 hover:bg-brand-gold/10'
                }`}
              >
                {opt.label[language]}: {opt.value.toFixed(2).replace('.', ',')} €
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6 touch-pan-y">
        {/* ================= SECTION 1: REMOVALS (Mitä otetaan pois?) ================= */}
        {customization.removals && customization.removals.length > 0 && (
          <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-brand-gold/30 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-2.5">
              <div>
                <h3 className="font-serif font-extrabold text-sm sm:text-base text-brand-blue uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  <span>{language === 'fi' ? '1. Mitä haluat ottaa pois?' : '1. What would you like to remove?'}</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-[#171b18]/70 font-sans mt-0.5">
                  {language === 'fi'
                    ? 'Klikkaa ainesosia, joita et halua annokseesi (esim. allergiat tai mieltymykset).'
                    : 'Tap ingredients you would like excluded from your dish.'}
                </p>
              </div>

              {hasAnyRemovals && (
                <button
                  type="button"
                  onClick={handleResetRemovals}
                  className="text-[11px] font-sans font-bold text-brand-blue hover:text-brand-gold-text flex items-center space-x-1 px-2.5 py-1 rounded-full hover:bg-brand-gold/10 transition-colors cursor-pointer shrink-0"
                  title={language === 'fi' ? 'Palauta kaikki ainesosat' : 'Keep all ingredients'}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'fi' ? 'Palauta kaikki' : 'Reset'}</span>
                </button>
              )}
            </div>

            {/* Removals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {customization.removals.map((item) => {
                const isRemoved = removedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleRemoval(item.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-200 border cursor-pointer select-none text-left min-h-[44px] ${
                      isRemoved
                        ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-2xs'
                        : 'bg-[#f7f8f9] hover:bg-[#eef2f5] border-gray-200 text-[#171b18]'
                    }`}
                    id={`custom-removal-${dish.id}-${item.id}`}
                  >
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
                          isRemoved
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isRemoved ? '✕' : '✓'}
                      </span>
                      <span className={`truncate ${isRemoved ? 'line-through font-bold text-rose-900' : ''}`}>
                        {item.name[language]}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        isRemoved
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {isRemoved
                        ? language === 'fi' ? 'Jätetään pois' : 'Excluded'
                        : language === 'fi' ? 'Mukana' : 'Included'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SECTION 2: SWAPS (Mitä haluat vaihtaa toiseen?) ================= */}
        {customization.swapGroups && customization.swapGroups.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-extrabold text-sm sm:text-base text-brand-blue uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-brand-blue inline-block" />
                  <span>{language === 'fi' ? '2. Mitä haluat vaihtaa toiseen?' : '2. What would you like to swap or choose?'}</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-[#171b18]/70 font-sans mt-0.5">
                  {language === 'fi'
                    ? 'Valitse haluamasi lisuke, kastike, kypsyysaste tai leipävalinta:'
                    : 'Choose your preferred side dish, sauce, doneness or bread options:'}
                </p>
              </div>

              {nonDefaultSwapCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetSwaps}
                  className="text-[11px] font-sans font-bold text-brand-blue hover:text-brand-gold-text flex items-center space-x-1 px-2.5 py-1 rounded-full hover:bg-brand-gold/10 transition-colors cursor-pointer shrink-0"
                  title={language === 'fi' ? 'Palauta oletusvaihtoehdot' : 'Reset to default choices'}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{language === 'fi' ? 'Palauta oletukset' : 'Reset'}</span>
                </button>
              )}
            </div>

            {/* Swap Groups Loop */}
            {customization.swapGroups.map((group) => {
              const currentChoiceId = selectedSwaps[group.id] || group.defaultOptionId || group.options[0]?.id;

              return (
                <div
                  key={group.id}
                  className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-brand-gold/30 shadow-xs space-y-3"
                  id={`swap-group-${group.id}`}
                >
                  <div className="flex items-center justify-between border-b border-brand-gold/15 pb-2">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-brand-blue uppercase tracking-wider flex items-center space-x-2">
                      <Utensils className="w-3.5 h-3.5 text-brand-gold-text" />
                      <span>{group.title[language]}</span>
                    </h4>
                    {group.defaultOptionId && (
                      <span className="text-[10px] text-[#171b18]/60 font-sans italic">
                        {language === 'fi' ? 'Oletus sisältyy hintaan' : 'Default included'}
                      </span>
                    )}
                  </div>

                  {/* Options List for this Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.options.map((opt) => {
                      const isSelected = currentChoiceId === opt.id;
                      const isDefault = group.defaultOptionId === opt.id;
                      const hasPriceDelta = typeof opt.priceDelta === 'number' && opt.priceDelta !== 0;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectSwap(group.id, opt.id)}
                          className={`p-3 rounded-xl text-xs transition-all duration-200 border flex items-center justify-between cursor-pointer select-none text-left min-h-[44px] ${
                            isSelected
                              ? 'bg-brand-blue text-white border-brand-blue ring-2 ring-brand-gold/40 shadow-xs'
                              : 'bg-[#fafaf9] hover:bg-brand-cream/80 text-[#171b18] border-gray-200'
                          }`}
                          id={`swap-opt-${group.id}-${opt.id}`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'border-brand-gold bg-brand-gold text-brand-blue'
                                  : 'border-gray-400 bg-white'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />}
                            </span>
                            <span className="font-semibold leading-snug">
                              {opt.name[language]}
                            </span>
                          </div>

                          {/* Price delta or Included badge */}
                          <div className="shrink-0 text-right">
                            {hasPriceDelta ? (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isSelected
                                    ? 'bg-brand-gold text-brand-blue'
                                    : opt.priceDelta! > 0
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-emerald-100 text-emerald-900'
                                }`}
                              >
                                {opt.priceDelta! > 0 ? `+${opt.priceDelta!.toFixed(2).replace('.', ',')} €` : `${opt.priceDelta!.toFixed(2).replace('.', ',')} €`}
                              </span>
                            ) : (
                              isDefault && (
                                <span
                                  className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full ${
                                    isSelected
                                      ? 'bg-white/20 text-brand-cream'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {language === 'fi' ? 'Sisältyy' : 'Default'}
                                </span>
                              )
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= SECTION 3: SPECIAL INSTRUCTIONS ================= */}
        <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-brand-gold/30 shadow-xs space-y-2">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-brand-blue" />
            <h4 className="font-serif font-bold text-xs sm:text-sm text-brand-blue uppercase tracking-wider">
              {language === 'fi' ? 'Erityistoiveet keittiölle (valinnainen)' : 'Special requests for kitchen (optional)'}
            </h4>
          </div>
          <p className="text-[11px] text-[#171b18]/70 font-sans">
            {language === 'fi'
              ? 'Esim. allergiat, kastike erikseen kulhoon, erikoistoiveet kypsennyksestä tms.'
              : 'E.g. specific allergies, sauce served on the side, preparation requests.'}
          </p>
          <textarea
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder={language === 'fi' ? 'Kirjoita toiveesi keittiölle...' : 'Write your request for the kitchen...'}
            rows={2}
            maxLength={150}
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-brand-gold/30 bg-white text-[#171b18] focus:outline-none focus:ring-2 focus:ring-brand-blue/30 placeholder:text-gray-400 font-sans resize-none"
          />
        </div>

        {/* ================= LIVE SUMMARY BOX ================= */}
        <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-3.5 sm:p-4 text-xs font-sans space-y-2">
          <div className="flex items-center justify-between border-b border-brand-blue/15 pb-1.5">
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-brand-blue">
              {language === 'fi' ? 'Räätälöinnin yhteenveto' : 'Customization summary'}
            </span>
            <span className="text-[11px] font-bold text-brand-gold-text">
              {hasModifications
                ? language === 'fi' ? 'Muokattu tilaus' : 'Modified order'
                : language === 'fi' ? 'Perinteinen resepti' : 'Standard recipe'}
            </span>
          </div>

          {hasModifications ? (
            <div className="space-y-1.5 pt-0.5">
              {/* Removals list */}
              {hasAnyRemovals && (
                <div className="flex items-start space-x-1.5 text-rose-800">
                  <span className="font-bold shrink-0">{language === 'fi' ? 'Pois:' : 'Removed:'}</span>
                  <span className="font-medium">
                    {removedIds
                      .map((id) => {
                        const rem = customization.removals?.find((r) => r.id === id);
                        return rem ? rem.name[language] : id;
                      })
                      .join(', ')}
                  </span>
                </div>
              )}

              {/* Swaps list */}
              {customization.swapGroups &&
                customization.swapGroups.map((group) => {
                  const chosenId = selectedSwaps[group.id] || group.defaultOptionId;
                  const isNonDefault = group.defaultOptionId ? chosenId !== group.defaultOptionId : true;
                  const chosenOpt = group.options.find((o) => o.id === chosenId);
                  if (!chosenOpt) return null;

                  // Always show doneness or if non-default
                  if (isNonDefault || group.id === 'doneness') {
                    return (
                      <div key={group.id} className="flex items-start space-x-1.5 text-brand-blue">
                        <span className="font-bold shrink-0">{group.title[language]}:</span>
                        <span className="font-semibold text-brand-blue">
                          {chosenOpt.name[language]}
                          {chosenOpt.priceDelta ? ` (+${chosenOpt.priceDelta.toFixed(2).replace('.', ',')} €)` : ''}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}

              {/* Special notes */}
              {specialNotes.trim().length > 0 && (
                <div className="flex items-start space-x-1.5 text-amber-900 font-medium">
                  <span className="font-bold shrink-0">{language === 'fi' ? 'Toive:' : 'Note:'}</span>
                  <span className="italic">"{specialNotes.trim()}"</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[#171b18]/70 italic text-[11px]">
              {language === 'fi'
                ? 'Ei tehtyjä muutoksia. Annos valmistetaan keittiön alkuperäisen reseptin mukaisesti.'
                : 'No modifications made. Prepared according to original chef recipe.'}
            </p>
          )}
        </div>
      </div>

      {/* Footer / Action Bar */}
      <div className="p-4 sm:p-5 bg-white border-t border-brand-gold/30 flex items-center justify-between gap-3 flex-shrink-0 shadow-lg">
        <div>
          <span className="text-[10px] sm:text-xs font-serif uppercase tracking-wider text-brand-blue block font-bold">
            {language === 'fi' ? 'Kokonaishinta:' : 'Total Price:'}
          </span>
          <span className="font-serif font-black text-xl sm:text-2xl text-brand-gold-text leading-tight">
            {finalPrice.toFixed(2).replace('.', ',')} €
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-5 py-3 rounded-full font-serif text-xs font-bold uppercase tracking-wider bg-white border border-brand-blue/30 text-brand-blue hover:bg-black/5 transition-all cursor-pointer min-h-[44px]"
          >
            {language === 'fi' ? 'Peruuta' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSavedFeedback}
            className={`px-5 sm:px-7 py-3 rounded-full font-serif text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 shadow-md cursor-pointer min-h-[44px] ${
              isSavedFeedback
                ? 'bg-emerald-600 text-white scale-[0.98]'
                : 'bg-brand-blue hover:bg-brand-blue/90 text-white active:scale-95'
            }`}
            id={`confirm-customization-btn-${dish.id}`}
          >
            {isSavedFeedback ? (
              <>
                <Check className="w-4 h-4 text-white animate-bounce" />
                <span>{language === 'fi' ? 'Lisätty tilaukseen!' : 'Added to order!'}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-brand-gold" />
                <span>
                  {isEditingExisting
                    ? language === 'fi' ? 'Päivitä valinnat' : 'Update choices'
                    : language === 'fi' ? 'Lisää tilaukseen' : 'Add to order'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
