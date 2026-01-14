'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { PassengerPaymentsSection } from './PassengerPaymentsSection';

export function PassengerPaymentsGuard() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Solo permitir pasajeros verificados
    if (!isLoading && (!isAuthenticated || user?.role !== 'PASAJERO')) {
      router.push('/passenger');
    }
  }, [isAuthenticated, isLoading, user?.role, router]);

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

  if (!isAuthenticated || user?.role !== 'PASAJERO') {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <PassengerPaymentsSection isPreview={false} />
    </div>
  );
}
