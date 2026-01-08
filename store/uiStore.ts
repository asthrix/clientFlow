// ============================================
// ClientFlow CRM - UI Store
// Zustand store for UI state management
// ============================================

import { create } from 'zustand';

interface UIStore {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;

  // Mobile nav
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;

  // Modals
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Global loading
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Confirmations
  confirmDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    variant: 'default' | 'destructive';
  };
  showConfirmDialog: (params: {
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
  }) => void;
  hideConfirmDialog: () => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Sidebar
  sidebarOpen: true,
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebarCollapse: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // Mobile nav
  mobileNavOpen: false,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),

  // Modals
  activeModal: null,
  modalData: null,
  openModal: (modalId, data = {}) =>
    set({ activeModal: modalId, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Global loading
  globalLoading: false,
  setGlobalLoading: (globalLoading) => set({ globalLoading }),

  // Confirmations
  confirmDialog: {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    variant: 'default',
  },
  showConfirmDialog: ({ title, message, onConfirm, variant = 'default' }) =>
    set({
      confirmDialog: {
        isOpen: true,
        title,
        message,
        onConfirm,
        variant,
      },
    }),
  hideConfirmDialog: () =>
    set({
      confirmDialog: {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        variant: 'default',
      },
    }),

  // Theme
  theme: 'system',
  setTheme: (theme) => set({ theme }),
}));
