'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, TopBar } from '@/components';
import { SidebarToggle } from '@/components/layout/SidebarToggle';
import { cn } from '@/lib/utils';
import { useAuthStore, User } from '@/store/authStore';

interface LayoutClientProps {
  children: React.ReactNode;
  initialProfile: User;
}

export function LayoutClient({ children, initialProfile }: LayoutClientProps) {

  const [mobileOpen, setMobileOpen] = useState(false);
  const initialized = useRef(false);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (!initialized.current) {
      setUser(initialProfile);
      initialized.current = true;
    }
  }, [initialProfile, setUser]);

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={true}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
      />

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 min-h-screen lg:ml-64"
      )}>
        <SidebarToggle />
        <TopBar />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}