import React, { useState } from 'react';
import { Lock, KeyRound, X, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { restaurantConfig } from '../config/restaurant';

interface AdminLoginModalProps {
  language: 'fi' | 'en';
}

export default function AdminLoginModal({ language }: AdminLoginModalProps) {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage(
        language === 'fi'
          ? 'Ole hyvä ja syötä salasana tai PIN-koodi.'
          : 'Please enter the password or PIN code.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Subtle natural feedback
    setTimeout(() => {
      const res = login(password);
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(
          language === 'fi'
            ? res.error || 'Virheellinen salasana tai PIN-koodi.'
            : 'Incorrect password or PIN code. Try "ravintola" or PIN "1931".'
        );
      } else {
        setPassword('');
      }
    }, 150);
  };

  const fillQuickPin = (pin: string) => {
    setPassword(pin);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-gold/30 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
      >
        {/* Header Ribbon */}
        <div className="bg-brand-blue text-white p-6 pb-7 text-center relative border-b border-brand-gold/30">
          <button
            onClick={() => {
              setIsLoginModalOpen(false);
              setErrorMessage(null);
              setPassword('');
            }}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label={language === 'fi' ? 'Sulje' : 'Close'}
            id="admin-login-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-brand-gold/20 border border-brand-gold/50 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner text-brand-gold">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-brand-gold block mb-1">
            {restaurantConfig.name}
          </span>
          <h2 id="admin-login-title" className="font-serif font-bold text-xl md:text-2xl tracking-wide">
            {language === 'fi' ? 'Henkilökunnan kirjautuminen' : 'Staff Admin Login'}
          </h2>
          <p className="text-xs text-white/80 max-w-xs mx-auto mt-1.5 font-sans leading-relaxed">
            {language === 'fi'
              ? 'Kirjaudu sisään hallitaksesi ruokalistaa, annosten kuvia ja reaaliaikaista saatavuutta.'
              : 'Log in to manage the digital menu, food photos, and live item availability.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 font-sans">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-2xl text-xs flex items-start space-x-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="admin-password-input"
              className="block text-xs font-bold uppercase tracking-wider text-[#1e1e1a]/80"
            >
              {language === 'fi' ? 'Salasana tai PIN-koodi' : 'Password or PIN'}
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1e1e1a]/50">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder={language === 'fi' ? 'Kirjoita salasana tai PIN...' : 'Enter password or PIN...'}
                className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-brand-gold/40 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-white"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#1e1e1a]/50 hover:text-brand-blue cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Credential Hint Pill */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-xs text-[#78350f] space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{language === 'fi' ? 'Oletuskirjautumistiedot testaukseen:' : 'Default credentials for testing:'}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => fillQuickPin('ravintola')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-300 font-mono text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                ravintola
              </button>
              <button
                type="button"
                onClick={() => fillQuickPin('1931')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-300 font-mono text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                PIN: 1931
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 font-medium text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {language === 'fi' ? 'Peruuta' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
              id="admin-submit-login-btn"
            >
              <CheckCircle2 className="w-4 h-4 text-brand-gold" />
              <span>{isSubmitting ? (language === 'fi' ? 'Tarkistetaan...' : 'Verifying...') : (language === 'fi' ? 'Kirjaudu sisään' : 'Log In')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
