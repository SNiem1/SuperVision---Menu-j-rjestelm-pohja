import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { AllergenKey, OrderItem, MenuItem, DishCustomizationSelection } from './types';
import { CATEGORIES } from './data/menuData';
import { MenuProvider, useMenu } from './context/MenuContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import {
  calculateCustomizationPrice,
  buildCustomizationSummary,
  generateCustomizedOrderItemId,
} from './data/customizations';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import FilterControls from './components/FilterControls';
import MenuItemCard from './components/MenuItemCard';
import AdminPage from './pages/AdminPage';
import { checkForImportedOrderFromUrl } from './lib/orderTransfer';
import { UtensilsCrossed, Clock, MapPin, Phone, Mail, Info, Sparkles, ChevronRight, X, ShoppingBag, Check, Utensils, Star, ShieldCheck } from 'lucide-react';
import { restaurantConfig } from './config/restaurant';

// Lazy-loaded modals for optimal first-paint bundle performance
type LegalTab = 'privacy' | 'terms' | 'cookies';

const OrderModal = lazy(() => import('./components/OrderModal'));
const OrderTransferModal = lazy(() => import('./components/OrderTransferModal'));
const YourFoodsModal = lazy(() => import('./components/YourFoodsModal'));
const LegalModal = lazy(() => import('./components/LegalModal'));
const AllergenLegend = lazy(() => import('./components/AllergenLegend'));
const ARViewerModal = lazy(() => import('./components/ARViewerModal'));
const DishCustomizationModal = lazy(() => import('./components/DishCustomizationModal'));

function useDelayedUnmount(isMounted: boolean, delayMs: number = 250) {
  const [shouldRender, setShouldRender] = useState(isMounted);

  useEffect(() => {
    if (isMounted) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, [isMounted, delayMs]);

  return shouldRender;
}

function ToastNotification({
  notification,
  onClose,
  language,
}: {
  notification: string | null;
  onClose: () => void;
  language: 'fi' | 'en';
}) {
  const [displayMessage, setDisplayMessage] = useState<string | null>(notification);
  const shouldRender = useDelayedUnmount(Boolean(notification), 250);

  useEffect(() => {
    if (notification) {
      setDisplayMessage(notification);
    }
  }, [notification]);

  if (!shouldRender || !displayMessage) return null;

  const isExiting = !notification;

  return (
    <div
      className={`fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-900/95 text-white px-5 py-3.5 sm:py-4 rounded-full shadow-2xl border border-emerald-400/50 backdrop-blur-md flex items-center space-x-3 w-[calc(100%-2rem)] max-w-md ${
        isExiting ? 'animate-toast-exit' : 'animate-toast-enter'
      }`}
    >
      <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/30 flex-shrink-0">
        <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </div>
      <p className="text-xs sm:text-sm font-serif font-bold leading-snug flex-1 text-emerald-50">
        {displayMessage}
      </p>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0 cursor-pointer"
        aria-label={language === 'fi' ? 'Sulje ilmoitus' : 'Close notification'}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function MainAppContent() {
  const { menuItems, categories } = useMenu();
  const { openAdmin } = useAdminAuth();
  const [language, setLanguage] = useState<'fi' | 'en'>('fi');
  const languageRef = React.useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const [activeCategory, setActiveCategory] = useState<string>('alkuruoat');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAllergens, setSelectedAllergens] = useState<AllergenKey[]>([]);
  const [showReviewHint, setShowReviewHint] = useState(() => {
    try {
      return localStorage.getItem('hide_review_hint') !== 'true';
    } catch {
      return true;
    }
  });

  // Order List State (starts empty on fresh app load)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Dish Customization Modal State
  const [customizingItemState, setCustomizingItemState] = useState<{
    dish: MenuItem;
    optionIndex?: number;
    initialSelection?: DishCustomizationSelection;
    isEditingCartItem?: boolean;
    cartItemId?: string;
  } | null>(null);

  // Sync document language attribute, dynamic brand colors, page title and favicon from restaurantConfig
  useEffect(() => {
    document.documentElement.lang = language;

    const root = document.documentElement;
    root.style.setProperty('--color-brand-blue', restaurantConfig.brandColors.blue);
    root.style.setProperty('--color-brand-gold', restaurantConfig.brandColors.gold);
    root.style.setProperty('--color-brand-gold-text', restaurantConfig.brandColors.goldText || '#8a6f28');
    root.style.setProperty('--color-brand-cream', restaurantConfig.brandColors.cream);
    root.style.setProperty('--color-brand-ink', restaurantConfig.brandColors.ink);

    const taglineText = restaurantConfig.tagline[language];
    document.title = `${restaurantConfig.name} | ${taglineText}`;

    const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (faviconLink) {
      faviconLink.href = restaurantConfig.faviconUrl;
    }
  }, [language]);

  // Eaten / Ordered History State ("Sinun ruokasi")
  const [eatenItems, setEatenItems] = useState<(OrderItem & { orderedAt: string })[]>(() => {
    try {
      const saved = localStorage.getItem('restaurant_eaten_items') || localStorage.getItem('kolme_kruunua_eaten_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [transferItems, setTransferItems] = useState<OrderItem[]>([]);
  const [waiterItems, setWaiterItems] = useState<OrderItem[]>([]);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [isYourFoodsModalOpen, setIsYourFoodsModalOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');
  const [isAllergenLegendOpen, setIsAllergenLegendOpen] = useState<boolean>(false);
  const [activeArItem, setActiveArItem] = useState<MenuItem | null>(null);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  const handleOpenLegal = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem('restaurant_eaten_items', JSON.stringify(eatenItems));
    } catch (e) {
      console.warn('Failed to save eaten items to localStorage:', e);
    }
  }, [eatenItems]);

  // Check URL hash for imported order on page load
  useEffect(() => {
    const imported = checkForImportedOrderFromUrl();
    if (imported && imported.length > 0) {
      setOrderItems(imported);
      const itemCount = imported.reduce((sum, item) => sum + item.quantity, 0);
      setImportNotification(
        languageRef.current === 'fi'
          ? `Tilaus siirretty laitteellesi! (${itemCount} tuotetta)`
          : `Order transferred to your device! (${itemCount} items)`
      );
      // Clean URL hash so refreshing doesn't overwrite future edits
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setIsOrderModalOpen(true);

      setTimeout(() => {
        setImportNotification(null);
      }, 5000);
    }
  }, []);

  const { currentRoute, navigateTo, getAdminDirectUrl } = useAdminAuth();

  // Hidden admin access for prototype:
  // 1. URL hash: e.g. typing #admin or #hallinta in browser address
  // 2. Keyboard shortcut: Ctrl + Shift + A or Alt + A
  useEffect(() => {
    const handleAdminHashCheck = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#hallinta' || hash === '#yllapito') {
        navigateTo('admin');
      }
    };

    handleAdminHashCheck();
    window.addEventListener('hashchange', handleAdminHashCheck);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        navigateTo('admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleAdminHashCheck);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateTo]);

  // Triple-click on footer copyright to open admin panel discreetly
  const copyrightClickCounter = React.useRef(0);
  const copyrightTimer = React.useRef<NodeJS.Timeout | null>(null);
  const handleSecretCopyrightClick = () => {
    copyrightClickCounter.current += 1;
    if (copyrightTimer.current) clearTimeout(copyrightTimer.current);
    if (copyrightClickCounter.current >= 3) {
      copyrightClickCounter.current = 0;
      navigateTo('admin');
    } else {
      copyrightTimer.current = setTimeout(() => {
        copyrightClickCounter.current = 0;
      }, 800);
    }
  };

  const handleImportOrder = (newItems: OrderItem[], mode: 'replace' | 'merge') => {
    if (mode === 'replace') {
      setOrderItems(newItems);
    } else {
      setOrderItems((prev) => {
        let merged = [...prev];
        for (const newItem of newItems) {
          const idx = merged.findIndex((item) => item.id === newItem.id);
          if (idx > -1) {
            merged = merged.map((item, i) =>
              i === idx ? { ...item, quantity: item.quantity + newItem.quantity } : item
            );
          } else {
            merged = [...merged, newItem];
          }
        }
        return merged;
      });
    }

    const totalCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
    setImportNotification(
      language === 'fi'
        ? `Tilaus tuotu onnistuneesti! (${totalCount} tuotetta)`
        : `Order imported successfully! (${totalCount} items)`
    );
    setIsOrderModalOpen(true);

    setTimeout(() => {
      setImportNotification(null);
    }, 5000);
  };

  // Add item to order
  const handleAddToOrder = (menuItem: MenuItem, selectedOptionIndex?: number) => {
    const priceOption = menuItem.priceOptions && selectedOptionIndex !== undefined
      ? menuItem.priceOptions[selectedOptionIndex]
      : undefined;

    const price = priceOption ? priceOption.value : menuItem.price;
    const cartItemId = menuItem.priceOptions && selectedOptionIndex !== undefined
      ? `${menuItem.id}-opt-${selectedOptionIndex}`
      : menuItem.id;

    setOrderItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        return prev.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newItem: OrderItem = {
          id: cartItemId,
          menuItemId: menuItem.id,
          name: menuItem.name,
          selectedOptionLabel: priceOption ? priceOption.label : undefined,
          price,
          quantity: 1,
          imageUrl: menuItem.imageUrl,
        };
        return [...prev, newItem];
      }
    });
  };

  // Open customization modal from menu item card
  const handleOpenCustomizer = (menuItem: MenuItem, selectedOptionIndex?: number) => {
    setCustomizingItemState({
      dish: menuItem,
      optionIndex: selectedOptionIndex,
      isEditingCartItem: false,
    });
  };

  // Open customization modal to edit an existing item from the cart
  const handleEditCustomizationFromCart = (orderItem: OrderItem) => {
    const dish = menuItems.find((m) => m.id === orderItem.menuItemId);
    if (!dish) return;

    let optionIndex: number | undefined = undefined;
    if (dish.priceOptions && orderItem.selectedOptionLabel) {
      const idx = dish.priceOptions.findIndex(
        (opt) => opt.label.fi === orderItem.selectedOptionLabel?.fi
      );
      if (idx !== -1) optionIndex = idx;
    }

    setCustomizingItemState({
      dish,
      optionIndex,
      initialSelection: orderItem.customizationSelection,
      isEditingCartItem: true,
      cartItemId: orderItem.id,
    });
  };

  // Save customization from modal
  const handleSaveCustomization = (
    dish: MenuItem,
    selection: DishCustomizationSelection,
    selectedOptionIndex?: number
  ) => {
    const priceOption =
      dish.priceOptions && selectedOptionIndex !== undefined
        ? dish.priceOptions[selectedOptionIndex]
        : undefined;

    const basePrice = priceOption ? priceOption.value : dish.price;
    const finalPrice = calculateCustomizationPrice(basePrice, dish, selection);
    const newCartItemId = generateCustomizedOrderItemId(
      dish.id,
      selectedOptionIndex,
      selection
    );
    const summary = buildCustomizationSummary(dish, selection);

    setOrderItems((prev) => {
      // If editing an existing item from the cart:
      if (customizingItemState?.isEditingCartItem && customizingItemState.cartItemId) {
        const oldId = customizingItemState.cartItemId;
        const oldItem = prev.find((item) => item.id === oldId);
        const qty = oldItem ? oldItem.quantity : 1;

        const withoutOld = prev.filter((item) => item.id !== oldId);
        const existingNewIdx = withoutOld.findIndex((item) => item.id === newCartItemId);
        if (existingNewIdx > -1) {
          return withoutOld.map((item, i) =>
            i === existingNewIdx ? { ...item, quantity: item.quantity + qty } : item
          );
        } else {
          return [
            ...withoutOld,
            {
              id: newCartItemId,
              menuItemId: dish.id,
              name: dish.name,
              selectedOptionLabel: priceOption ? priceOption.label : undefined,
              price: finalPrice,
              quantity: qty,
              imageUrl: dish.imageUrl,
              customizationSelection: selection,
              customizationSummary: summary,
            },
          ];
        }
      }

      // Adding new customized item
      const existingIndex = prev.findIndex((item) => item.id === newCartItemId);
      if (existingIndex > -1) {
        return prev.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newItem: OrderItem = {
          id: newCartItemId,
          menuItemId: dish.id,
          name: dish.name,
          selectedOptionLabel: priceOption ? priceOption.label : undefined,
          price: finalPrice,
          quantity: 1,
          imageUrl: dish.imageUrl,
          customizationSelection: selection,
          customizationSummary: summary,
        };
        return [...prev, newItem];
      }
    });

    setImportNotification(
      language === 'fi'
        ? `${dish.name.fi} lisätty tilaukseen toiveidesi mukaisesti!`
        : `${dish.name.en} added to order with your custom choices!`
    );
    setTimeout(() => {
      setImportNotification(null);
    }, 4000);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setOrderItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is OrderItem => item !== null);
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClearOrder = () => {
    setOrderItems([]);
  };

  const handleRemoveEatenItem = (index: number) => {
    setEatenItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearEatenItems = () => {
    setEatenItems([]);
  };

  const handleOpenTransferModal = () => {
    if (orderItems.length > 0) {
      const snapshot = [...orderItems];
      setTransferItems(snapshot);

      const nowIso = new Date().toISOString();
      const newEaten = snapshot.map((item) => ({ ...item, orderedAt: nowIso }));

      setEatenItems((prev) => [...prev, ...newEaten]);
      setOrderItems([]);

      setImportNotification(
        language === 'fi'
          ? 'Tilaus siirretty "Sinun ruokasi" -osioon! Voit antaa annoksille arvostelun.'
          : 'Order saved to "Your Foods"! You can now rate your dishes.'
      );
      setTimeout(() => setImportNotification(null), 6000);
    }
    setIsTransferModalOpen(true);
  };

  const handleShowToWaiter = () => {
    if (orderItems.length > 0) {
      const snapshot = [...orderItems];
      setWaiterItems(snapshot);

      const nowIso = new Date().toISOString();
      const newEaten = snapshot.map((item) => ({ ...item, orderedAt: nowIso }));

      setEatenItems((prev) => [...prev, ...newEaten]);
      setOrderItems([]);

      setImportNotification(
        language === 'fi'
          ? 'Tilaus siirretty "Sinun ruokasi" -osioon! Voit antaa annoksille arvostelun.'
          : 'Order saved to "Your Foods"! You can now rate your dishes.'
      );
      setTimeout(() => setImportNotification(null), 6000);
    }
  };

  const handleNavigateToReview = (menuItemId: string) => {
    setIsOrderModalOpen(false);
    const targetItem = menuItems.find((m) => m.id === menuItemId);
    if (targetItem) {
      setActiveCategory(targetItem.category);
    }
    setSearchQuery('');
    setSelectedAllergens([]);

    setTimeout(() => {
      const cardEl = document.getElementById(`menu-card-${menuItemId}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const reviewsBtn = document.getElementById(`reviews-btn-${menuItemId}`);
        const isAlreadyExpanded = document.getElementById(`review-section-${menuItemId}`) !== null;
        if (reviewsBtn && !isAlreadyExpanded) {
          reviewsBtn.click();
        }
      }
    }, 150);
  };

  const totalOrderCount = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [orderItems]);

  const totalOrderPrice = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [orderItems]);

  const dismissReviewHint = () => {
    setShowReviewHint(false);
    try {
      localStorage.setItem('hide_review_hint', 'true');
    } catch (e) {
      console.warn('Could not save review hint state to localStorage:', e);
    }
  };

  // Toggle allergen filter
  const toggleAllergen = (allKey: AllergenKey) => {
    setSelectedAllergens((prev) =>
      prev.includes(allKey) ? prev.filter((k) => k !== allKey) : [...prev, allKey]
    );
  };

  // Clear all search inputs and filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedAllergens([]);
  };

  // Filter items based on search, category and allergen pills
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Filter by search query if any (searches item number, name, description, category name)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        
        // Item number in the main menu (1-indexed)
        const itemNumber = menuItems.findIndex((m) => m.id === item.id) + 1;
        const itemNumStr = itemNumber.toString();
        
        // Extract numeric part from query (e.g. "n° 5", "#5", "nro 5", "5." -> "5")
        const cleanNumQuery = query.replace(/^(n°|no\.?|nro|#)\s*/i, '').replace(/[^0-9]/g, '');

        const matchesNumber =
          itemNumStr === query ||
          (cleanNumQuery !== '' && (itemNumStr === cleanNumQuery || itemNumStr.startsWith(cleanNumQuery))) ||
          query === `n°${itemNumStr}` ||
          query === `n° ${itemNumStr}` ||
          query === `#${itemNumStr}` ||
          query === `nro ${itemNumStr}`;

        const matchesName =
          item.name.fi.toLowerCase().includes(query) ||
          item.name.en.toLowerCase().includes(query);
        const matchesDesc =
          item.description.fi.toLowerCase().includes(query) ||
          item.description.en.toLowerCase().includes(query);
        
        // Find if any category name matches the query
        const cat = categories.find((c) => c.id === item.category);
        const matchesCat = cat
          ? cat.name.fi.toLowerCase().includes(query) || cat.name.en.toLowerCase().includes(query)
          : false;

        if (!matchesNumber && !matchesName && !matchesDesc && !matchesCat) {
          return false;
        }
      } else {
        // Only enforce category filter when NOT searching globally
        if (item.category !== activeCategory) {
          return false;
        }
      }

      // 2. Filter by dietary allergens
      if (selectedAllergens.length > 0) {
        const hasAllAllergens = selectedAllergens.every((allergen) =>
          item.allergens.includes(allergen)
        );
        if (!hasAllAllergens) {
          return false;
        }
      }

      return true;
    });
  }, [menuItems, activeCategory, searchQuery, selectedAllergens, categories]);

  // Find the label of the active category
  const activeCategoryLabel = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    return cat ? cat.name[language] : '';
  }, [activeCategory, language]);

  if (currentRoute === 'admin') {
    return <AdminPage language={language} onLanguageChange={setLanguage} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-modern-canvas relative">
      
      {/* BRAND NEW MODERN AMBIENT LIGHTING & TEXTURE BACKDROP */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Subtle linen micro-dots */}
        <div className="absolute inset-0 bg-dot-matrix opacity-40" />

        {/* Ambient atmospheric lighting orbs */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-gradient-to-br from-[#d97736]/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-[#1b3b32]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-2/3 -left-40 w-[650px] h-[650px] bg-gradient-to-tr from-[#d97736]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-[#1b3b32]/12 to-transparent rounded-full blur-3xl" />
      </div>

      {/* HEADER SECTION WITH BRANDING AND LANGUAGE SELECTION (SCROLLS NORMALLY) */}
      <Header
        language={language}
        setLanguage={setLanguage}
        orderItemCount={totalOrderCount}
        orderTotalPrice={totalOrderPrice}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
        onOpenYourFoods={() => setIsYourFoodsModalOpen(true)}
        onOpenAllergenLegend={() => setIsAllergenLegendOpen(true)}
        eatenCount={eatenItems.length}
      />

      {/* STICKY CATEGORY NAV ONLY */}
      <div id="sticky-nav-header" className="sticky top-0 z-40 bg-brand-cream/95 backdrop-blur-md shadow-md border-b border-brand-gold/20 py-1">
        {/* SWIPEABLE HORIZONTAL CATEGORY NAVIGATION */}
        <CategoryNav
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          language={language}
        />
      </div>

      {/* FILTERS AND SEARCH COMPONENT (Flows with page so it never blocks food list on mobile) */}
      <FilterControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedAllergens={selectedAllergens}
        toggleAllergen={toggleAllergen}
        clearFilters={clearFilters}
        language={language}
        matchingCount={filteredMenuItems.length}
      />

      {/* MAIN CONTENT SPACE */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 z-10 space-y-8" id="menu-items-section">
        
        {/* Dynamic Category/Search Heading with icon decoration */}
        <div className="flex items-center justify-between border-b border-brand-gold/30 pb-4">
          <div className="flex items-center space-x-2.5">
            <UtensilsCrossed className="w-5 h-5 text-brand-gold" />
            <h2 className="font-serif font-bold text-xl md:text-2xl text-brand-blue uppercase tracking-widest">
              {searchQuery.trim() !== ''
                ? (language === 'fi' ? 'Hakutulokset' : 'Search Results')
                : activeCategoryLabel}
            </h2>
          </div>
          <span className="text-[11px] md:text-xs font-semibold tracking-wider text-brand-gold-text uppercase bg-brand-gold/10 px-3 py-1.5 rounded-full border border-brand-gold/25 font-sans">
            {filteredMenuItems.length} {language === 'fi' ? 'annosta' : 'items'}
          </span>
        </div>

        {/* Informative alert explaining reviews can be written/saved (dismissible and subtle) */}
        {showReviewHint && (
          <div className="bg-white/80 border border-brand-gold/25 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between text-brand-blue text-xs font-sans shadow-2xs">
            <div className="flex items-center space-x-2.5">
              <Info className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>
                {language === 'fi'
                  ? 'Voit antaa arvosanoja ja kirjoittaa arvosteluja jokaiselle annokselle.'
                  : 'You can rate and write reviews for any dish.'}
              </span>
            </div>
            <button
              onClick={dismissReviewHint}
              className="text-brand-blue/60 hover:text-brand-blue p-1.5 rounded-full hover:bg-brand-blue/5 transition-all cursor-pointer"
              id="dismiss-review-hint-btn"
              title={language === 'fi' ? 'Piilota vihje' : 'Dismiss tip'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* MENU CARD GRID */}
        {filteredMenuItems.length === 0 ? (
          /* Empty Filter State */
          <div className="text-center py-20 px-6 bg-white/80 border border-dashed border-brand-gold/40 rounded-3xl max-w-lg mx-auto space-y-5 shadow-xs">
            <div className="w-14 h-14 bg-brand-gold/15 rounded-full flex items-center justify-center mx-auto text-brand-gold">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-blue uppercase tracking-wider">
              {language === 'fi' ? 'Ei tuloksia suodattimilla' : 'No matches found'}
            </h3>
            <p className="text-xs sm:text-sm text-brand-blue/80 max-w-sm mx-auto leading-relaxed">
              {language === 'fi'
                ? 'Kokeile vaihtaa kategoriaa tai poistaa erityisruokavalion suodattimet löytääksesi etsimäsi.'
                : 'Try selecting a different category, clearing your search query, or toggling off some dietary filters.'}
            </p>
            <button
              onClick={clearFilters}
              className="mt-3 bg-brand-blue hover:bg-brand-blue/95 text-white font-serif font-bold text-xs py-3 px-8 rounded-full tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
              id="empty-reset-btn"
            >
              {language === 'fi' ? 'Nollaa haku ja suodattimet' : 'Reset search & filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 items-start">
            {filteredMenuItems.map((item) => {
              const itemNumber = menuItems.findIndex((m) => m.id === item.id) + 1;
              return (
                <MenuItemCard
                  key={item.id}
                  menuItem={item}
                  language={language}
                  onAddToOrder={handleAddToOrder}
                  onOpenCustomizer={handleOpenCustomizer}
                  onOpenAR={(item) => setActiveArItem(item)}
                  onOpenAdminEdit={() => openAdmin()}
                  itemNumber={itemNumber > 0 ? itemNumber : undefined}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* FLOATING ORDER SUMMARY BOTTOM BAR */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-4 right-4 md:left-auto md:right-8 md:max-w-md z-40 animate-slide-up">
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="w-full bg-brand-blue hover:bg-brand-blue/95 text-white p-4 md:p-4.5 rounded-full shadow-2xl border-2 border-brand-gold/60 flex items-center justify-between space-x-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
            id="floating-order-bar"
          >
            <div className="flex items-center space-x-3.5 pl-1">
              <div className="relative bg-brand-gold text-brand-blue p-2.5 rounded-full">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-blue shadow-xs">
                  {totalOrderCount}
                </span>
              </div>
              <div className="text-left">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-brand-gold block">
                  {language === 'fi' ? 'Oma tilauslista' : 'My Order List'}
                </span>
                <span className="text-xs text-white/80 font-sans">
                  {totalOrderCount} {language === 'fi' ? 'valittua annosta' : 'selected items'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pr-1">
              <span className="font-serif font-extrabold text-lg md:text-xl text-white">
                {totalOrderPrice.toFixed(2).replace('.', ',')} €
              </span>
              <div className="bg-white/10 group-hover:bg-brand-gold group-hover:text-brand-blue text-white p-2 rounded-full transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* SUCCESS TOAST NOTIFICATION */}
      <ToastNotification
        notification={importNotification}
        onClose={() => setImportNotification(null)}
        language={language}
      />

      {/* LAZY LOADED MODALS SUSPENSE BOUNDARY */}
      <Suspense fallback={null}>
        {/* ORDER LIST MODAL */}
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          orderItems={orderItems}
          waiterItems={waiterItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearOrder={handleClearOrder}
          language={language}
          onNavigateToReview={handleNavigateToReview}
          onOpenTransferModal={handleOpenTransferModal}
          onShowToWaiter={handleShowToWaiter}
          onEditCustomization={handleEditCustomizationFromCart}
        />

        {/* DISH CUSTOMIZATION MODAL (Removals, Swaps, Custom Notes) */}
        {customizingItemState && (
          <DishCustomizationModal
            isOpen={Boolean(customizingItemState)}
            onClose={() => setCustomizingItemState(null)}
            dish={customizingItemState.dish}
            initialOptionIndex={customizingItemState.optionIndex}
            initialSelection={customizingItemState.initialSelection}
            isEditingExisting={customizingItemState.isEditingCartItem}
            onSave={(dish, selection, optIndex) => {
              handleSaveCustomization(dish, selection, optIndex);
              setCustomizingItemState(null);
            }}
            language={language}
          />
        )}

        {/* DIGITAL QR ORDER TRANSFER MODAL */}
        <OrderTransferModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          orderItems={transferItems.length > 0 ? transferItems : orderItems}
          language={language}
        />

        {/* SINUN RUOKASI (YOUR FOODS & REVIEWS) MODAL */}
        <YourFoodsModal
          isOpen={isYourFoodsModalOpen}
          onClose={() => setIsYourFoodsModalOpen(false)}
          eatenItems={eatenItems}
          language={language}
          onNavigateToMenuItem={handleNavigateToReview}
          onRemoveEatenItem={handleRemoveEatenItem}
          onClearEatenItems={handleClearEatenItems}
        />

        {/* LEGAL MATTERS MODAL (GDPR, TERMS, COOKIES) */}
        <LegalModal
          isOpen={isLegalModalOpen}
          onClose={() => setIsLegalModalOpen(false)}
          initialTab={legalModalTab}
          language={language}
        />

        {/* ALLERGEN & DIETARY LEGEND MODAL */}
        <AllergenLegend
          isOpen={isAllergenLegendOpen}
          onClose={() => setIsAllergenLegendOpen(false)}
          language={language}
        />

        {/* SINGLE GLOBAL 3D / AR VIEWER MODAL */}
        {activeArItem && (
          <ARViewerModal
            isOpen={Boolean(activeArItem)}
            menuItem={activeArItem}
            onClose={() => setActiveArItem(null)}
            language={language}
          />
        )}
      </Suspense>

      {/* LUXURIOUS FOOTER DETAIL */}
      <footer className="mt-12 bg-brand-blue text-white py-12 px-6 border-t border-brand-gold/30 z-10 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Restaurant branding */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-lg tracking-widest text-brand-gold">
                {restaurantConfig.name.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-white/85 leading-relaxed font-sans">
              {restaurantConfig.description[language]}
            </p>
          </div>

          {/* Column 2: Hours */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-brand-gold">
              <Clock className="w-4 h-4" />
              <h4 className="font-serif font-bold text-sm uppercase tracking-wider">{language === 'fi' ? 'Aukioloajat' : 'Opening Hours'}</h4>
            </div>
            <ul className="text-xs space-y-2 text-white/90 font-sans font-medium">
              {restaurantConfig.openingHours.map((period, idx) => (
                <li
                  key={idx}
                  className={`flex justify-between ${
                    idx < restaurantConfig.openingHours.length - 1 ? 'border-b border-white/10 pb-1' : ''
                  }`}
                >
                  <span>{period.dayRange[language]}</span>
                  <span>{period.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-brand-gold">
              <MapPin className="w-4 h-4" />
              <h4 className="font-serif font-bold text-sm uppercase tracking-wider">{language === 'fi' ? 'Yhteystiedot' : 'Contact Us'}</h4>
            </div>
            <ul className="text-xs space-y-2.5 text-white/90 font-sans">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                <span>{restaurantConfig.address}, {restaurantConfig.postalCode} {restaurantConfig.city}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>{restaurantConfig.phone}</span>
              </li>
              {restaurantConfig.email && (
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
                  <span>{restaurantConfig.email}</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Legal links and GDPR disclosure */}
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 space-y-4 text-center font-sans">
          {/* Interactive Legal & Allergen Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-serif text-amber-200 font-medium">
            <button
              onClick={() => setIsAllergenLegendOpen(true)}
              className="hover:text-white underline underline-offset-4 decoration-amber-200/40 hover:decoration-white transition-colors cursor-pointer"
              id="footer-allergen-legend-link"
            >
              {language === 'fi' ? 'Allergeenit & Merkinnät' : 'Allergens & Dietary Legend'}
            </button>
            <span className="text-white/20 hidden sm:inline">•</span>
            <button
              onClick={() => handleOpenLegal('privacy')}
              className="hover:text-white underline underline-offset-4 decoration-amber-200/40 hover:decoration-white transition-colors cursor-pointer"
              id="footer-privacy-link"
            >
              {language === 'fi' ? 'Tietosuojaseloste (GDPR)' : 'Privacy Policy (GDPR)'}
            </button>
            <span className="text-white/20 hidden sm:inline">•</span>
            <button
              onClick={() => handleOpenLegal('terms')}
              className="hover:text-white underline underline-offset-4 decoration-amber-200/40 hover:decoration-white transition-colors cursor-pointer"
              id="footer-terms-link"
            >
              {language === 'fi' ? 'Käyttöehdot' : 'Terms of Service'}
            </button>
            <span className="text-white/20 hidden sm:inline">•</span>
            <button
              onClick={() => handleOpenLegal('cookies')}
              className="hover:text-white underline underline-offset-4 decoration-amber-200/40 hover:decoration-white transition-colors cursor-pointer"
              id="footer-cookies-link"
            >
              {language === 'fi' ? 'Evästekäytäntö' : 'Cookie Policy'}
            </button>
            <span className="text-white/20 hidden sm:inline">•</span>
            <button
              onClick={() => navigateTo('admin')}
              className="hover:text-white underline underline-offset-4 decoration-amber-200/40 hover:decoration-white transition-colors cursor-pointer text-amber-200/80 hover:text-amber-200"
              id="footer-staff-admin-link"
              title={getAdminDirectUrl()}
            >
              {language === 'fi' ? 'Henkilökunta / Ylläpito' : 'Staff / Admin'}
            </button>
          </div>

          <div className="text-[10px] text-white/80 max-w-2xl mx-auto space-y-1">
            <p
              onClick={handleSecretCopyrightClick}
              className="select-none cursor-default"
              title="©"
            >
              © {new Date().getFullYear()} {restaurantConfig.name}. {language === 'fi' ? 'Kaikki oikeudet pidätetään.' : 'All rights reserved.'}
            </p>
            <p>
              {language === 'fi'
                ? 'Tämä sovellus ei kerää henkilötietoja taustalla. Valinnaisesti annetut nimimerkit ja arvostelut tallentuvat tietokantaan julkisiksi asiakaspalautteiksi. Sovellus ei käytä seurantaevästeitä.'
                : 'This app does not collect personal data in the background. Optional reviewer names and comments are stored in the database as public feedback. No tracking cookies are used.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <MenuProvider>
      <AdminAuthProvider>
        <MainAppContent />
      </AdminAuthProvider>
    </MenuProvider>
  );
}
