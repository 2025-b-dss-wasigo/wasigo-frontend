'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FaCar, FaCheckCircle } from 'react-icons/fa';
import { AlertCircle, LogOut } from 'lucide-react';
import { VerificationModal } from '@/components/common/VerificationModal';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { sendVerificationCode } from '@/actions';
import { logout as logoutAction } from '@/actions';
import { useAuthStore } from '@/store/authStore';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

interface ProfileAlertCardProps {
  role: string;
  onDriverApplicationClick?: () => void;
  verificado: boolean;
  hasDriverApplication?: boolean;
}

export const ProfileAlertCard: React.FC<ProfileAlertCardProps> = ({
  role,
  onDriverApplicationClick,
  verificado,
  hasDriverApplication = true,
}) => {
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCompleted, setVerificationCompleted] = useState(false);
  const { logout } = useAuthStore();
  const isPassenger = role === 'PASAJERO';
  const isUserRole = role === 'USER';
  const isDriver = role === 'CONDUCTOR';

  // Si es CONDUCTOR sin aplicación, mostrar tarjeta de solicitud
  if (isDriver && !hasDriverApplication) {
    return (
      <Card className="border-l-4 border-l-(--primary) bg-(--primary)/5">
        <CardContent className="flex items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-(--primary)/20 flex items-center justify-center shrink-0">
              <FaCar className="w-6 h-6 text-(--primary)" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-(--foreground) text-lg">Solicita ser conductor</h3>
              <p className="text-sm text-(--muted-foreground)">
                Completa tu solicitud para comenzar a compartir viajes y generar ingresos
              </p>
            </div>
          </div>
          <Button
            onClick={onDriverApplicationClick}
            className="bg-(--primary) hover:bg-(--primary)/90 text-white shrink-0"
          >
            Solicitar ahora
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Si es CONDUCTOR con aplicación, no mostrar nada
  if (isDriver && hasDriverApplication) return null;

  const handleRequestVerification = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await sendVerificationCode();

      if (response.success) {
        setIsLoading(false);
        setVerificationModalOpen(true);
        return;
      }

      let errorMessage = response.message || 'Error al enviar el código';

      if (response.statusCode === 429) {
        errorMessage = 'Demasiadas solicitudes, inténtalo de nuevo más tarde';
      }

      setError(errorMessage);
      setIsLoading(false);
    } catch (err) {
      setError('Error al procesar la solicitud');
      setIsLoading(false);
    }
  };

  // Si es PASAJERO y ya es verificado, mostrar tarjeta de conductor
  if (isPassenger && verificado) {
    return (
      <Card className="border-l-4 border-l-(--primary) bg-(--primary)/5">
        <CardContent className="flex items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-(--primary)/20 flex items-center justify-center shrink-0">
              <FaCar className="w-6 h-6 text-(--primary)" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-(--foreground) text-lg">¿Quieres ser conductor?</h3>
              <p className="text-sm text-(--muted-foreground)">
                Comparte tus viajes y genera ingresos extra mientras ayudas a otros universitarios
              </p>
            </div>
          </div>
          <Button
            onClick={onDriverApplicationClick}
            className="bg-(--primary) hover:bg-(--primary)/90 text-white shrink-0"
          >
            Solicitar ahora
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Si la verificación se completó, mostrar tarjeta indicando que inicie sesión
  if (verificationCompleted) {
    const handleLogout = async () => {
      const response = await logoutAction();

      if (response.success) {
        logout();
        redirect('/');
      } else {
        toast.error(response.message);
      }
    };

    return (
      <Card className="border-l-4 border-l-green-500 bg-green-100/20">
        <CardContent className="flex items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <FaCheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-(--foreground) text-lg">¡Verificación completada!</h3>
              <p className="text-sm text-(--muted-foreground)">
                Para obtener los beneficios de tu cuenta verificada, por favor vuelve a iniciar sesión
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-green-600 hover:bg-green-700 text-white shrink-0 gap-2"
          >
            <LogOut className="w-4 h-4" />
            Reiniciar sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Si es USER (no verificado), mostrar tarjeta de verificación
  if (isUserRole && !verificado) {
    return (
      <>
        <FullScreenLoader isOpen={isLoading} message="Enviando código de verificación..." />

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-(--destructive)/10 border border-(--destructive)/20 rounded-lg text-(--destructive) text-sm mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card className="border-l-4 border-l-yellow-500 bg-yellow-100/20 ">
          <CardContent className="flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                <FaCheckCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-(--foreground) text-lg">Completa tu verificación</h3>
                <p className="text-sm text-(--muted-foreground)">
                  Verifica tu identidad para desbloquear todas las funciones y acceder a más viajes disponibles
                </p>
              </div>
            </div>
            <Button
              onClick={handleRequestVerification}
              disabled={isLoading}
              variant="outline"
              className="shrink-0"
            >
              Verificar ahora
            </Button>
          </CardContent>
        </Card>
        <VerificationModal
          open={verificationModalOpen}
          onOpenChange={(newOpen) => {
            // Cuando el modal se cierra (newOpen = false y estaba abierto)
            if (!newOpen && verificationModalOpen) {
              setVerificationModalOpen(false);
              // Mostrar la tarjeta de verificación completada
              setTimeout(() => {
                setVerificationCompleted(true);
              }, 100);
            } else {
              setVerificationModalOpen(newOpen);
            }
          }}
        />
      </>
    );
  }

  return null;
};

