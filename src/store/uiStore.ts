import { create } from 'zustand';
import type { Person } from '../models/Person';

export interface ToastInfo {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface UIState {
  // Modal & Drawer states
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailPanelOpen: boolean;
  isStatsModalOpen: boolean;
  isLegendOpen: boolean;
  
  // Target node for actions
  selectedPerson: Person | null;
  targetParentId: string | null;
  highlightedPersonId: string | null;
  
  // Context Menu
  contextMenu: { x: number; y: number; personId: string } | null;

  // Toast
  toast: ToastInfo | null;

  // Actions
  openAddModal: (parentId?: string | null) => void;
  openEditModal: (person: Person) => void;
  openDetailPanel: (person: Person) => void;
  closeModals: () => void;
  setContextMenu: (menu: { x: number; y: number; personId: string } | null) => void;
  setHighlightedPersonId: (id: string | null) => void;
  openStatsModal: () => void;
  closeStatsModal: () => void;
  toggleLegend: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDetailPanelOpen: false,
  isStatsModalOpen: false,
  isLegendOpen: false,
  selectedPerson: null,
  targetParentId: null,
  highlightedPersonId: null,
  contextMenu: null,
  toast: null,

  openAddModal: (parentId = null) => set({ isAddModalOpen: true, targetParentId: parentId, contextMenu: null }),
  openEditModal: (person) => set({ isEditModalOpen: true, selectedPerson: person, contextMenu: null }),
  openDetailPanel: (person) => set({ isDetailPanelOpen: true, selectedPerson: person, contextMenu: null }),
  closeModals: () => set({ 
    isAddModalOpen: false, 
    isEditModalOpen: false, 
    isDetailPanelOpen: false, 
    isStatsModalOpen: false,
    selectedPerson: null, 
    targetParentId: null, 
    contextMenu: null 
  }),
  setContextMenu: (menu) => set({ contextMenu: menu }),
  setHighlightedPersonId: (id) => set({ highlightedPersonId: id }),
  openStatsModal: () => set({ isStatsModalOpen: true }),
  closeStatsModal: () => set({ isStatsModalOpen: false }),
  toggleLegend: () => set((state) => ({ isLegendOpen: !state.isLegendOpen })),
  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set((state) => (state.toast?.message === message ? { toast: null } : {}));
    }, 3200);
  },
  hideToast: () => set({ toast: null }),
}));
