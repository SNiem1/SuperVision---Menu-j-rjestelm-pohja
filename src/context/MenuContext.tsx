import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MenuItem, Category, Translation } from '../types';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import { DEFAULT_DISH_CUSTOMIZATIONS } from '../data/customizations';

const MENU_STORAGE_KEY = 'kolme_kruunua_menu_items_v2';

interface MenuContextType {
  menuItems: MenuItem[];
  categories: Category[];
  updateMenuItem: (updatedItem: MenuItem) => void;
  addMenuItem: (newItem: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  toggleItemAvailability: (itemId: string, isAvailable: boolean, reason?: Translation) => void;
  resetToDefaultMenu: () => void;
  exportMenuJson: () => string;
  importMenuJson: (jsonStr: string) => { success: boolean; message?: string };
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem(MENU_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge default customizations if missing
          return parsed.map((item: MenuItem) => {
            const defaultCustom = DEFAULT_DISH_CUSTOMIZATIONS[item.id];
            if (defaultCustom && !item.customization) {
              return { ...item, customization: defaultCustom };
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load menu items from localStorage:', e);
    }
    return MENU_ITEMS.map((item) => {
      const defaultCustom = DEFAULT_DISH_CUSTOMIZATIONS[item.id];
      if (defaultCustom && !item.customization) {
        return { ...item, customization: defaultCustom };
      }
      return item;
    });
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
    } catch (e) {
      console.warn('Failed to persist menu items to localStorage:', e);
    }
  }, [menuItems]);

  const updateMenuItem = useCallback((updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);

  const addMenuItem = useCallback((newItem: MenuItem) => {
    setMenuItems((prev) => {
      // Avoid duplicate IDs
      const exists = prev.some((item) => item.id === newItem.id);
      if (exists) {
        const uniqueItem = {
          ...newItem,
          id: `${newItem.id}-${Date.now().toString().slice(-4)}`,
        };
        return [...prev, uniqueItem];
      }
      return [...prev, newItem];
    });
  }, []);

  const deleteMenuItem = useCallback((itemId: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const toggleItemAvailability = useCallback(
    (itemId: string, isAvailable: boolean, reason?: Translation) => {
      setMenuItems((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              isAvailable,
              unavailableReason: isAvailable
                ? undefined
                : reason || {
                    fi: 'Ainesosa tilapäisesti loppu',
                    en: 'Temporarily sold out due to ingredient shortage',
                  },
            };
          }
          return item;
        })
      );
    },
    []
  );

  const resetToDefaultMenu = useCallback(() => {
    try {
      localStorage.removeItem(MENU_STORAGE_KEY);
    } catch (e) {
      console.warn('Could not remove storage key:', e);
    }
    setMenuItems(MENU_ITEMS);
  }, []);

  const exportMenuJson = useCallback(() => {
    return JSON.stringify(menuItems, null, 2);
  }, [menuItems]);

  const importMenuJson = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return { success: false, message: 'Tiedosto ei sisällä kelvollista ruokalistaa.' };
      }
      // Basic validation
      const valid = parsed.every((item) => item.id && item.name && item.category && typeof item.price === 'number');
      if (!valid) {
        return { success: false, message: 'Ruokalistan rakenne ei vastaa vaadittua muotoa.' };
      }
      setMenuItems(parsed);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Virheellinen JSON-muoto',
      };
    }
  }, []);

  const value = useMemo(
    () => ({
      menuItems,
      categories: CATEGORIES,
      updateMenuItem,
      addMenuItem,
      deleteMenuItem,
      toggleItemAvailability,
      resetToDefaultMenu,
      exportMenuJson,
      importMenuJson,
    }),
    [
      menuItems,
      updateMenuItem,
      addMenuItem,
      deleteMenuItem,
      toggleItemAvailability,
      resetToDefaultMenu,
      exportMenuJson,
      importMenuJson,
    ]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
