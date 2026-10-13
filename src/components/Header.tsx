import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Utensils, ChevronRight, ShieldAlert } from 'lucide-react';
import { restaurantConfig } from '../config/restaurant';

interface HeaderProps {
  language: 'fi' | 'en';
  setLanguage: (lang: 'fi' | 'en') => void;
  orderItemCount: number;
  orderTotalPrice: number;
  onOpenOrderModal: () => void;
  onOpenYourFoods?: () => void;
  onOpenAllergenLegend?: () => void;
  eatenCount?: number;
}

export default function Header({
  language,
  setLanguage,
  orderItemCount,
  orderTotalPrice,
  onOpenOrderModal,
  onOpenYourFoods,
  onOpenAllergenLegend,
  eatenCount = 0,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalBadges = orderItemCount + eatenCount;

  return (
    <header className="relative w-full border-b border-brand-gold/20 bg-brand-cream/90 backdrop-blur-md z-30 transition-all duration-300 shadow-2xs" ref={menuRef}>
      {/* Main Header Top Row with generous whitespace */}
      <div className="py-3.5 sm:py-4 md:py-5 px-4 sm:px-6 md:px-10 flex items-center justify-between relative">
        {/* Logo in Top-Left Corner */}
        <div className="flex items-center space-x-3 z-10">
          {restaurantConfig.logoUrl ? (
            <img
              src={restaurantConfig.logoUrl}
              alt={`${restaurantConfig.name} Logo`}
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex items-center space-x-3 py-1">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-blue border border-brand-gold/50 flex items-center justify-center text-brand-gold shadow-xs">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-lg sm:text-xl uppercase tracking-wider text-brand-blue leading-none">
                  {restaurantConfig.name}
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-widest uppercase text-brand-gold-text mt-1">
                  {language === 'fi' ? 'Digitaalinen Menu' : 'Digital Menu'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Centered Title for Desktop */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 text-center">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-[0.3em] font-medium text-brand-blue/85 uppercase leading-none pl-[0.3em]">
            Menu
          </h1>
        </div>

        {/* Right side controls: Language toggle + Compact Hamburger Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 z-20">
          {/* Language Toggle with Sliding CSS Indicator */}
          <div className="h-9 relative flex items-center bg-black/5 p-1 rounded-full border border-black/10 select-none">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-brand-blue rounded-full shadow-md transition-transform duration-300 ease-out motion-reduce:transition-none ${
                language === 'fi' ? 'left-1 translate-x-0' : 'left-1 translate-x-full'
              }`}
            />
            <button
              onClick={() => setLanguage('fi')}
              className={`relative z-10 px-2.5 sm:px-3 py-1 text-xs font-bold rounded-full transition-colors duration-200 ${
                language === 'fi'
                  ? 'text-white'
                  : 'text-brand-blue hover:text-brand-blue'
              }`}
              id="lang-btn-fi"
            >
              FI
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`relative z-10 px-2.5 sm:px-3 py-1 text-xs font-bold rounded-full transition-colors duration-200 ${
                language === 'en'
                  ? 'text-white'
                  : 'text-brand-blue hover:text-brand-blue'
              }`}
              id="lang-btn-en"
            >
              EN
            </button>
          </div>

          {/* COMPACT HAMBURGER MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`w-10 h-10 min-w-[44px] min-h-[44px] rounded-full border transition-all duration-300 flex items-center justify-center relative shadow-md active:scale-95 cursor-pointer ${
              isMenuOpen
                ? 'bg-brand-blue text-brand-gold border-brand-gold/60 ring-2 ring-brand-gold/30'
                : 'bg-brand-blue hover:bg-brand-blue/90 text-white border-brand-gold/40'
            }`}
            id="header-cardnav-menu-btn"
            aria-expanded={isMenuOpen}
            aria-label={language === 'fi' ? 'Avaa valikko' : 'Open menu'}
          >
            {/* Animated Hamburger / X Lines */}
            <div className="w-4 h-3 flex flex-col justify-between items-center relative">
              <span
                className={`w-full h-0.5 bg-brand-gold rounded-full transition-all duration-300 transform origin-center ${
                  isMenuOpen ? 'translate-y-[5px] rotate-45' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-brand-gold rounded-full transition-all duration-200 ${
                  isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-full h-0.5 bg-brand-gold rounded-full transition-all duration-300 transform origin-center ${
                  isMenuOpen ? '-translate-y-[5px] -rotate-45' : ''
                }`}
              />
            </div>

            {/* Combined badge count dot indicator */}
            {totalBadges > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-blue font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-brand-blue">
                {totalBadges}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile-only "MENU" title placed naturally below top row */}
      <div className="md:hidden w-full text-center pt-0.5 pb-2 z-10">
        <span className="font-serif text-2xl tracking-[0.3em] font-semibold text-brand-blue uppercase pl-[0.3em]">
          Menu
        </span>
      </div>

      {/* SMOOTH COLLAPSIBLE DROPDOWN IN FLOW (Pushes content down) */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          isMenuOpen
            ? 'grid-rows-[1fr] opacity-100 border-t border-brand-gold/20 pointer-events-auto'
            : 'grid-rows-[0fr] opacity-0 border-t-0 pointer-events-none'
        } bg-brand-cream/90`}
        aria-hidden={!isMenuOpen}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-8 py-4 max-w-4xl mx-auto">
            {/* SIDE-BY-SIDE ITEMS GRID */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Item 1: Tilauslista / Order List */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenOrderModal();
                }}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                  orderItemCount > 0
                    ? 'bg-brand-blue text-white border-brand-gold/40 shadow-xs'
                    : 'bg-white hover:bg-brand-gold/10 text-brand-blue border-brand-gold/25 shadow-2xs'
                }`}
                id="dropdown-order-list-btn"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border flex-shrink-0 ${
                      orderItemCount > 0
                        ? 'bg-brand-gold/20 border-brand-gold/40 text-brand-gold'
                        : 'bg-brand-gold/15 border-brand-gold/30 text-brand-blue'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-serif font-bold text-xs sm:text-sm tracking-wide truncate">
                      {language === 'fi' ? 'Tilauslista' : 'Order List'}
                    </div>
                    <p
                      className={`text-[10px] sm:text-[11px] font-sans truncate ${
                        orderItemCount > 0 ? 'text-white/80' : 'text-[#1e1e1a]/70'
                      }`}
                    >
                      {orderItemCount > 0
                        ? `${orderItemCount} st • ${orderTotalPrice.toFixed(2).replace('.', ',')} €`
                        : language === 'fi'
                        ? 'Katso lista'
                        : 'View items'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
                  {orderItemCount > 0 && (
                    <span className="bg-brand-gold text-brand-blue font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-2xs">
                      {orderItemCount}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                      orderItemCount > 0 ? 'text-brand-gold' : 'text-brand-blue/60'
                    }`}
                  />
                </div>
              </button>

              {/* Item 2: Sinun Ruokasi / Your Foods */}
              {onOpenYourFoods && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenYourFoods();
                  }}
                  className="w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group bg-white hover:bg-brand-gold/15 text-brand-blue border-brand-gold/25 shadow-2xs cursor-pointer"
                  id="dropdown-your-foods-btn"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-blue flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-4 h-4 text-brand-gold" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-serif font-bold text-xs sm:text-sm text-brand-blue tracking-wide truncate">
                        {language === 'fi' ? 'Sinun ruokasi' : 'Your Foods'}
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-sans text-[#1e1e1a]/70 truncate">
                        {language === 'fi' ? 'Tallennetut & arvostelut' : 'Saved & reviews'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
                    {eatenCount > 0 && (
                      <span className="bg-brand-blue text-brand-gold font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-2xs">
                        {eatenCount}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-brand-blue/60 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              )}

              {/* Item 3: Allergeenit & Merkinnät / Allergen Info */}
              {onOpenAllergenLegend && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAllergenLegend();
                  }}
                  className="w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group bg-white hover:bg-brand-gold/15 text-brand-blue border-brand-gold/25 shadow-2xs cursor-pointer col-span-2"
                  id="dropdown-allergen-legend-btn"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-blue flex items-center justify-center flex-shrink-0">
                      <ShieldAlert className="w-4 h-4 text-brand-gold" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-serif font-bold text-xs sm:text-sm text-brand-blue tracking-wide truncate">
                        {language === 'fi' ? 'Allergeenit & Merkinnät' : 'Allergens & Dietary Info'}
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-sans text-[#1e1e1a]/70 truncate">
                        {language === 'fi' ? 'Katso erityisruokavalio- ja allergeenimerkinnät' : 'View dietary markings & allergen key'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
                    <ChevronRight className="w-4 h-4 text-brand-blue/60 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
