'use client';

import { create } from 'zustand';

interface SidebarStore {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setMobileSidebarOpen: (open: boolean) => set({ mobileSidebarOpen: open }),
}));

export function SidebarToggle() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useSidebarStore();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-(--foreground)/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </>
  );
}
