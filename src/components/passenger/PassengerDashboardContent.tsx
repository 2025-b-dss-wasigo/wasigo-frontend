'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MapPin, Star, CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { getMyBookings } from '@/actions';
import { Booking } from '@/interfaces';
import { PassengerNextTripCard } from './PassengerNextTripCard';
import { PassengerPaymentsSection } from './PassengerPaymentsSection';

export function PassengerDashboardContent() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Cargar reservas al montar el componente
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await getMyBookings();
        if (response.success && response.data?.data) {
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error('Error al cargar las reservas:', error);
      } finally {
        setLoadingBookings(false);
      }
    };

    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  // Si el usuario es USER (no verificado), mostrar solo la tarjeta de verificación
  if (user?.role === 'USER') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          <div className="rounded-lg border border-(--border) bg-(--background) p-8 text-center">
            <CheckIcon className="w-12 h-12 mx-auto text-(--muted-foreground) mb-3" />
            <h3 className="text-lg font-semibold text-(--foreground) mb-2">Verifica tu cuenta primero</h3>
            <p className="text-(--muted-foreground) mb-4">Una vez que verifiques tu identidad, podrás ver y reservar viajes disponibles</p>
            <Button asChild>
              <Link href="/passenger/profile">Ir a Mi Perfil</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Obtener el próximo viaje más cercano
  const getProximoViaje = () => {
    // Viajes activos con estado CONFIRMADA
    const viajesActivos = bookings.filter(b => b.estado?.toUpperCase() === 'CONFIRMADA' && b.cancelledAt === null);

    if (viajesActivos.length === 0) return null;

    // Ordenar por fecha más cercana
    viajesActivos.sort((a, b) =>
      new Date(a.route.fecha).getTime() - new Date(b.route.fecha).getTime()
    );

    return viajesActivos[0];
  };

  // Obtener viajes completados
  const getViajesCompletados = () => {
    return bookings.filter(
      b => b.estado?.toUpperCase() === 'FINALIZADA' && b.cancelledAt === null
    );
  };

  // Mostrar loader mientras se carga
  if (isLoading || loadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-(--primary) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--muted-foreground)">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada
  if (!isAuthenticated) {
    return null;
  }

  const proximoViaje = getProximoViaje();
  const viajesCompletados = getViajesCompletados();

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      {/* Próximo Viaje */}
      {proximoViaje ? (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-(--foreground)">Tu Próximo Viaje</h3>
          <PassengerNextTripCard booking={proximoViaje} />
        </div>
      ) : (
        <div className="mb-8 rounded-lg border border-(--border) bg-(--background) p-8 text-center">
          <MapPin className="w-12 h-12 mx-auto text-(--muted-foreground) mb-3" />
          <h3 className="text-lg font-semibold text-(--foreground) mb-2">No tienes viajes activos</h3>
          <p className="text-(--muted-foreground) mb-4">Busca rutas disponibles para reservar tu próximo viaje</p>
          <Button asChild>
            <Link href="/passenger/routes">Buscar rutas</Link>
          </Button>
        </div>
      )}

      {/* Viajes Completados */}
      {viajesCompletados.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-(--foreground)">Viajes Completados</h3>
          <div className="space-y-3">
            {viajesCompletados.map((booking) => (
              <div key={booking.publicId} className="rounded-lg border border-(--border) bg-(--background) p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-(--foreground)">{booking.route.origen} → {booking.route.destinoBase}</p>
                    <p className="text-sm text-(--muted-foreground)">{booking.route.fecha}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-(--foreground)">${booking.route.precioPasajero}</p>
                    <div className="flex items-center gap-1 text-(--warning) text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{booking.route.driver.user.profile.ratingPromedio}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Pagos */}
      <div>
        <PassengerPaymentsSection />
      </div>
    </div>
  );
}
