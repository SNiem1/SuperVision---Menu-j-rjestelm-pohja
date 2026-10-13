import React from 'react';
import { X, Sparkles, Camera } from 'lucide-react';
import { MenuItem } from '../types';
import Modal from './Modal';

interface ARViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem;
  language: 'fi' | 'en';
}

const DEFAULT_GLB_URL = 'https://pub-0bdbdcb354364bf7abeb4232843a203f.r2.dev/pizza.glb';
const DEFAULT_USDZ_URL = 'https://pub-0bdbdcb354364bf7abeb4232843a203f.r2.dev/pancakes_photogrammetry.usdz';

export default function ARViewerModal({ isOpen, onClose, menuItem, language }: ARViewerModalProps) {
  if (!isOpen) return null;

  const glbUrl = menuItem.arModelUrl || DEFAULT_GLB_URL;
  const usdzUrl = menuItem.arModelUsdzUrl || DEFAULT_USDZ_URL;

  // Platform detection helpers
  const isIOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

  // Directly launch native camera AR
  const triggerNativeAR = () => {
    if (isIOS) {
      // iPhone / iPad AR Quick Look trigger (requires USDZ)
      const link = document.createElement('a');
      link.setAttribute('rel', 'ar');
      link.setAttribute('href', usdzUrl);
      const img = document.createElement('img');
      link.appendChild(img);
      link.click();
    } else if (isAndroid) {
      // Android Google AR Core Scene Viewer Intent
      const title = encodeURIComponent(menuItem.name[language]);
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(glbUrl)}&mode=ar_only&title=${title}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;
      window.location.href = intentUrl;
    } else {
      // Desktop / macOS / Web trigger
      const mv = document.querySelector('model-viewer') as any;
      if (mv && mv.activateAR) {
        mv.activateAR();
      } else {
        window.open(usdzUrl, '_blank');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="ar-modal-title"
      overlayClassName="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      className="bg-brand-cream border border-brand-gold/40 rounded-3xl shadow-2xl w-full max-w-sm p-5 sm:p-6 flex flex-col space-y-4 text-[#171b18] animate-zoom-in"
    >
      <div className="flex flex-col space-y-4">
        {/* Header Title with Close Icon */}
        <div className="flex items-center justify-between pb-2.5 border-b border-brand-gold/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <h3 id="ar-modal-title" className="font-serif font-bold text-base text-brand-blue">
              {menuItem.name[language]} — AR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#171b18]/60 hover:text-[#171b18] rounded-full transition-colors cursor-pointer"
            aria-label={language === 'fi' ? 'Sulje' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simple AR Instructions */}
        <div className="bg-white/90 p-4 rounded-2xl border border-brand-gold/30 text-xs sm:text-sm text-[#171b18]/90 font-sans space-y-2 shadow-xs">
          <p className="font-bold text-brand-blue flex items-center space-x-1.5">
            <span>💡 {language === 'fi' ? 'Kuinka AR toimii:' : 'How AR works:'}</span>
          </p>
          <p className="whitespace-pre-line leading-relaxed">
            {language === 'fi'
              ? '1. Voit pyörittää 3D-mallia sormella näytöllä.\n2. Painamalla "Avaa kamera" voit heijastaa annoksen ravintolan pöydälle puhelimesi kameralla.'
              : '1. Drag with one finger to rotate the 3D model.\n2. Press "Open camera" to project the dish onto your table using your phone camera.'}
          </p>
        </div>

        {/* EXACTLY 2 BUTTONS: AVAA KAMERA & SULJE */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={triggerNativeAR}
            className="py-3 px-3 bg-brand-blue hover:bg-brand-blue/90 text-brand-gold border border-brand-gold/50 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            id="ar-open-camera-btn"
          >
            <Camera className="w-4 h-4 text-brand-gold" />
            <span>{language === 'fi' ? 'Avaa kamera' : 'Open camera'}</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-3 bg-white hover:bg-neutral-50 text-brand-blue border border-brand-gold/40 rounded-full font-serif font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer"
            id="ar-close-btn"
          >
            {language === 'fi' ? 'Sulje' : 'Close'}
          </button>
        </div>
      </div>
    </Modal>
  );
}


