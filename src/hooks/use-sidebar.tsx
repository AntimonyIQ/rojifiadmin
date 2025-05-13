import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  collapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (collapsed: boolean) => set({ collapsed }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
);
