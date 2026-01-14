'use client'

import { useAuthStore } from '@/store/authStore';
import { PassengerPaymentsSection } from '@/components/passenger/PassengerPaymentsSection';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function PassengerPaymentsPage() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    // Solo permitir pasajeros verificados
    if (!isLoading && (!isAuthenticated || user?.role !== 'PASAJERO')) {
      redirect('/passenger');
    }
  }, [isAuthenticated, isLoading, user?.role]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-(--primary) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--muted-foreground)">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <PassengerPaymentsSection isPreview={false} />
      </div>
    </div>
  );
}
