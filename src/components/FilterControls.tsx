import React, { useState } from 'react';
import { AllergenKey } from '../types';
import { ALLERGENS } from '../data/menuData';
import { SlidersHorizontal, Search, X, ChevronDown, ChevronUp, Check, Sparkles, ArrowDown } from 'lucide-react';

interface FilterControlsProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedAllergens: AllergenKey[];
  toggleAllergen: (key: AllergenKey) => void;
  clearFilters: () => void;
  language: 'fi' | 'en';
  matchingCount?: number;
}

export default function FilterControls({
  searchQuery,
  setSearchQuery,
  selectedAllergens,
  toggleAllergen,
  clearFilters,
  language,
  matchingCount,
}: FilterControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Core popular special diets
  const primaryDiets: AllergenKey[] = ['G', 'L', 'M', 'Vegan', 'KASV', 'P', 'KAN'];
  
  // All other extended special diets & preferences
  const extendedDiets: AllergenKey[] = [
    'VL',
    'SOY_FREE',
    'KAL_FREE',
    'AYR_FREE',
    'VALK_FREE',
    'SIK_FREE',
    'KETO',
    'FODMAP',
    'SOKERITON',
    'FI',
    'Organic',
  ];

  const activeCount = (searchQuery.trim() !== '' ? 1 : 0) + selectedAllergens.length;

  const handleCloseAndScrollToMenu = () => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      const listElement = document.getElementById('menu-items-section');
      if (listElement) {
        const stickyHeader = document.getElementById('sticky-nav-header');
        const headerOffset = stickyHeader ? stickyHeader.getBoundingClientRect().height + 20 : 80;
        const elementPosition = listElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, elementPosition - headerOffset),
          behavior: 'smooth',
        });
      }
    });
  };

  return (
    <div className="w-full bg-brand-cream/80 border-b border-brand-gold/20 py-3.5 px-4 sm:px-8 transition-all duration-300">
      {/* Mini Toggle Bar */}
      <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
        <div className="flex items-center justify-between sm:justify-center relative min-h-[38px]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 text-brand-blue hover:text-brand-gold-text transition-colors duration-200 focus:outline-none group cursor-pointer"
            id="toggle-filters-btn"
            aria-expanded={isOpen}
          >
            <div className="p-1.5 rounded-full bg-brand-gold/15 text-brand-blue group-hover:bg-brand-gold/25 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-left text-brand-blue">
              {language === 'fi' ? 'Haku & Erikoisruokavaliot' : 'Search & Dietary Filters'}
            </span>
            
            {activeCount > 0 && (
              <span className="bg-brand-blue text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full min-w-[20px] h-[20px] flex items-center justify-center shadow-xs">
                {activeCount}
              </span>
            )}

            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-brand-blue/60 group-hover:text-brand-blue transition-colors ml-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 text-brand-blue/60 group-hover:text-brand-blue transition-colors ml-0.5" />
            )}
          </button>

          {activeCount > 0 && (
            <button
              onClick={clearFilters}
              className="sm:absolute sm:right-0 text-xs uppercase tracking-wider font-extrabold text-brand-blue hover:text-red-700 underline decoration-brand-gold/50 decoration-2 underline-offset-4 transition-all cursor-pointer"
              id="quick-clear-filters-btn"
            >
              {language === 'fi' ? 'Tyhjennä' : 'Clear'}
            </button>
          )}
        </div>

        {/* Active Filters Chips Bar (When Collapsed) */}
        {!isOpen && activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-brand-blue/60 mr-1 uppercase tracking-wider">
              {language === 'fi' ? 'Aktiiviset:' : 'Active:'}
            </span>
            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center space-x-1 bg-white text-brand-blue border border-brand-gold/40 text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-2xs">
                <Search className="w-3 h-3 text-brand-gold" />
                <span>"{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-red-600 ml-1 p-0.5"
                  title={language === 'fi' ? 'Poista haku' : 'Remove search'}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedAllergens.map((key) => {
              const allergen = ALLERGENS[key];
              if (!allergen) return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center space-x-1 bg-brand-blue text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs"
                >
                  <span>{key}</span>
                  <span className="text-[10px] opacity-80 font-normal lowercase hidden sm:inline">
                    ({allergen.name[language]})
                  </span>
                  <button
                    onClick={() => toggleAllergen(key)}
                    className="hover:text-brand-gold ml-1 p-0.5"
                    title={language === 'fi' ? 'Poista suodatin' : 'Remove filter'}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Collapsible Content with Mobile-safe Max Height */}
      {isOpen && (
        <div className="max-w-4xl mx-auto mt-4 pt-4 border-t border-brand-gold/20 space-y-4 max-h-[68vh] overflow-y-auto pr-1 animate-slide-in-from-top duration-200">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search input */}
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-brand-blue/50" />
              <input
                type="text"
                placeholder={
                  language === 'fi'
                    ? 'Hae nimellä tai raaka-aineella (esim. letut, lohi)...'
                    : 'Search by dish name or ingredient...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white rounded-full border border-brand-gold/30 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-all duration-200 text-[#1e1e1a] font-sans shadow-2xs"
                id="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-brand-blue/50 hover:text-brand-blue"
                  id="clear-search-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Clear button inside */}
            {activeCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-blue rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center space-x-1 border border-brand-gold/30 cursor-pointer"
                id="clear-all-filters-btn"
              >
                <span>{language === 'fi' ? 'Tyhjennä kaikki' : 'Clear all'}</span>
              </button>
            )}
          </div>

          {/* Quick Dietary Preferences */}
          <div className="space-y-3 bg-white/90 p-3.5 sm:p-5 rounded-2xl border border-brand-gold/25 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-brand-blue">
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold" />
                <span className="text-xs uppercase tracking-wider font-extrabold font-sans">
                  {language === 'fi' ? 'Suositut erikoisruokavaliot' : 'Popular Dietary Preferences'}
                </span>
              </div>
              <span className="text-[11px] text-brand-blue/70">
                {language === 'fi' ? 'Valitse sopivat' : 'Select'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {primaryDiets.map((allKey) => {
                const allergen = ALLERGENS[allKey];
                if (!allergen) return null;
                const isSelected = selectedAllergens.includes(allKey);

                return (
                  <button
                    key={allKey}
                    onClick={() => toggleAllergen(allKey)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border flex items-center space-x-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-blue text-white border-brand-blue shadow-xs font-bold scale-[1.02]'
                        : 'bg-white text-brand-blue border-brand-gold/30 hover:border-brand-gold hover:bg-brand-cream/60'
                    }`}
                    id={`filter-pill-${allKey}`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-gold" />}
                    <span className="font-extrabold">{allKey}</span>
                    <span className="text-[11px] opacity-80 font-normal lowercase">
                      ({allergen.name[language]})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Extended Special Diets Toggle & Pills */}
            <div className="pt-2.5 border-t border-brand-gold/15">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowAllFilters(!showAllFilters)}
                  className="text-xs font-bold uppercase tracking-wider text-brand-blue hover:text-brand-gold-text flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  <span>
                    {showAllFilters
                      ? (language === 'fi' ? 'Piilota lisäsuodattimet' : 'Hide extra filters')
                      : (language === 'fi' ? `Näytä kaikki muut erikoisruokavaliot (${extendedDiets.length} kpl)` : `Show all other dietary filters (${extendedDiets.length})`)}
                  </span>
                  {showAllFilters ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              </div>

              {showAllFilters && (
                <div className="flex flex-wrap gap-2 pt-1 animate-fade-in">
                  {extendedDiets.map((allKey) => {
                    const allergen = ALLERGENS[allKey];
                    if (!allergen) return null;
                    const isSelected = selectedAllergens.includes(allKey);

                    return (
                      <button
                        key={allKey}
                        onClick={() => toggleAllergen(allKey)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border flex items-center space-x-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-brand-blue text-white border-brand-blue shadow-xs font-bold'
                            : 'bg-white/90 text-brand-blue border-brand-gold/25 hover:border-brand-gold/50 hover:bg-white'
                        }`}
                        id={`filter-pill-${allKey}`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-brand-gold" />}
                        <span className="font-extrabold">{allergen.iconSymbol ? `${allergen.iconSymbol} ` : ''}{allergen.name[language]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Apply & View Results Button for Mobile */}
          <div className="pt-2">
            <button
              onClick={handleCloseAndScrollToMenu}
              className="w-full py-3 px-6 bg-brand-blue hover:bg-brand-blue/95 text-white rounded-full font-serif font-bold text-xs uppercase tracking-widest shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-98 border border-brand-gold/40"
              id="apply-and-view-results-btn"
            >
              <ArrowDown className="w-4 h-4 text-brand-gold" />
              <span>
                {language === 'fi'
                  ? `Näytä tulokset (${matchingCount ?? 0} annosta)`
                  : `View results (${matchingCount ?? 0} dishes)`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
