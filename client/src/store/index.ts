import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, SiteSettings } from '../types';

// ============================================
// AUTH STORE
// ============================================
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('portfolio_token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('portfolio_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'portfolio-auth' }
  )
);

// ============================================
// UI STORE
// ============================================
interface UIState {
  activeSection: string;
  sidebarOpen: boolean;
  adminSidebarOpen: boolean;
  adminLanguage: 'en' | 'ar';
  setActiveSection: (section: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setAdminSidebarOpen: (open: boolean) => void;
  setAdminLanguage: (lang: 'en' | 'ar') => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeSection: 'home',
  sidebarOpen: true,
  adminSidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  adminLanguage: (localStorage.getItem('admin_language') as 'en' | 'ar') || 'ar',
  setActiveSection: (section) => set({ activeSection: section }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setAdminSidebarOpen: (open) => set({ adminSidebarOpen: open }),
  setAdminLanguage: (lang) => {
    localStorage.setItem('admin_language', lang);
    set({ adminLanguage: lang });
  },
}));


// ============================================
// SETTINGS STORE
// ============================================
interface SettingsState {
  settings: SiteSettings | null;
  isLoading: boolean;
  setSettings: (settings: SiteSettings) => void;
  setLoading: (loading: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: true,
  setSettings: (settings) => set({ settings, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
