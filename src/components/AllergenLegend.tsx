import React from 'react';
import { X, CheckCircle2, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { ALLERGENS } from '../data/menuData';
import Modal from './Modal';

interface AllergenLegendProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fi' | 'en';
}

export default function AllergenLegend({ isOpen, onClose, language }: AllergenLegendProps) {
  if (!isOpen) return null;

  const allergensList = Object.values(ALLERGENS);

  const freeFrom = allergensList.filter((a) => a.kind === 'free-from');
  const contains = allergensList.filter((a) => a.kind === 'contains');
  const origin = allergensList.filter((a) => a.kind === 'origin');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="allergen-legend-title"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in"
      className="bg-brand-cream border border-brand-gold/40 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden relative text-[#171b18] animate-zoom-in my-0 sm:my-auto"
    >
      {/* Header */}
      <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-brand-gold/30 flex items-center justify-between bg-brand-blue text-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 id="allergen-legend-title" className="font-serif font-bold text-base sm:text-lg tracking-wide">
              {language === 'fi' ? 'Allergeenit & Merkinnät' : 'Allergens & Dietary Info'}
            </h3>
            <p className="text-[11px] text-white/85 font-sans">
              {language === 'fi' ? 'Ruokalistan merkintöjen selitykset' : 'Explanations for menu markings'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
          id="close-allergen-legend-btn"
          aria-label={language === 'fi' ? 'Sulje' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Scrollable Content */}
      <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs sm:text-sm">
        {/* Disclaimer box */}
        <div className="p-4 bg-[#faf4ed] border border-[#b45309]/30 rounded-2xl flex items-start space-x-3.5 text-[#78350f]">
          <ShieldAlert className="w-5 h-5 text-[#b45309] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-serif font-bold uppercase tracking-wider text-[11px] text-[#78350f] block">
              {language === 'fi' ? 'Tärkeää tietoa allergikoille' : 'Important Notice'}
            </span>
            <p className="text-xs leading-relaxed text-[#78350f]/90 font-sans">
              {language === 'fi'
                ? 'Allergiatiedot ovat suuntaa-antavia. Vakavista allergioista pyydämme ilmoittamaan henkilökunnalle tilauksen yhteydessä.'
                : 'Allergen information is indicative. Guests with severe allergies are advised to inform staff when ordering.'}
            </p>
          </div>
        </div>

        {/* Group 1: Free-From */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 pb-1.5 border-b border-brand-gold/20">
            <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
            <h4 className="font-serif font-bold text-sm text-brand-blue uppercase tracking-wider">
              {language === 'fi' ? 'Erityisruokavaliot (Ei sisällä)' : 'Special Diets (Free From)'}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {freeFrom.map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-2xl bg-[#f1f5f2] border border-[#2d6a4f]/25 flex items-start space-x-2.5"
              >
                <span className="px-2 py-0.5 rounded-full bg-[#2d6a4f] text-white font-extrabold text-[10px] shrink-0 mt-0.5">
                  {item.key}
                </span>
                <div>
                  <span className="font-bold text-[#1b4332] block text-xs">
                    {item.name[language]}
                  </span>
                  {item.description && (
                    <p className="text-[11px] text-[#1b4332]/80 leading-tight mt-0.5">
                      {item.description[language]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group 2: Contains */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 pb-1.5 border-b border-brand-gold/20">
            <AlertTriangle className="w-4 h-4 text-[#b45309]" />
            <h4 className="font-serif font-bold text-sm text-brand-blue uppercase tracking-wider">
              {language === 'fi' ? 'Allergeenit (Sisältää)' : 'Allergens (Contains)'}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {contains.map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-2xl bg-[#faf4ed] border border-[#b45309]/25 flex items-start space-x-2.5"
              >
                <span className="px-2 py-0.5 rounded-full bg-[#b45309] text-white font-extrabold text-[10px] shrink-0 mt-0.5">
                  {item.key}
                </span>
                <div>
                  <span className="font-bold text-[#78350f] block text-xs">
                    {item.name[language]}
                  </span>
                  {item.description && (
                    <p className="text-[11px] text-[#78350f]/80 leading-tight mt-0.5">
                      {item.description[language]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group 3: Origin & Certifications */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 pb-1.5 border-b border-brand-gold/20">
            <span className="text-sm">🌐</span>
            <h4 className="font-serif font-bold text-sm text-brand-blue uppercase tracking-wider">
              {language === 'fi' ? 'Alkuperä & Merkinnät' : 'Origin & Certifications'}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {origin.map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-2xl bg-[#f2f4f8] border border-brand-gold/35 flex items-start space-x-2.5"
              >
                <span className="px-2 py-0.5 rounded-full bg-brand-blue text-brand-gold font-extrabold text-[10px] shrink-0 mt-0.5 flex items-center space-x-1">
                  {item.iconSymbol && <span>{item.iconSymbol}</span>}
                  <span>{item.key}</span>
                </span>
                <div>
                  <span className="font-bold text-brand-blue block text-xs">
                    {item.name[language]}
                  </span>
                  {item.description && (
                    <p className="text-[11px] text-[#171b18]/70 leading-tight mt-0.5">
                      {item.description[language]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-5 bg-brand-cream border-t border-brand-gold/30 flex justify-end shrink-0">
        <button
          onClick={onClose}
          className="px-6 py-2.5 min-h-[44px] bg-brand-blue text-white rounded-full font-serif font-bold text-xs uppercase tracking-wider hover:bg-brand-blue/90 transition-colors shadow-xs cursor-pointer flex items-center justify-center"
        >
          {language === 'fi' ? 'Selvä' : 'Got it'}
        </button>
      </div>
    </Modal>
  );
}

