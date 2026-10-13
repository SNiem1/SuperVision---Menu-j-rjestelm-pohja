import React, { useState, useMemo } from 'react';
import { MenuItem, Category, Translation } from '../types';
import { useMenu } from '../context/MenuContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import DishEditModal from './DishEditModal';
import {
  X,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  RotateCcw,
  LogOut,
  Utensils,
  Image as ImageIcon,
  Sparkles,
  Download,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { restaurantConfig } from '../config/restaurant';

interface AdminPanelModalProps {
  language: 'fi' | 'en';
}

export default function AdminPanelModal({ language }: AdminPanelModalProps) {
  const { isAdminPanelOpen, setIsAdminPanelOpen, logout } = useAdminAuth();
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'soldout'>('all');
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Metrics
  const totalCount = menuItems.length;
  const soldOutCount = menuItems.filter((i) => i.isAvailable === false).length;
  const availableCount = totalCount - soldOutCount;

  // Filtered dishes in the table
  const displayedItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Availability filter
      if (availabilityFilter === 'available' && item.isAvailable === false) return false;
      if (availabilityFilter === 'soldout' && item.isAvailable !== false) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Search query
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

  if (!isAdminPanelOpen) return null;

  const handleOpenAddModal = () => {
    setEditingDish(null);
    setIsDishModalOpen(true);
  };

  const handleOpenEditModal = (dish: MenuItem) => {
    setEditingDish(dish);
    setIsDishModalOpen(true);
  };

  const handleSaveDish = (dish: MenuItem) => {
    if (editingDish) {
      updateMenuItem(dish);
      showToast(
        language === 'fi'
          ? `Annos "${dish.name.fi}" päivitetty onnistuneesti!`
          : `Dish "${dish.name.en}" updated successfully!`
      );
    } else {
      addMenuItem(dish);
      showToast(
        language === 'fi'
          ? `Uusi annos "${dish.name.fi}" lisätty ruokalistalle!`
          : `New dish "${dish.name.en}" added to menu!`
      );
    }
  };

  const handleDeleteDish = (dish: MenuItem) => {
    const confirmText =
      language === 'fi'
        ? `Haluatko varmasti poistaa annoksen "${dish.name.fi}"?`
        : `Are you sure you want to delete "${dish.name.en}"?`;

    if (window.confirm(confirmText)) {
      deleteMenuItem(dish.id);
      showToast(
        language === 'fi'
          ? `Annos "${dish.name.fi}" poistettu listalta.`
          : `Dish "${dish.name.en}" removed.`
      );
    }
  };

  const handleToggleAvailability = (dish: MenuItem) => {
    const nextAvailable = dish.isAvailable === false;
    toggleItemAvailability(dish.id, nextAvailable);
    showToast(
      nextAvailable
        ? (language === 'fi' ? `"${dish.name.fi}" merkitty saataville!` : `"${dish.name.en}" marked back in stock!`)
        : (language === 'fi' ? `"${dish.name.fi}" merkitty tilapäisesti loppuneeksi!` : `"${dish.name.en}" marked as sold out!`)
    );
  };

  const handleReset = () => {
    const confirmMsg =
      language === 'fi'
        ? 'Haluatko palauttaa alkuperäisen ravintolan ruokalistan? Kaikki omat lisäykset nollataan.'
        : 'Do you want to reset to factory default menu? Custom modifications will be cleared.';

    if (window.confirm(confirmMsg)) {
      resetToDefaultMenu();
      showToast(
        language === 'fi'
          ? 'Ruokalista palautettu oletustilaan!'
          : 'Menu reset to default factory state!'
      );
    }
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportMenuJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kolme_kruunua_menu_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(language === 'fi' ? 'Ruokalista ladattu JSON-tiedostona!' : 'Menu exported as JSON!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-6xl bg-[#faf9f6] rounded-3xl shadow-2xl border border-brand-gold/40 overflow-hidden my-auto max-h-[96vh] flex flex-col font-sans"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-panel-title"
      >
        {/* TOP BAR */}
        <div className="bg-brand-blue text-white px-5 sm:px-8 py-4 flex items-center justify-between border-b border-brand-gold/30 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-inner">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                  {restaurantConfig.name} • {language === 'fi' ? 'Ylläpito' : 'Admin'}
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 id="admin-panel-title" className="font-serif font-bold text-lg sm:text-xl tracking-wide">
                {language === 'fi' ? 'Ruokalistan Hallintapaneeli' : 'Digital Menu Admin Panel'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={logout}
              className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title={language === 'fi' ? 'Kirjaudu ulos' : 'Log Out'}
            >
              <LogOut className="w-3.5 h-3.5 text-brand-gold" />
              <span className="hidden sm:inline">{language === 'fi' ? 'Kirjaudu ulos' : 'Log Out'}</span>
            </button>

            <button
              onClick={() => setIsAdminPanelOpen(false)}
              className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOAST NOTIFICATION IF ANY */}
        {actionNotice && (
          <div className="bg-emerald-800 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between border-b border-emerald-700 animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-white/70 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* STATS STRIP */}
        <div className="bg-white border-b border-gray-200 px-5 sm:px-8 py-3.5 shrink-0 grid grid-cols-3 gap-3 sm:gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {language === 'fi' ? 'Yhteensä' : 'Total Dishes'}
            </span>
            <span className="font-serif font-bold text-lg sm:text-xl text-brand-blue">
              {totalCount}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-center sm:justify-start space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>{language === 'fi' ? 'Saatavilla' : 'Available'}</span>
            </span>
            <span className="font-serif font-bold text-lg sm:text-xl text-emerald-800">
              {availableCount}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center justify-center sm:justify-start space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <span>{language === 'fi' ? 'Tilapäisesti loppu' : 'Sold Out'}</span>
            </span>
            <span className="font-serif font-bold text-lg sm:text-xl text-amber-800">
              {soldOutCount}
            </span>
          </div>
        </div>

        {/* CONTROLS HEADER */}
        <div className="p-4 sm:p-6 pb-3 space-y-4 shrink-0 bg-[#faf9f6]">
          {/* Row 1: Search, Filter Tabs & Add Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fi' ? 'Hae annoksen nimellä tai kategorialla...' : 'Search dishes...'}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-xs bg-white shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Availability Segmented Buttons */}
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs text-xs font-semibold">
              <button
                onClick={() => setAvailabilityFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  availabilityFilter === 'all'
                    ? 'bg-brand-blue text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {language === 'fi' ? 'Kaikki' : 'All'} ({totalCount})
              </button>
              <button
                onClick={() => setAvailabilityFilter('soldout')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  availabilityFilter === 'soldout'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{language === 'fi' ? 'Vain loppuneet' : 'Only Sold Out'} ({soldOutCount})</span>
              </button>
              <button
                onClick={() => setAvailabilityFilter('available')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  availabilityFilter === 'available'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {language === 'fi' ? 'Saatavilla' : 'In Stock'} ({availableCount})
              </button>
            </div>

            {/* Add New Dish Primary Button */}
            <button
              onClick={handleOpenAddModal}
              className="py-2.5 px-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer active:scale-95"
              id="admin-add-dish-btn"
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>{language === 'fi' ? 'Lisää uusi ruoka' : 'Add New Dish'}</span>
            </button>
          </div>

          {/* Row 2: Category Filter Horizontal Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-brand-gold/20 text-brand-blue border-brand-gold font-bold shadow-2xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {language === 'fi' ? 'Kaikki kategoriat' : 'All Categories'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-brand-gold/20 text-brand-blue border-brand-gold font-bold shadow-2xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {cat.name[language]}
              </button>
            ))}
          </div>
        </div>

        {/* DISHES LIST / TABLE (SCROLLABLE) */}
        <div className="overflow-y-auto px-4 sm:px-6 pb-6 flex-grow">
          {displayedItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8 space-y-3">
              <Utensils className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-serif font-bold text-gray-700">
                {language === 'fi' ? 'Ei annoksia valituilla hakuehdoilla' : 'No dishes matching criteria'}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {language === 'fi'
                  ? 'Kokeile tyhjentää haku tai vaihtaa suodatinta nähdäksesi ruokalistan annokset.'
                  : 'Clear your search query or reset filters to view all menu dishes.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedItems.map((dish, index) => {
                const isOutOfStock = dish.isAvailable === false;
                const catObj = categories.find((c) => c.id === dish.category);

                return (
                  <div
                    key={dish.id}
                    className={`bg-white rounded-2xl border p-3.5 sm:p-4 transition-all shadow-2xs hover:shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isOutOfStock
                        ? 'border-amber-300 bg-amber-50/30 ring-1 ring-amber-300/60'
                        : 'border-gray-200 hover:border-brand-gold/50'
                    }`}
                    id={`admin-dish-row-${dish.id}`}
                  >
                    {/* Left info */}
                    <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                      {/* Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-black/5 shrink-0 border border-gray-200 relative">
                        <img
                          src={dish.imageUrl}
                          alt={dish.name[language]}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                          </div>
                        )}
                      </div>

                      {/* Text details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-text bg-brand-gold/10 px-2 py-0.5 rounded-full border border-brand-gold/30">
                            {catObj ? catObj.name[language] : dish.category}
                          </span>
                          {isOutOfStock ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse inline-block" />
                              <span>{language === 'fi' ? 'Tilapäisesti loppu' : 'Sold Out'}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                              {language === 'fi' ? 'Saatavilla' : 'In Stock'}
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif font-bold text-sm sm:text-base text-gray-900 truncate">
                          {dish.name[language]}
                        </h4>

                        <p className="text-xs text-gray-500 line-clamp-1 italic mt-0.5">
                          {dish.description[language]}
                        </p>

                        {/* If sold out, show reason */}
                        {isOutOfStock && dish.unavailableReason && (
                          <p className="text-[11px] font-medium text-amber-800 mt-1 flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{language === 'fi' ? 'Syy:' : 'Reason:'} {dish.unavailableReason[language]}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                      {/* Price display */}
                      <div className="text-left sm:text-right">
                        <span className="font-serif font-extrabold text-sm sm:text-base text-brand-gold-text block">
                          {dish.price.toFixed(2).replace('.', ',')} €
                        </span>
                        {dish.priceOptions && (
                          <span className="text-[10px] text-gray-400 block">
                            +{dish.priceOptions.length} {language === 'fi' ? 'kokoa' : 'sizes'}
                          </span>
                        )}
                      </div>

                      {/* FAST TOGGLE BUTTON - One-click availability switch */}
                      <button
                        onClick={() => handleToggleAvailability(dish)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs active:scale-95 border ${
                          isOutOfStock
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                        title={
                          isOutOfStock
                            ? (language === 'fi' ? 'Klikkaa palauttaaksesi saataville' : 'Click to mark in stock')
                            : (language === 'fi' ? 'Klikkaa merkitäksesi loppuneeksi' : 'Click to mark sold out')
                        }
                        id={`toggle-avail-btn-${dish.id}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOutOfStock ? 'bg-amber-600' : 'bg-emerald-500'
                          }`}
                        />
                        <span>
                          {isOutOfStock
                            ? (language === 'fi' ? 'Merkitse saataville' : 'Back in stock')
                            : (language === 'fi' ? 'Merkitse loppu' : 'Mark sold out')}
                        </span>
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={() => handleOpenEditModal(dish)}
                        className="p-2 rounded-xl text-brand-blue hover:bg-brand-blue/10 border border-brand-gold/30 hover:border-brand-gold transition-colors cursor-pointer"
                        title={language === 'fi' ? 'Muokkaa tietoja ja kuvaa' : 'Edit details & photo'}
                        id={`edit-dish-btn-${dish.id}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteDish(dish)}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-colors cursor-pointer"
                        title={language === 'fi' ? 'Poista annos' : 'Delete dish'}
                        id={`delete-dish-btn-${dish.id}`}
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

        {/* BOTTOM ADVANCED BAR */}
        <div className="bg-white border-t border-gray-200 px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="py-1.5 px-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center space-x-1.5 transition-colors cursor-pointer font-medium"
              title="Vie varmuuskopio ruokalistasta"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>{language === 'fi' ? 'Lataa varmuuskopio (JSON)' : 'Export JSON'}</span>
            </button>

            <button
              onClick={handleReset}
              className="py-1.5 px-3 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 flex items-center space-x-1.5 transition-colors cursor-pointer font-medium"
              title="Palauta alkuperäinen Kolme Kruunua ruokalista"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-500" />
              <span>{language === 'fi' ? 'Palauta oletuslista' : 'Reset Default Menu'}</span>
            </button>
          </div>

          <button
            onClick={() => setIsAdminPanelOpen(false)}
            className="py-2 px-6 rounded-xl bg-brand-blue hover:bg-brand-blue/95 text-white font-serif font-bold uppercase tracking-wider text-xs shadow-sm transition-colors cursor-pointer"
          >
            {language === 'fi' ? 'Sulje hallintapaneeli' : 'Close Admin Panel'}
          </button>
        </div>
      </div>

      {/* DISH EDIT / ADD MODAL */}
      <DishEditModal
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
        onSave={handleSaveDish}
        dishToEdit={editingDish}
        categories={categories}
        language={language}
      />
    </div>
  );
}
