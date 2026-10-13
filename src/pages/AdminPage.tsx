import React, { useState, useMemo, useEffect } from 'react';
import { MenuItem, Category } from '../types';
import { useMenu } from '../context/MenuContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import DishEditModal from '../components/DishEditModal';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Plus,
  Search,
  AlertTriangle,
  Edit2,
  Trash2,
  RotateCcw,
  LogOut,
  Utensils,
  Sparkles,
  Download,
  Upload,
  Globe,
  ExternalLink,
  Shield,
  Key,
  Sun,
  Moon,
} from 'lucide-react';
import { restaurantConfig } from '../config/restaurant';

interface AdminPageProps {
  language: 'fi' | 'en';
  onLanguageChange: (lang: 'fi' | 'en') => void;
}

export default function AdminPage({ language, onLanguageChange }: AdminPageProps) {
  const {
    isAuthenticated,
    navigateTo,
    getAdminDirectUrl,
    login,
    logout,
    changePassword,
  } = useAdminAuth();

  const {
    menuItems,
    categories,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    resetToDefaultMenu,
    exportMenuJson,
    importMenuJson,
  } = useMenu();

  // Theme state: 'dark' or 'light' (persisted in localStorage)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('kolme_kruunua_admin_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // fallback
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('kolme_kruunua_admin_theme', theme);
    } catch {
      // fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  // Login form states
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Admin dashboard states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'soldout'>('all');
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Password change modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  const directUrl = getAdminDirectUrl();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyDirectLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(directUrl);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = directUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      showToast(
        language === 'fi'
          ? 'Hallintapaneelin suora linkki kopioitu leikepöydälle!'
          : 'Direct link to admin panel copied to clipboard!'
      );
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      showToast(language === 'fi' ? 'Linkki: ' + directUrl : 'Link: ' + directUrl);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setLoginError(
        language === 'fi'
          ? 'Ole hyvä ja syötä salasana tai PIN-koodi.'
          : 'Please enter the password or PIN code.'
      );
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    setTimeout(() => {
      const res = login(passwordInput);
      setIsLoggingIn(false);
      if (!res.success) {
        setLoginError(
          language === 'fi'
            ? res.error || 'Virheellinen salasana tai PIN-koodi.'
            : 'Incorrect password or PIN code. Try "ravintola" or PIN "1931".'
        );
      } else {
        setPasswordInput('');
        showToast(
          language === 'fi'
            ? 'Kirjauduttu sisään onnistuneesti!'
            : 'Logged in successfully!'
        );
      }
    }, 150);
  };

  const handleQuickPin = (pin: string) => {
    setPasswordInput(pin);
    setLoginError(null);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    changePassword(newPassword.trim());
    setPasswordChangeSuccess(true);
    setTimeout(() => {
      setPasswordChangeSuccess(false);
      setIsPasswordModalOpen(false);
      setNewPassword('');
      showToast(
        language === 'fi'
          ? 'Henkilökunnan salasana päivitetty onnistuneesti!'
          : 'Staff password updated successfully!'
      );
    }, 1200);
  };

  // Metrics
  const totalCount = menuItems.length;
  const soldOutCount = menuItems.filter((i) => i.isAvailable === false).length;
  const availableCount = totalCount - soldOutCount;

  // Filtered dishes
  const displayedItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (availabilityFilter === 'available' && item.isAvailable === false) return false;
      if (availabilityFilter === 'soldout' && item.isAvailable !== false) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName =
          item.name.fi.toLowerCase().includes(q) || item.name.en.toLowerCase().includes(q);
        const matchDesc =
          item.description.fi.toLowerCase().includes(q) ||
          item.description.en.toLowerCase().includes(q);
        const catObj = categories.find((c) => c.id === item.category);
        const matchCat = catObj
          ? catObj.name.fi.toLowerCase().includes(q) || catObj.name.en.toLowerCase().includes(q)
          : false;

        return matchName || matchDesc || matchCat;
      }

      return true;
    });
  }, [menuItems, availabilityFilter, selectedCategory, searchQuery, categories]);

  // If user is NOT authenticated, display dedicated Login Page
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col font-sans transition-colors ${
        isDark
          ? 'bg-stone-900 text-stone-100 selection:bg-brand-gold selection:text-brand-blue'
          : 'bg-stone-100 text-stone-900 selection:bg-brand-blue selection:text-white'
      }`}>
        {/* Top minimal header */}
        <header className={`border-b backdrop-blur-md px-4 py-3.5 sm:px-6 flex items-center justify-between transition-colors ${
          isDark
            ? 'border-stone-800 bg-stone-950/80'
            : 'border-stone-200 bg-white/90 shadow-xs'
        }`}>
          <button
            onClick={() => navigateTo('menu')}
            className={`flex items-center space-x-2 transition-colors text-xs font-serif font-bold uppercase tracking-wider cursor-pointer ${
              isDark ? 'text-stone-300 hover:text-white' : 'text-stone-700 hover:text-stone-950'
            }`}
            id="admin-login-back-to-menu-btn"
          >
            <ArrowLeft className="w-4 h-4 text-brand-gold" />
            <span>{language === 'fi' ? 'Palaa asiakasruokalistaan' : 'Back to customer menu'}</span>
          </button>

          <div className="flex items-center space-x-2.5">
            {/* Theme toggle in login header */}
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer shadow-2xs ${
                isDark
                  ? 'border-stone-700 hover:border-brand-gold/50 bg-stone-800/80 text-amber-300'
                  : 'border-stone-300 hover:border-stone-400 bg-stone-50 text-stone-800'
              }`}
              id="admin-login-theme-toggle-btn"
              title={isDark ? (language === 'fi' ? 'Vaihda vaaleaan tilaan' : 'Switch to Light Mode') : (language === 'fi' ? 'Vaihda tummaan tilaan' : 'Switch to Dark Mode')}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{language === 'fi' ? 'Vaalea tila' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-brand-blue" />
                  <span className="hidden sm:inline">{language === 'fi' ? 'Tumma tila' : 'Dark'}</span>
                </>
              )}
            </button>

            {/* Language toggle */}
            <button
              onClick={() => onLanguageChange(language === 'fi' ? 'en' : 'fi')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors cursor-pointer ${
                isDark
                  ? 'border-stone-700 hover:border-brand-gold/50 bg-stone-800/80 text-stone-300 hover:text-white'
                  : 'border-stone-300 hover:border-stone-400 bg-stone-50 text-stone-700 hover:text-stone-900'
              }`}
              aria-label="Vaihda kieli"
            >
              <Globe className="w-3.5 h-3.5 text-brand-gold" />
              <span className="font-bold">{language.toUpperCase()}</span>
            </button>
          </div>
        </header>

        {/* Dedicated Login Hero Section */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div className={`w-full max-w-lg border rounded-3xl shadow-2xl overflow-hidden animate-fade-in backdrop-blur-md transition-colors ${
            isDark
              ? 'bg-stone-950/90 border-brand-gold/30'
              : 'bg-white border-stone-200'
          }`}>
            {/* Crest and Header */}
            <div className={`p-7 sm:p-9 text-center border-b transition-colors ${
              isDark
                ? 'border-stone-800/90 bg-radial from-stone-900 to-stone-950'
                : 'border-stone-200 bg-gradient-to-b from-stone-50 to-stone-100/50'
            }`}>
              <div className="w-16 h-16 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center mx-auto mb-4 text-brand-gold shadow-lg shadow-brand-gold/5">
                <Lock className="w-8 h-8" />
              </div>
              <span className="text-xs font-serif tracking-widest text-brand-gold uppercase font-bold block mb-1">
                {restaurantConfig.name}
              </span>
              <h1 className={`text-2xl sm:text-3xl font-serif font-bold tracking-wide ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}>
                {language === 'fi' ? 'Hallintapaneeli' : 'Admin Portal'}
              </h1>
              <p className={`text-xs sm:text-sm mt-2 max-w-sm mx-auto leading-relaxed ${
                isDark ? 'text-stone-400' : 'text-stone-600'
              }`}>
                {language === 'fi'
                  ? 'Erillinen sivu ravintolan henkilökunnalle. Kirjaudu sisään päivittääksesi ruokalistaa, hintoja, kuvia ja reaaliaikaista saatavuutta.'
                  : 'Dedicated page for restaurant staff. Log in to update menu items, pricing, photos, and live availability.'}
              </p>
            </div>

            {/* Direct Link Share Banner */}
            <div className="px-7 sm:px-9 pt-6 pb-2">
              <div className={`border rounded-2xl p-3.5 text-xs space-y-2 transition-colors ${
                isDark
                  ? 'bg-stone-900/90 border-stone-800 text-stone-300'
                  : 'bg-stone-50 border-stone-200 text-stone-700'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold flex items-center space-x-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{language === 'fi' ? 'Suora linkki tälle sivulle:' : 'Direct link to this page:'}</span>
                  </span>
                  <button
                    onClick={handleCopyDirectLink}
                    className="text-[11px] font-bold text-amber-500 hover:text-amber-600 flex items-center space-x-1 underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">{language === 'fi' ? 'Kopioitu!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{language === 'fi' ? 'Kopioi linkki' : 'Copy link'}</span>
                      </>
                    )}
                  </button>
                </div>
                <div className={`font-mono text-[11px] px-3 py-1.5 rounded-lg border truncate select-all transition-colors ${
                  isDark
                    ? 'text-stone-400 bg-stone-950 border-stone-800/80'
                    : 'text-stone-700 bg-white border-stone-200'
                }`}>
                  {directUrl}
                </div>
                <p className={`text-[10px] leading-tight ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {language === 'fi'
                    ? 'Tallenna selaimeen tai jaa keittiön ja salin henkilökunnalle.'
                    : 'Bookmark in your browser or share with kitchen and floor staff.'}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="p-7 sm:p-9 pt-4 space-y-5">
              {loginError && (
                <div className="bg-red-950/60 border border-red-700/60 text-red-200 p-3.5 rounded-2xl text-xs flex items-start space-x-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{loginError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="admin-standalone-pass-input"
                  className={`block text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-stone-300' : 'text-stone-700'
                  }`}
                >
                  {language === 'fi' ? 'Salasana tai PIN-koodi' : 'Password or PIN'}
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-standalone-pass-input"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder={language === 'fi' ? 'Syötä salasana tai PIN...' : 'Enter password or PIN...'}
                    className={`w-full pl-10 pr-11 py-3 text-sm rounded-xl border outline-none transition-all ${
                      isDark
                        ? 'border-stone-700 bg-stone-900/80 text-white placeholder-stone-500 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                        : 'border-stone-300 bg-white text-stone-900 placeholder-stone-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 shadow-2xs'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-brand-gold cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick credential hints for testing */}
              <div className={`border rounded-2xl p-3 text-xs space-y-1.5 transition-colors ${
                isDark
                  ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}>
                <div className={`flex items-center space-x-1.5 font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{language === 'fi' ? 'Oletuskirjautumistiedot testaukseen:' : 'Default credentials for testing:'}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleQuickPin('ravintola')}
                    className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-amber-900/50 hover:bg-amber-800/80 text-amber-200 border-amber-700/60'
                        : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                    }`}
                  >
                    ravintola
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPin('1931')}
                    className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-amber-900/50 hover:bg-amber-800/80 text-amber-200 border-amber-700/60'
                        : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                    }`}
                  >
                    PIN: 1931
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-brand-blue font-serif font-bold text-sm uppercase tracking-wider shadow-lg shadow-brand-gold/10 transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
                id="admin-standalone-login-submit-btn"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isLoggingIn
                    ? (language === 'fi' ? 'Tarkistetaan...' : 'Verifying...')
                    : (language === 'fi' ? 'Kirjaudu hallintapaneeliin' : 'Enter Admin Panel')}
                </span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('menu')}
                  className={`text-xs underline underline-offset-4 transition-colors cursor-pointer ${
                    isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {language === 'fi' ? '← Takaisin asiakaspuolelle' : '← Back to customer view'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED: Dedicated Full Admin Page
  // ==========================================
  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors pb-20 ${
      isDark
        ? 'bg-stone-950 text-stone-100 selection:bg-brand-gold selection:text-brand-blue'
        : 'bg-stone-100 text-stone-900 selection:bg-brand-blue selection:text-white'
    }`}>
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center space-x-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP APPLICATION BAR */}
      <header className={`sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md transition-colors ${
        isDark
          ? 'bg-stone-900/95 border-b border-stone-800'
          : 'bg-white/95 border-b border-stone-200 shadow-xs'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-lg shadow-inner transition-colors ${
            isDark
              ? 'bg-brand-gold/15 border border-brand-gold/40 text-brand-gold'
              : 'bg-brand-gold/25 border border-brand-gold/60 text-brand-blue'
          }`}>
            ♔
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`font-serif font-bold text-base sm:text-lg tracking-wide ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}>
                {restaurantConfig.name}
              </h1>
              <span className={`hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                isDark
                  ? 'bg-emerald-950 border-emerald-600 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{language === 'fi' ? 'Hallintatila aktiivinen' : 'Admin Active'}</span>
              </span>
            </div>
            <p className={`text-[11px] font-serif ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              {language === 'fi' ? 'Ruokalistan & saatavuuden hallinta' : 'Menu & availability manager'}
            </p>
          </div>
        </div>

        {/* Actions on right */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Theme Toggle Button (Light / Dark Mode) */}
          <button
            onClick={toggleTheme}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs ${
              isDark
                ? 'border-stone-700 bg-stone-800 hover:bg-stone-700 text-amber-300'
                : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800'
            }`}
            id="admin-dashboard-theme-toggle-btn"
            title={
              isDark
                ? (language === 'fi' ? 'Vaihda vaaleaan tilaan' : 'Switch to Light Mode')
                : (language === 'fi' ? 'Vaihda tummaan tilaan' : 'Switch to Dark Mode')
            }
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{language === 'fi' ? 'Vaalea tila' : 'Light mode'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-brand-blue" />
                <span className="hidden sm:inline">{language === 'fi' ? 'Tumma tila' : 'Dark mode'}</span>
              </>
            )}
          </button>

          {/* Direct link copy button */}
          <button
            onClick={handleCopyDirectLink}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs ${
              isDark
                ? 'border-stone-700 bg-stone-800 hover:bg-stone-700/80 text-stone-200 hover:text-white'
                : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-950'
            }`}
            title={directUrl}
            id="admin-copy-link-header-btn"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">{language === 'fi' ? 'Linkki kopioitu' : 'Link copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-brand-gold" />
                <span>{language === 'fi' ? 'Kopioi suora hallintalinkki' : 'Copy admin link'}</span>
              </>
            )}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => onLanguageChange(language === 'fi' ? 'en' : 'fi')}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              isDark
                ? 'border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white'
                : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-900'
            }`}
            title="Vaihda kieli"
          >
            {language.toUpperCase()}
          </button>

          {/* Change password button */}
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs transition-colors flex items-center space-x-1 cursor-pointer ${
              isDark
                ? 'border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white'
                : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-900'
            }`}
            title={language === 'fi' ? 'Vaihda salasana' : 'Change password'}
          >
            <Key className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden md:inline">{language === 'fi' ? 'Salasana' : 'Password'}</span>
          </button>

          {/* Customer menu link */}
          <button
            onClick={() => navigateTo('menu')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-bold transition-colors flex items-center space-x-1.5 cursor-pointer ${
              isDark
                ? 'border-brand-gold/40 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold'
                : 'border-brand-blue/30 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue'
            }`}
            id="admin-go-to-menu-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'fi' ? 'Siirry asiakasmenuun' : 'Customer menu'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className={`px-2.5 py-1.5 rounded-xl border text-xs transition-colors flex items-center space-x-1 cursor-pointer ${
              isDark
                ? 'border-red-900/50 bg-red-950/40 hover:bg-red-900/60 text-red-300'
                : 'border-red-200 bg-red-50 hover:bg-red-100 text-red-700'
            }`}
            id="admin-logout-btn"
            title={language === 'fi' ? 'Kirjaudu ulos' : 'Log out'}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'fi' ? 'Ulos' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* MAIN ADMIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TOP METRICS & QUICK ADD ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Metric 1: Total */}
          <div className={`border p-4 rounded-2xl flex items-center justify-between transition-colors ${
            isDark
              ? 'bg-stone-900/80 border-stone-800'
              : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <div>
              <p className={`text-xs font-serif uppercase tracking-wider ${
                isDark ? 'text-stone-400' : 'text-stone-500'
              }`}>
                {language === 'fi' ? 'Annoksia yhteensä' : 'Total Items'}
              </p>
              <p className={`text-2xl font-serif font-bold mt-0.5 ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}>
                {totalCount}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-700'
            }`}>
              <Utensils className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 2: Available */}
          <div className={`border p-4 rounded-2xl flex items-center justify-between transition-colors ${
            isDark
              ? 'bg-stone-900/80 border-emerald-900/40'
              : 'bg-emerald-50/70 border-emerald-200 shadow-xs'
          }`}>
            <div>
              <p className={`text-xs font-serif uppercase tracking-wider ${
                isDark ? 'text-emerald-400/90' : 'text-emerald-800'
              }`}>
                {language === 'fi' ? 'Saatavilla salissa' : 'Available'}
              </p>
              <p className={`text-2xl font-serif font-bold mt-0.5 ${
                isDark ? 'text-emerald-400' : 'text-emerald-900'
              }`}>
                {availableCount}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
              isDark
                ? 'bg-emerald-950 border-emerald-800/50 text-emerald-400'
                : 'bg-emerald-100 border-emerald-300 text-emerald-700'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 3: Sold out / Ingredient missing */}
          <div
            onClick={() => setAvailabilityFilter(availabilityFilter === 'soldout' ? 'all' : 'soldout')}
            className={`border p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
              isDark
                ? (soldOutCount > 0
                    ? 'border-amber-600/70 bg-amber-950/20 hover:bg-amber-950/30'
                    : 'border-stone-800 bg-stone-900/80')
                : (soldOutCount > 0
                    ? 'border-amber-300 bg-amber-50/90 hover:bg-amber-100/80 shadow-xs'
                    : 'border-stone-200 bg-white shadow-xs')
            }`}
          >
            <div>
              <div className="flex items-center space-x-1.5">
                <p className={`text-xs font-serif uppercase tracking-wider font-bold ${
                  isDark ? 'text-amber-400' : 'text-amber-900'
                }`}>
                  {language === 'fi' ? 'Tilapäisesti loppu' : 'Sold Out'}
                </p>
                {soldOutCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <p className={`text-2xl font-serif font-bold mt-0.5 ${
                isDark ? 'text-amber-300' : 'text-amber-800'
              }`}>
                {soldOutCount}
                <span className={`text-xs font-normal ml-1.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {language === 'fi' ? 'annosta' : 'items'}
                </span>
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
              isDark
                ? 'bg-amber-950 border-amber-700/50 text-amber-400'
                : 'bg-amber-100 border-amber-300 text-amber-700'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          {/* Action 4: Add New Dish Button */}
          <div className="sm:col-span-3 lg:col-span-1 flex">
            <button
              onClick={() => {
                setEditingDish(null);
                setIsDishModalOpen(true);
              }}
              className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-blue rounded-2xl p-4 font-serif font-bold text-sm tracking-wider uppercase shadow-lg shadow-brand-gold/10 transition-all active:scale-98 flex items-center justify-center space-x-2 cursor-pointer border border-brand-gold"
              id="admin-add-dish-btn"
            >
              <Plus className="w-5 h-5" />
              <span>{language === 'fi' ? 'Lisää uusi annos' : 'Add New Dish'}</span>
            </button>
          </div>
        </div>

        {/* INGREDIENT / AVAILABILITY ADVISORY BANNER */}
        <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-amber-950/40 border-amber-700/40'
            : 'bg-amber-50/80 border-amber-200 shadow-xs'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
              isDark
                ? 'bg-amber-900/60 border-amber-600/60 text-amber-300'
                : 'bg-amber-100 border-amber-300 text-amber-800'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`font-serif font-bold text-sm ${
                isDark ? 'text-amber-200' : 'text-amber-950'
              }`}>
                {language === 'fi'
                  ? 'Reaaliaikainen saatavuuden hallinta (Ainesosa loppu / Loppuunmyyty)'
                  : 'Real-Time Availability Management (Ingredient Missing / Sold Out)'}
              </h3>
              <p className={`text-xs mt-0.5 max-w-2xl leading-relaxed ${
                isDark ? 'text-amber-300/80' : 'text-amber-900/80'
              }`}>
                {language === 'fi'
                  ? 'Kun jokin raaka-aine loppuu keittiöstä, klikkaa kyseisen annoksen kytkintä alta. Asiakkaat näkevät ruokalistalla heti "Tilapäisesti loppu" -huomion, jolloin he eivät saavu paikalle pettyneinä.'
                  : 'If an ingredient runs out in the kitchen, click the toggle below. Customers immediately see a "Temporarily Sold Out" badge so expectations are managed perfectly.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                availabilityFilter === 'all'
                  ? 'bg-brand-gold text-brand-blue border-brand-gold'
                  : (isDark
                      ? 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-500'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100 shadow-2xs')
              }`}
            >
              {language === 'fi' ? 'Kaikki annokset' : 'All'}
            </button>
            <button
              onClick={() => setAvailabilityFilter('soldout')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                availabilityFilter === 'soldout'
                  ? 'bg-amber-500 text-amber-950 border-amber-400 font-bold'
                  : (isDark
                      ? 'bg-stone-900 text-amber-300 border-amber-800/60 hover:bg-stone-800'
                      : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50 shadow-2xs')
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{language === 'fi' ? `Vain loppuneet (${soldOutCount})` : `Sold out only (${soldOutCount})`}</span>
            </button>
          </div>
        </div>

        {/* SEARCH & CATEGORY FILTERS */}
        <div className={`border p-4 rounded-2xl space-y-3 transition-colors ${
          isDark
            ? 'bg-stone-900/90 border-stone-800'
            : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'fi'
                    ? 'Etsi annosta nimellä, kuvauksella tai kategorialla...'
                    : 'Search dish by name, description or category...'
                }
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all ${
                  isDark
                    ? 'bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-500 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                    : 'bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="w-full md:w-56 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm outline-none cursor-pointer ${
                  isDark
                    ? 'bg-stone-950 border border-stone-800 text-stone-200 focus:border-brand-gold'
                    : 'bg-stone-50 border border-stone-300 text-stone-900 focus:border-brand-blue'
                }`}
              >
                <option value="all">{language === 'fi' ? 'Kaikki kategoriat' : 'All Categories'}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name[language]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* DISHES LIST / GRID */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between text-xs px-1 ${
            isDark ? 'text-stone-400' : 'text-stone-600'
          }`}>
            <span>
              {language === 'fi'
                ? `Näytetään ${displayedItems.length} / ${totalCount} annosta`
                : `Showing ${displayedItems.length} of ${totalCount} dishes`}
            </span>
            {availabilityFilter !== 'all' && (
              <button
                onClick={() => setAvailabilityFilter('all')}
                className="text-brand-gold hover:underline cursor-pointer font-bold"
              >
                {language === 'fi' ? 'Palauta kaikki näkyviin' : 'Show all'}
              </button>
            )}
          </div>

          {displayedItems.length === 0 ? (
            <div className={`border rounded-2xl p-12 text-center space-y-3 transition-colors ${
              isDark
                ? 'bg-stone-900/50 border-stone-800 text-stone-400'
                : 'bg-white border-stone-200 text-stone-500 shadow-xs'
            }`}>
              <Utensils className={`w-10 h-10 mx-auto ${isDark ? 'text-stone-600' : 'text-stone-400'}`} />
              <p className={`font-serif text-base ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                {language === 'fi' ? 'Ei annoksia hakuehdoilla' : 'No items found matching criteria'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setAvailabilityFilter('all');
                }}
                className={`px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
              >
                {language === 'fi' ? 'Tyhjennä suodattimet' : 'Clear filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {displayedItems.map((dish) => {
                const isAvailable = dish.isAvailable !== false;
                const categoryObj = categories.find((c) => c.id === dish.category);
                const itemIndex = menuItems.findIndex((m) => m.id === dish.id) + 1;

                return (
                  <div
                    key={dish.id}
                    className={`border rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isDark
                        ? (isAvailable
                            ? 'bg-stone-900/90 border-stone-800 hover:border-stone-700'
                            : 'border-amber-700/60 bg-amber-950/20 shadow-inner')
                        : (isAvailable
                            ? 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                            : 'border-amber-300 bg-amber-50/70 shadow-2xs')
                    }`}
                  >
                    {/* Left: Image & Details */}
                    <div className="flex items-start sm:items-center space-x-3.5 min-w-0 flex-1">
                      {/* Thumbnail with overlay status */}
                      <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border shrink-0 ${
                        isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'
                      }`}>
                        <img
                          src={dish.imageUrl}
                          alt={dish.name[language]}
                          className={`w-full h-full object-cover transition-opacity ${
                            isAvailable ? 'opacity-100' : 'opacity-40 grayscale'
                          }`}
                          loading="lazy"
                        />
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 text-center">
                            <span className="text-[9px] font-bold text-amber-400 leading-tight uppercase font-mono">
                              {language === 'fi' ? 'Loppu' : 'Sold Out'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="font-mono text-[11px] font-bold text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded border border-brand-gold/30">
                            #{itemIndex}
                          </span>
                          <h3 className={`font-serif font-bold text-sm sm:text-base truncate ${
                            isDark ? 'text-white' : 'text-stone-900'
                          }`}>
                            {dish.name[language]}
                          </h3>
                          <span className={`text-xs font-mono font-bold ${
                            isDark ? 'text-amber-300' : 'text-amber-800'
                          }`}>
                            {dish.price.toFixed(2)} €
                          </span>
                        </div>

                        <p className={`text-xs line-clamp-1 ${
                          isDark ? 'text-stone-400' : 'text-stone-600'
                        }`}>
                          {dish.description[language]}
                        </p>

                        <div className="flex items-center space-x-2 flex-wrap gap-y-1 text-[10px]">
                          <span className={`px-2 py-0.5 rounded-full border ${
                            isDark
                              ? 'bg-stone-800 text-stone-300 border-stone-700'
                              : 'bg-stone-100 text-stone-700 border-stone-200'
                          }`}>
                            {categoryObj ? categoryObj.name[language] : dish.category}
                          </span>
                          {dish.allergens && dish.allergens.length > 0 && (
                            <span className={isDark ? 'text-stone-400' : 'text-stone-500'}>
                              {dish.allergens.join(', ')}
                            </span>
                          )}
                          {!isAvailable && dish.unavailableReason && (
                            <span className="text-amber-600 dark:text-amber-400 font-serif italic">
                              "{dish.unavailableReason[language]}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Availability Toggle & Action Buttons */}
                    <div className={`flex items-center justify-between sm:justify-end space-x-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 shrink-0 ${
                      isDark ? 'border-stone-800/80' : 'border-stone-200'
                    }`}>
                      {/* 1-Click Availability Switch */}
                      <button
                        onClick={() => {
                          toggleItemAvailability(dish.id, !isAvailable);
                          showToast(
                            isAvailable
                              ? (language === 'fi'
                                  ? `"${dish.name[language]}" merkitty tilapäisesti loppuneeksi.`
                                  : `"${dish.name[language]}" marked as sold out.`)
                              : (language === 'fi'
                                  ? `"${dish.name[language]}" merkitty jälleen saataville!`
                                  : `"${dish.name[language]}" restored to available!`)
                          );
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-2xs border ${
                          isAvailable
                            ? (isDark
                                ? 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-700/60'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300')
                            : 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-300 font-extrabold ring-2 ring-amber-500/30'
                        }`}
                        title={
                          isAvailable
                            ? (language === 'fi' ? 'Klikkaa merkitäksesi ainesosa loppuneeksi' : 'Click to mark as sold out')
                            : (language === 'fi' ? 'Klikkaa palauttaaksesi ruoka saataville' : 'Click to restore availability')
                        }
                      >
                        {isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{language === 'fi' ? 'Saatavilla' : 'Available'}</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-stone-950" />
                            <span>{language === 'fi' ? 'TILAPÄISESTI LOPPU' : 'SOLD OUT'}</span>
                          </>
                        )}
                      </button>

                      {/* Edit Details */}
                      <button
                        onClick={() => {
                          setEditingDish(dish);
                          setIsDishModalOpen(true);
                        }}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer shadow-2xs ${
                          isDark
                            ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border-stone-700'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                        }`}
                        title={language === 'fi' ? 'Muokkaa tietoja ja kuvaa' : 'Edit info and photo'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          const conf = window.confirm(
                            language === 'fi'
                              ? `Haluatko varmasti poistaa annoksen "${dish.name[language]}"?`
                              : `Are you sure you want to delete "${dish.name[language]}"?`
                          );
                          if (conf) {
                            deleteMenuItem(dish.id);
                            showToast(
                              language === 'fi'
                                ? `Annos "${dish.name[language]}" poistettu.`
                                : `Dish deleted.`
                            );
                          }
                        }}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer shadow-2xs ${
                          isDark
                            ? 'bg-stone-800 hover:bg-red-950 text-stone-400 hover:text-red-400 border-stone-700 hover:border-red-800/60'
                            : 'bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-600 border-stone-300 hover:border-red-300'
                        }`}
                        title={language === 'fi' ? 'Poista annos' : 'Delete dish'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BACKUP & RESTORE SECTION */}
        <div className={`border rounded-2xl p-5 space-y-4 transition-colors ${
          isDark
            ? 'bg-stone-900/60 border-stone-800'
            : 'bg-white border-stone-200 shadow-xs'
        }`}>
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-brand-gold" />
            <h3 className={`font-serif font-bold text-sm ${
              isDark ? 'text-stone-200' : 'text-stone-900'
            }`}>
              {language === 'fi' ? 'Tietokannan varmuuskopiointi & palautus' : 'Database Backup & Restore'}
            </h3>
          </div>
          <p className={`text-xs leading-relaxed ${
            isDark ? 'text-stone-400' : 'text-stone-600'
          }`}>
            {language === 'fi'
              ? 'Kaikki tekemäsi muutokset tallentuvat automaattisesti selaimeen. Voit ladata ruokalistasta JSON-tiedoston varmuuskopioksi tai palauttaa oletusruokalistan.'
              : 'All your changes are saved automatically. You can download a JSON backup or restore default menu items.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                const jsonStr = exportMenuJson();
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `kolme_kruunua_ruokalista_${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast(
                  language === 'fi'
                    ? 'Ruokalistan JSON-varmuuskopio ladattu.'
                    : 'Menu JSON backup downloaded.'
                );
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer shadow-2xs ${
                isDark
                  ? 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200'
                  : 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-brand-gold" />
              <span>{language === 'fi' ? 'Lataa JSON-varmuuskopio' : 'Export JSON Backup'}</span>
            </button>

            <label className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer shadow-2xs ${
              isDark
                ? 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200'
                : 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800'
            }`}>
              <Upload className="w-3.5 h-3.5 text-brand-gold" />
              <span>{language === 'fi' ? 'Tuo JSON-tiedostosta' : 'Import from JSON'}</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const text = ev.target?.result as string;
                    if (text) {
                      const res = importMenuJson(text);
                      if (res.success) {
                        showToast(
                          language === 'fi'
                            ? 'Ruokalista tuotu onnistuneesti!'
                            : 'Menu imported successfully!'
                        );
                      } else {
                        alert(res.message || (language === 'fi' ? 'Tiedoston tuonti epäonnistui.' : 'Failed to import file.'));
                      }
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>

            <button
              onClick={() => {
                const conf = window.confirm(
                  language === 'fi'
                    ? 'Haluatko varmasti palauttaa alkuperäisen Kolme Kruunua -oletusruokalistan? Tämä kumoaa omat muokkaukset.'
                    : 'Restore factory default menu? This will overwrite custom changes.'
                );
                if (conf) {
                  resetToDefaultMenu();
                  showToast(
                    language === 'fi'
                      ? 'Oletusruokalista palautettu!'
                      : 'Factory default menu restored!'
                  );
                }
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer ml-auto shadow-2xs ${
                isDark
                  ? 'bg-red-950/40 hover:bg-red-900/60 border-red-800/40 text-red-300'
                  : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'fi' ? 'Palauta oletusmenu' : 'Reset to Default'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* DISH EDIT / ADD MODAL */}
      {isDishModalOpen && (
        <DishEditModal
          isOpen={isDishModalOpen}
          theme={theme}
          onClose={() => {
            setIsDishModalOpen(false);
            setEditingDish(null);
          }}
          onSave={(dish) => {
            if (editingDish) {
              updateMenuItem(dish);
              showToast(
                language === 'fi'
                  ? `Annos "${dish.name[language]}" päivitetty!`
                  : `Dish updated!`
              );
            } else {
              addMenuItem(dish);
              showToast(
                language === 'fi'
                  ? `Uusi annos "${dish.name[language]}" lisätty!`
                  : `New dish created!`
              );
            }
            setIsDishModalOpen(false);
            setEditingDish(null);
          }}
          dishToEdit={editingDish}
          categories={categories}
          language={language}
        />
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md border rounded-3xl p-6 space-y-4 shadow-2xl transition-colors ${
            isDark
              ? 'bg-stone-900 border-stone-700 text-white'
              : 'bg-white border-stone-200 text-stone-900'
          }`}>
            <div className="flex items-center space-x-2 text-brand-gold">
              <Key className="w-5 h-5" />
              <h3 className={`font-serif font-bold text-lg ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}>
                {language === 'fi' ? 'Vaihda henkilökunnan salasana' : 'Change Staff Password'}
              </h3>
            </div>
            <p className={`text-xs leading-relaxed ${
              isDark ? 'text-stone-400' : 'text-stone-600'
            }`}>
              {language === 'fi'
                ? 'Aseta uusi salasana tai PIN-koodi, jota henkilökunta käyttää hallintapaneeliin kirjautumiseen.'
                : 'Set a new password or PIN for staff to access the admin portal.'}
            </p>

            {passwordChangeSuccess ? (
              <div className="bg-emerald-950 border border-emerald-700 text-emerald-300 p-3 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'fi' ? 'Salasana vaihdettu onnistuneesti!' : 'Password updated!'}</span>
              </div>
            ) : (
              <form onSubmit={handleSavePassword} className="space-y-4">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={language === 'fi' ? 'Kirjoita uusi salasana...' : 'Enter new password...'}
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                    isDark
                      ? 'bg-stone-950 border border-stone-700 text-white focus:border-brand-gold'
                      : 'bg-stone-50 border border-stone-300 text-stone-900 focus:border-brand-blue'
                  }`}
                  autoFocus
                />
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordModalOpen(false);
                      setNewPassword('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold uppercase cursor-pointer transition-colors ${
                      isDark
                        ? 'border-stone-700 hover:bg-stone-800 text-stone-300'
                        : 'border-stone-300 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    {language === 'fi' ? 'Peruuta' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={!newPassword.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-brand-blue text-xs font-serif font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {language === 'fi' ? 'Tallenna' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
