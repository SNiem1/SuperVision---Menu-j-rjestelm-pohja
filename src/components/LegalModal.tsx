import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, FileText, Cookie, CheckCircle2, Lock, Info } from 'lucide-react';
import Modal from './Modal';
import { restaurantConfig } from '../config/restaurant';
import {
  getPrivacyPolicyContent,
  getTermsOfServiceContent,
  getCookiePolicyContent,
} from '../config/legal';

export type LegalTab = 'privacy' | 'terms' | 'cookies';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
  language: 'fi' | 'en';
}

export default function LegalModal({
  isOpen,
  onClose,
  initialTab = 'privacy',
  language,
}: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const currentContent =
    activeTab === 'privacy'
      ? getPrivacyPolicyContent(restaurantConfig, language)
      : activeTab === 'terms'
      ? getTermsOfServiceContent(restaurantConfig, language)
      : getCookiePolicyContent(restaurantConfig, language);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="legal-modal-title"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
      className="bg-brand-cream border border-brand-gold/40 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-[#171b18] animate-zoom-in"
    >
      {/* Header */}
      <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-brand-gold/30 flex items-center justify-between bg-brand-blue text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-brand-gold/20 border border-brand-gold/40 rounded-full text-brand-gold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 id="legal-modal-title" className="font-serif font-bold text-base sm:text-lg text-brand-gold tracking-wide">
              {language === 'fi' ? 'Oikeudelliset tiedot' : 'Legal Information'}
            </h3>
            <p className="text-[11px] text-white/90 font-sans">
              {restaurantConfig.name} • {restaurantConfig.address}, {restaurantConfig.city}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={language === 'fi' ? 'Sulje' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-gold/20 bg-black/5 p-2 space-x-1.5 sm:space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-full text-xs font-serif font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px] ${
            activeTab === 'privacy'
              ? 'bg-brand-blue text-brand-gold border border-brand-gold/40 shadow-xs'
              : 'text-brand-blue hover:text-brand-blue hover:bg-white/40'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'fi' ? 'Tietosuojaseloste' : 'Privacy Policy'}</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-full text-xs font-serif font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px] ${
            activeTab === 'terms'
              ? 'bg-brand-blue text-brand-gold border border-brand-gold/40 shadow-xs'
              : 'text-brand-blue hover:text-brand-blue hover:bg-white/40'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{language === 'fi' ? 'Käyttöehdot' : 'Terms of Service'}</span>
        </button>

        <button
          onClick={() => setActiveTab('cookies')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-full text-xs font-serif font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px] ${
            activeTab === 'cookies'
              ? 'bg-brand-blue text-brand-gold border border-brand-gold/40 shadow-xs'
              : 'text-brand-blue hover:text-brand-blue hover:bg-white/40'
          }`}
        >
          <Cookie className="w-3.5 h-3.5" />
          <span>{language === 'fi' ? 'Evästekäytäntö' : 'Cookie Policy'}</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-7 overflow-y-auto space-y-5 text-xs sm:text-sm font-sans leading-relaxed text-[#171b18] flex-1">
        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl flex items-start space-x-3.5 ${
              activeTab === 'privacy'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : activeTab === 'terms'
                ? 'bg-brand-gold/10 border border-brand-gold/30 text-brand-blue'
                : 'bg-blue-50 border border-blue-200 text-blue-900'
            }`}
          >
            {activeTab === 'privacy' && <Lock className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />}
            {activeTab === 'terms' && <Info className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />}
            {activeTab === 'cookies' && <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
            <div>
              <h4 className="font-serif font-bold text-sm">
                {currentContent.bannerTitle}
              </h4>
              <p className="text-xs opacity-90 mt-0.5">
                {currentContent.bannerSubtitle}
              </p>
            </div>
          </div>

          {currentContent.sections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h4 className="font-serif font-bold text-brand-blue text-base border-b border-brand-gold/20 pb-1">
                {section.title}
              </h4>
              {section.content && <p>{section.content}</p>}
              {section.details && (
                <div className="space-y-1">
                  {section.details.map((d, dIdx) => (
                    <p key={dIdx}>
                      <strong>{d.label}:</strong> {d.value}
                    </p>
                  ))}
                </div>
              )}
              {section.items && (
                <ul className="list-disc pl-5 space-y-1">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-4 sm:p-5 border-t border-brand-gold/30 bg-black/5 flex items-center justify-between">
        <span className="text-[11px] text-[#171b18]/80">
          {language === 'fi'
            ? `Päivitetty 2026 • ${restaurantConfig.name}`
            : `Updated 2026 • ${restaurantConfig.name}`}
        </span>
        <button
          onClick={onClose}
          className="px-6 py-2.5 min-h-[44px] bg-brand-blue hover:bg-brand-blue/90 text-brand-gold border border-brand-gold/40 font-serif font-bold text-xs uppercase tracking-wider rounded-full shadow-xs transition-colors cursor-pointer"
        >
          {language === 'fi' ? 'Selvä' : 'Got it'}
        </button>
      </div>
    </Modal>
  );
}

