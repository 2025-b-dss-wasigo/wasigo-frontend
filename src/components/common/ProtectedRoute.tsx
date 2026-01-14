'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'pasajero' | 'conductor' | 'admin';
  requiresVerification?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiresVerification = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Si requiere un rol específico y no lo tiene
      if (requiredRole && user?.role?.toLowerCase() !== requiredRole) {
        router.push('/');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, requiresVerification, router]);

  // Mostrar loader mientras se verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (el effect redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  // Si requiere rol y no lo tiene, no renderizar
  if (requiredRole && user?.role?.toLowerCase() !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
