import React, { useState, useRef } from 'react';
import { MenuItem, Category, AllergenKey, Translation, PriceOption } from '../types';
import { ALLERGENS } from '../data/menuData';
import { X, Upload, Image as ImageIcon, Plus, Trash2, Check, AlertCircle, Sparkles, Eye } from 'lucide-react';

interface DishEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dish: MenuItem) => void;
  dishToEdit?: MenuItem | null;
  categories: Category[];
  language: 'fi' | 'en';
  theme?: 'dark' | 'light';
}

// Curated high quality presets matching Finnish restaurant cuisine for easy 1-click selection
const PRESET_FOOD_IMAGES = [
  {
    name: 'Kermainen Lohikeitto',
    url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Lihapullat & Muusi',
    url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Paistettu Siika / Kuha',
    url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Poronkäristys & Puolukat',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Klassinen Pippuripihvi',
    url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Toast Skagen',
    url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vadelmasorbetti / Jälkiruoka',
    url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Köyhät Ritarit / Letut',
    url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Punaviini / Valkoviini',
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
  },
];

const COMMON_UNAVAILABLE_REASONS = [
  { fi: 'Pääraaka-aine tilapäisesti loppu', en: 'Main ingredient temporarily out of stock' },
  { fi: 'Valmistuserä myyty loppuun tältä illalta', en: 'Batch sold out for tonight' },
  { fi: 'Tuore kala loppu kalastajalta', en: 'Fresh catch sold out from fisher' },
  { fi: 'Kausituote hetkellisesti saatamattomissa', en: 'Seasonal item momentarily unavailable' },
];

export default function DishEditModal({
  isOpen,
  onClose,
  onSave,
  dishToEdit,
  categories,
  language,
  theme = 'dark',
}: DishEditModalProps) {
  const isDark = theme === 'dark';
  const isEditing = Boolean(dishToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [nameFi, setNameFi] = useState(dishToEdit?.name.fi || '');
  const [nameEn, setNameEn] = useState(dishToEdit?.name.en || '');
  const [descriptionFi, setDescriptionFi] = useState(dishToEdit?.description.fi || '');
  const [descriptionEn, setDescriptionEn] = useState(dishToEdit?.description.en || '');
  const [category, setCategory] = useState(dishToEdit?.category || categories[0]?.id || 'paarualliset');
  const [price, setPrice] = useState<string>(dishToEdit ? dishToEdit.price.toString() : '18.50');
  const [imageUrl, setImageUrl] = useState(
    dishToEdit?.imageUrl || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80'
  );
  const [allergens, setAllergens] = useState<AllergenKey[]>(dishToEdit?.allergens || ['L']);
  const [isAvailable, setIsAvailable] = useState<boolean>(dishToEdit?.isAvailable !== false);
  const [unavailableReasonFi, setUnavailableReasonFi] = useState(
    dishToEdit?.unavailableReason?.fi || 'Pääraaka-aine tilapäisesti loppu tältä päivältä'
  );
  const [unavailableReasonEn, setUnavailableReasonEn] = useState(
    dishToEdit?.unavailableReason?.en || 'Main ingredient sold out for today'
  );
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>(dishToEdit?.priceOptions || []);
  const [activeTab, setActiveTab] = useState<'details' | 'image' | 'allergens' | 'availability'>('details');
  const [showPresets, setShowPresets] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setImageUrl(event.target.result);
          setPreviewError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAllergenKey = (key: AllergenKey) => {
    setAllergens((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleAddPriceOption = () => {
    setPriceOptions((prev) => [
      ...prev,
      {
        label: { fi: 'Pieni', en: 'Small' },
        value: Number(price) > 0 ? Number((Number(price) * 0.8).toFixed(2)) : 10.0,
      },
    ]);
  };

  const handleRemovePriceOption = (index: number) => {
    setPriceOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdatePriceOption = (
    index: number,
    field: 'labelFi' | 'labelEn' | 'value',
    val: string
  ) => {
    setPriceOptions((prev) =>
      prev.map((opt, i) => {
        if (i !== index) return opt;
        if (field === 'labelFi') {
          return { ...opt, label: { ...opt.label, fi: val } };
        }
        if (field === 'labelEn') {
          return { ...opt, label: { ...opt.label, en: val } };
        }
        return { ...opt, value: parseFloat(val) || 0 };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameFi.trim()) {
      alert(language === 'fi' ? 'Syötä annokselle suomenkielinen nimi.' : 'Please provide a Finnish dish name.');
      return;
    }

    const numericPrice = parseFloat(price.replace(',', '.')) || 0;
    const generatedId =
      dishToEdit?.id ||
      `custom-${nameFi.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

    const newDish: MenuItem = {
      id: generatedId,
      name: {
        fi: nameFi.trim(),
        en: nameEn.trim() || nameFi.trim(),
      },
      description: {
        fi: descriptionFi.trim() || 'Herkullinen ravintolan klassikkoannos.',
        en: descriptionEn.trim() || descriptionFi.trim() || 'Delicious restaurant classic dish.',
      },
      category,
      price: numericPrice,
      priceOptions: priceOptions.length > 0 ? priceOptions : undefined,
      imageUrl: imageUrl.trim(),
      allergens,
      isAvailable,
      unavailableReason: isAvailable
        ? undefined
        : {
            fi: unavailableReasonFi.trim() || 'Tilapäisesti loppu',
            en: unavailableReasonEn.trim() || 'Temporarily sold out',
          },
      arModelUrl: dishToEdit?.arModelUrl,
      arModelUsdzUrl: dishToEdit?.arModelUsdzUrl,
    };

    onSave(newDish);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div
        className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans border transition-colors ${
          isDark
            ? 'bg-stone-900 border-stone-700 text-stone-100'
            : 'bg-white border-brand-gold/30 text-stone-900'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-brand-blue text-white px-6 py-4 flex items-center justify-between border-b border-brand-gold/30 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold block">
              {language === 'fi' ? 'Ruokalistan hallinta' : 'Menu Management'}
            </span>
            <h2 className="font-serif font-bold text-lg md:text-xl">
              {isEditing
                ? (language === 'fi' ? `Muokkaa annosta: ${dishToEdit?.name[language]}` : `Edit dish: ${dishToEdit?.name[language]}`)
                : (language === 'fi' ? 'Lisää uusi ruoka tai juoma' : 'Add New Dish or Beverage')}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex border-b text-xs font-semibold px-4 overflow-x-auto shrink-0 transition-colors ${
            isDark ? 'border-stone-800 bg-stone-950/80 text-stone-400' : 'border-gray-200 bg-gray-50/90 text-gray-500'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'details'
                ? isDark
                  ? 'border-brand-gold text-brand-gold font-bold'
                  : 'border-brand-blue text-brand-blue font-bold'
                : isDark
                ? 'border-transparent text-stone-400 hover:text-stone-200'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            1. {language === 'fi' ? 'Perustiedot & Hinta' : 'Details & Price'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'image'
                ? isDark
                  ? 'border-brand-gold text-brand-gold font-bold'
                  : 'border-brand-blue text-brand-blue font-bold'
                : isDark
                ? 'border-transparent text-stone-400 hover:text-stone-200'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>2. {language === 'fi' ? 'Kuva' : 'Image'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('allergens')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'allergens'
                ? isDark
                  ? 'border-brand-gold text-brand-gold font-bold'
                  : 'border-brand-blue text-brand-blue font-bold'
                : isDark
                ? 'border-transparent text-stone-400 hover:text-stone-200'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            3. {language === 'fi' ? 'Allergeenit & Ruokavaliot' : 'Allergens & Diets'} ({allergens.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('availability')}
            className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'availability'
                ? isDark
                  ? 'border-brand-gold text-brand-gold font-bold'
                  : 'border-brand-blue text-brand-blue font-bold'
                : isDark
                ? 'border-transparent text-stone-400 hover:text-stone-200'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            } ${!isAvailable ? (isDark ? 'text-amber-400 font-bold' : 'text-amber-700 font-bold') : ''}`}
          >
            <AlertCircle className={`w-3.5 h-3.5 ${!isAvailable ? (isDark ? 'text-amber-400' : 'text-amber-600') : ''}`} />
            <span>4. {language === 'fi' ? 'Saatavuus' : 'Availability'} {!isAvailable && '(Loppu)'}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-6">
          
          {/* TAB 1: DETAILS & PRICE */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                    {language === 'fi' ? 'Annoksen nimi (Suomi) *' : 'Dish Name (Finnish) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={nameFi}
                    onChange={(e) => setNameFi(e.target.value)}
                    placeholder="esim. Kolmen Kruunun Lihapullat"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-colors ${
                      isDark
                        ? 'bg-stone-950 border-stone-700 text-white placeholder-stone-500 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                    {language === 'fi' ? 'Nimi (Englanti)' : 'Dish Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Traditional Meatballs"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm transition-colors ${
                      isDark
                        ? 'bg-stone-950 border-stone-700 text-white placeholder-stone-500 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                    {language === 'fi' ? 'Kategoria *' : 'Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-stone-950 border-stone-700 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                    }`}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name[language]} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                    {language === 'fi' ? 'Perushinta (€) *' : 'Base Price (€) *'}
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-sm font-semibold transition-colors ${
                      isDark
                        ? 'bg-stone-950 border-stone-700 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                    }`}
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                    {language === 'fi' ? 'Kuvaus (Suomi)' : 'Description (Finnish)'}
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionFi}
                    onChange={(e) => setDescriptionFi(e.target.value)}
                    placeholder="Kuvaile raaka-aineet, valmistustapa ja lisukkeet..."
                    className={`w-full px-3.5 py-2 rounded-xl border outline-none text-xs leading-relaxed transition-colors ${
                      isDark
                        ? 'bg-stone-950 border-stone-700 text-white placeholder-stone-500 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                    {language === 'fi' ? 'Kuvaus (Englanti)' : 'Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Describe the ingredients, presentation, and sides..."
                    className={`w-full px-3.5 py-2 rounded-xl border outline-none text-xs leading-relaxed transition-colors ${
                      isDark
                        ? 'bg-stone-950 border-stone-700 text-white placeholder-stone-500 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                    }`}
                  />
                </div>
              </div>

              {/* Price Options (Sizes, Glass/Bottle, etc.) */}
              <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${isDark ? 'bg-stone-950/70 border-stone-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-stone-200' : 'text-gray-800'}`}>
                      {language === 'fi' ? 'Koko- ja hintavaihtoehdot (Valinnainen)' : 'Portion / Size Options (Optional)'}
                    </h4>
                    <p className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-gray-500'}`}>
                      {language === 'fi'
                        ? 'Esim. viineille (12 cl, 16 cl, pullo) tai annoskoolle (Pieni, Iso)'
                        : 'e.g. wine measures (12 cl, 16 cl, bottle) or portion sizes'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPriceOption}
                    className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-brand-blue/90 flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'fi' ? 'Lisää vaihtoehto' : 'Add Option'}</span>
                  </button>
                </div>

                {priceOptions.map((opt, idx) => (
                  <div key={idx} className={`flex items-center space-x-2 p-2 rounded-xl border text-xs transition-colors ${isDark ? 'bg-stone-900 border-stone-700' : 'bg-white border-gray-200'}`}>
                    <input
                      type="text"
                      placeholder="Nimi (FI)"
                      value={opt.label.fi}
                      onChange={(e) => handleUpdatePriceOption(idx, 'labelFi', e.target.value)}
                      className={`w-1/3 px-2 py-1.5 border rounded-lg transition-colors ${isDark ? 'bg-stone-950 border-stone-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                    <input
                      type="text"
                      placeholder="Name (EN)"
                      value={opt.label.en}
                      onChange={(e) => handleUpdatePriceOption(idx, 'labelEn', e.target.value)}
                      className={`w-1/3 px-2 py-1.5 border rounded-lg transition-colors ${isDark ? 'bg-stone-950 border-stone-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                    <div className="flex items-center space-x-1 w-1/4">
                      <input
                        type="number"
                        step="0.10"
                        value={opt.value}
                        onChange={(e) => handleUpdatePriceOption(idx, 'value', e.target.value)}
                        className={`w-full px-2 py-1.5 border rounded-lg font-semibold transition-colors ${isDark ? 'bg-stone-950 border-stone-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                      <span className={isDark ? 'text-stone-400' : 'text-gray-500'}>€</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePriceOption(idx)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: IMAGE */}
          {activeTab === 'image' && (
            <div className="space-y-5">
              {/* Preview Box */}
              <div className={`flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl border transition-colors ${isDark ? 'bg-stone-950/70 border-stone-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="w-44 h-32 rounded-2xl overflow-hidden bg-black/10 border border-brand-gold/30 shrink-0 relative shadow-sm">
                  {!previewError && imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center text-xs p-2 text-center ${isDark ? 'text-stone-500' : 'text-gray-400'}`}>
                      <ImageIcon className={`w-6 h-6 mb-1 ${isDark ? 'text-stone-500' : 'text-gray-400'}`} />
                      <span>{language === 'fi' ? 'Ei kuvaa tai virheellinen osoite' : 'No image / broken URL'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1 w-full text-xs">
                  <span className={`font-bold uppercase tracking-wider block ${isDark ? 'text-stone-200' : 'text-gray-800'}`}>
                    {language === 'fi' ? 'Kuvan esikatselu annoskortissa' : 'Image Preview'}
                  </span>
                  <p className={`leading-relaxed ${isDark ? 'text-stone-400' : 'text-gray-500'}`}>
                    {language === 'fi'
                      ? 'Voit syöttää suoran kuvalinkin, valita valmiista kuvagalleriasta tai ladata uuden kuvan puhelimeltasi tai tietokoneeltasi ilman koodia.'
                      : 'Provide a direct link, choose from restaurant photo presets, or upload directly from your device.'}
                  </p>

                  <div className="pt-1 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-brand-blue text-white rounded-xl font-semibold flex items-center space-x-2 hover:bg-brand-blue/90 shadow-sm cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{language === 'fi' ? 'Lataa laitteelta / kamerasta' : 'Upload from Device'}</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPresets(!showPresets)}
                      className={`px-3.5 py-2 border rounded-xl font-semibold flex items-center space-x-1.5 cursor-pointer shadow-2xs transition-colors ${
                        isDark
                          ? 'bg-stone-900 text-brand-gold border-brand-gold/40 hover:bg-stone-800'
                          : 'bg-white text-brand-blue border-brand-gold/40 hover:bg-brand-gold/10'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{showPresets ? (language === 'fi' ? 'Piilota galleria' : 'Hide presets') : (language === 'fi' ? 'Valitse valmiista kuvista' : 'Pick from presets')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-1">
                <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                  {language === 'fi' ? 'Kuvan URL-osoite' : 'Image URL'}
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewError(false);
                  }}
                  placeholder="https://..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none text-xs font-mono transition-colors ${
                    isDark
                      ? 'bg-stone-950 border-stone-700 text-white placeholder-stone-500 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                  }`}
                />
              </div>

              {/* Preset Gallery */}
              {showPresets && (
                <div className={`space-y-2 pt-2 border-t transition-colors ${isDark ? 'border-stone-800' : 'border-gray-200'}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                    {language === 'fi' ? 'Klikkaa valitaksesi kuva:' : 'Click to select an image:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                    {PRESET_FOOD_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setImageUrl(preset.url);
                          setPreviewError(false);
                        }}
                        className={`text-left p-1.5 rounded-xl border transition-all cursor-pointer relative group ${
                          imageUrl === preset.url
                            ? isDark
                              ? 'border-brand-gold ring-2 ring-brand-gold/30 bg-amber-950/40'
                              : 'border-brand-blue ring-2 ring-brand-blue/30 bg-blue-50/50'
                            : isDark
                            ? 'border-stone-800 hover:border-stone-700 bg-stone-900'
                            : 'border-gray-200 hover:border-brand-gold/60 bg-white'
                        }`}
                      >
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/5 mb-1.5">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className={`text-[11px] font-medium line-clamp-1 block ${isDark ? 'text-stone-200' : 'text-gray-800'}`}>
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ALLERGENS & DIETS */}
          {activeTab === 'allergens' && (
            <div className="space-y-4">
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-stone-200' : 'text-gray-800'}`}>
                  {language === 'fi' ? 'Erityisruokavaliot & Allergeenimerkinnät' : 'Dietary Markings & Allergens'}
                </h4>
                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-stone-400' : 'text-gray-500'}`}>
                  {language === 'fi'
                    ? 'Valitse mitkä merkinnät näytetään asiakkaalle annoskortissa ja suodattimissa.'
                    : 'Select the badges that apply to this dish for display and filtering.'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto p-1">
                {Object.values(ALLERGENS).map((allergen) => {
                  const isChecked = allergens.includes(allergen.key);
                  return (
                    <button
                      type="button"
                      key={allergen.key}
                      onClick={() => toggleAllergenKey(allergen.key)}
                      className={`text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? isDark
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold shadow-2xs'
                            : 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                          : isDark
                          ? 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${isDark ? 'bg-stone-800 text-stone-300' : 'bg-black/5 text-stone-800'}`}>
                          {allergen.key}
                        </span>
                        <span className="truncate">{allergen.name[language]}</span>
                      </div>
                      {isChecked && <Check className={`w-4 h-4 shrink-0 ml-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: AVAILABILITY (OUT OF STOCK TOGGLE) */}
          {activeTab === 'availability' && (
            <div className="space-y-5">
              {/* Prominent switch */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isAvailable
                    ? isDark
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                      : 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : isDark
                    ? 'bg-amber-950/30 border-amber-800/60 text-amber-200 shadow-sm'
                    : 'bg-amber-50 border-amber-300 text-amber-950 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      {language === 'fi' ? 'Annoksen reaaliaikainen saatavuus' : 'Live Dish Availability'}
                    </span>
                    <p className="text-xs leading-relaxed opacity-90">
                      {isAvailable
                        ? (language === 'fi' ? '🟢 Annos on tilattavissa ja saatavilla normaalisti.' : '🟢 Dish is in stock and available to order.')
                        : (language === 'fi' ? '🔴 Annos on merkitty loppuneeksi. Asiakkaat näkevät heti selkeän ilmoituksen eivätkä voi tilata sitä.' : '🔴 Marked as sold out. Customers see an immediate badge and cannot order.')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors cursor-pointer shrink-0 ml-4 focus:outline-none ring-2 ring-offset-2 ${
                      isAvailable ? 'bg-emerald-600 ring-emerald-500' : 'bg-amber-600 ring-amber-500'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                        isAvailable ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* If marked sold out, explanation fields */}
              {!isAvailable && (
                <div className={`space-y-4 p-4 rounded-2xl border transition-colors ${isDark ? 'bg-amber-950/20 border-amber-800/50' : 'bg-amber-50/50 border-amber-200'}`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                      {language === 'fi' ? 'Syy saatavuuskatkolle (Näytetään asiakkaalle)' : 'Shortage Reason (Shown to customers)'}
                    </h4>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-amber-400/80' : 'text-amber-800/80'}`}>
                      {language === 'fi'
                        ? 'Selkeä syy estää pettymyksiä ja antaa ammattimaisen kuvan asiakkaille.'
                        : 'A clear reason prevents misunderstandings and maintains trust.'}
                    </p>
                  </div>

                  {/* Preset Quick Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {COMMON_UNAVAILABLE_REASONS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setUnavailableReasonFi(preset.fi);
                          setUnavailableReasonEn(preset.en);
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer shadow-2xs ${
                          isDark
                            ? 'bg-stone-900 border-amber-700/50 text-amber-200 hover:bg-amber-950/60'
                            : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-100'
                        }`}
                      >
                        {preset[language]}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                        {language === 'fi' ? 'Ilmoitus suomeksi' : 'Notice (Finnish)'}
                      </label>
                      <input
                        type="text"
                        value={unavailableReasonFi}
                        onChange={(e) => setUnavailableReasonFi(e.target.value)}
                        placeholder="esim. Pääraaka-aine loppu tältä illalta"
                        className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:ring-2 ${
                          isDark
                            ? 'border-amber-800/60 bg-stone-950 text-stone-200 focus:ring-amber-500'
                            : 'border-amber-300 bg-white text-gray-900 focus:ring-amber-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-stone-300' : 'text-gray-700'}`}>
                        {language === 'fi' ? 'Ilmoitus englanniksi' : 'Notice (English)'}
                      </label>
                      <input
                        type="text"
                        value={unavailableReasonEn}
                        onChange={(e) => setUnavailableReasonEn(e.target.value)}
                        placeholder="e.g. Sold out for tonight"
                        className={`w-full px-3 py-2 rounded-xl border text-xs outline-none focus:ring-2 ${
                          isDark
                            ? 'border-amber-800/60 bg-stone-950 text-stone-200 focus:ring-amber-500'
                            : 'border-amber-300 bg-white text-gray-900 focus:ring-amber-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className={`pt-4 border-t flex items-center justify-between transition-colors ${isDark ? 'border-stone-800' : 'border-gray-200'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`py-2.5 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                isDark ? 'border-stone-700 hover:bg-stone-800 text-stone-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'
              }`}
            >
              {language === 'fi' ? 'Peruuta' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
              id="save-dish-btn"
            >
              <Check className="w-4 h-4 text-brand-gold" />
              <span>{isEditing ? (language === 'fi' ? 'Tallenna muutokset' : 'Save Changes') : (language === 'fi' ? 'Lisää ruoka listalle' : 'Add to Menu')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
