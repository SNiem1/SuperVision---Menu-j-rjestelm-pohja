import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const ADMIN_SESSION_KEY = 'kolme_kruunua_admin_session';
const ADMIN_PASS_KEY = 'kolme_kruunua_admin_custom_pass';

const DEFAULT_PASSWORDS = ['ravintola', 'admin123', '1931', 'admin'];

export type AppRoute = 'menu' | 'admin';

export function checkIsAdminUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  return (
    path === '/admin' ||
    path === '/hallinta' ||
    path.startsWith('/admin/') ||
    path.startsWith('/hallinta/') ||
    hash === '#admin' ||
    hash === '#hallinta' ||
    hash === '#yllapito' ||
    search.includes('page=admin') ||
    search.includes('view=admin') ||
    search.includes('admin=true')
  );
}

export function getAdminDirectUrl(): string {
  if (typeof window === 'undefined') return '/#admin';
  const origin = window.location.origin;
  return `${origin}/#admin`;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  currentRoute: AppRoute;
  navigateTo: (route: AppRoute) => void;
  getAdminDirectUrl: () => string;
  isLoginModalOpen: boolean;
  isAdminPanelOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  setIsAdminPanelOpen: (open: boolean) => void;
  login: (password: string) => { success: boolean; error?: string };
  logout: () => void;
  openAdmin: () => void;
  changePassword: (newPassword: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    return checkIsAdminUrl() ? 'admin' : 'menu';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Sync route on hashchange or popstate
  useEffect(() => {
    const handleUrlChange = () => {
      const isAdmin = checkIsAdminUrl();
      setCurrentRoute(isAdmin ? 'admin' : 'menu');
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const navigateTo = useCallback((route: AppRoute) => {
    setCurrentRoute(route);
    if (route === 'admin') {
      if (window.location.hash !== '#admin') {
        window.history.pushState(null, '', '#admin');
      }
    } else {
      if (window.location.hash === '#admin' || window.location.hash === '#hallinta') {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const login = useCallback((inputPass: string) => {
    const trimmed = inputPass.trim().toLowerCase();
    let customPass = '';
    try {
      customPass = localStorage.getItem(ADMIN_PASS_KEY) || '';
    } catch {
      // ignore
    }

    const isValid =
      DEFAULT_PASSWORDS.includes(trimmed) ||
      (customPass && trimmed === customPass.toLowerCase());

    if (isValid) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch (e) {
        console.warn('Failed to save session:', e);
      }
      setIsLoginModalOpen(false);
      setIsAdminPanelOpen(true);
      return { success: true };
    } else {
      return {
        success: false,
        error: 'Virheellinen salasana tai PIN-koodi. Kokeile salasanaa "ravintola" tai PIN "1931".',
      };
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {
      console.warn('Failed to remove session:', e);
    }
    setIsAdminPanelOpen(false);
  }, []);

  const changePassword = useCallback((newPass: string) => {
    try {
      localStorage.setItem(ADMIN_PASS_KEY, newPass.trim());
    } catch (e) {
      console.warn('Failed to store custom password:', e);
    }
  }, []);

  const openAdmin = useCallback(() => {
    navigateTo('admin');
  }, [navigateTo]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      currentRoute,
      navigateTo,
      getAdminDirectUrl,
      isLoginModalOpen,
      isAdminPanelOpen,
      setIsLoginModalOpen,
      setIsAdminPanelOpen,
      login,
      logout,
      openAdmin,
      changePassword,
    }),
    [
      isAuthenticated,
      currentRoute,
      navigateTo,
      isLoginModalOpen,
      isAdminPanelOpen,
      login,
      logout,
      openAdmin,
      changePassword,
    ]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
