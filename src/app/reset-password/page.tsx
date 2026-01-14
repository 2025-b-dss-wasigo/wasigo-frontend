import { Suspense } from 'react';
import { ResetPasswordContent } from '@/components/auth/ResetPasswordContent';

export const metadata = {
  title: 'Restablecer Contraseña',
  description: 'Restablece tu contraseña ingresando el código de verificación que recibiste por email',
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
