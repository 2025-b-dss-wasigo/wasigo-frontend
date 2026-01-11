'use client';

import React, { useEffect, useRef } from 'react';
import { Sidebar, TopBar } from '@/components';
import { useSidebarStore } from '@/components/layout/SidebarToggle';
import { cn } from '@/lib/utils';
import { useAuthStore, User } from '@/store/authStore';

interface LayoutClientProps {
  children: React.ReactNode;
  initialProfile: User;
}

export function LayoutClient({ children, initialProfile }: LayoutClientProps) {
  const initialized = useRef(false);
  const setUser = useAuthStore((state) => state.setUser);
  const { sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen } = useSidebarStore();

  useEffect(() => {
    if (!initialized.current) {
      setUser(initialProfile);
      initialized.current = true;
    }
  }, [initialProfile, setUser]);

  const handleMobileClose = () => {
    setMobileSidebarOpen(false);
  };

  const handleMenuClick = () => {
    setMobileSidebarOpen(true);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={handleMobileClose}
      />

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        <TopBar
          onMenuClick={handleMenuClick}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}