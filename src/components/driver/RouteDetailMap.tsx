'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { getRouteBookings, completeBooking } from '@/actions/drivers/getRouteBookings';
import { finalizeRoute } from '@/actions/routes/finalizeRoute';
import { RouteMapVisualizer } from '@/components/maps';
import { RouteBooking } from '@/interfaces/bookings-route.interface';

interface RouteDetailMapProps {
  routeId: string;
  routeDetails: any;
  originCoordinates: { lat: number; lng: number };
  mapData: any;
}

export function RouteDetailMap({
  routeId,
  routeDetails,
  originCoordinates,
  mapData
}: RouteDetailMapProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<RouteBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [completedBookings, setCompletedBookings] = useState<Set<string>>(new Set());

  // Ordenar stops por el campo "orden" de menor a mayor
  const sortedStops = (mapData?.stops || []).sort((a: any, b: any) => {
    const ordenA = a.orden || 0;
    const ordenB = b.orden || 0;
    return ordenA - ordenB;
  });

  // Cargar pasajeros y restaurar estado de confirmación al montar
  useEffect(() => {
    loadBookings();
    // Restaurar completedBookings del sessionStorage
    const saved = sessionStorage.getItem(`completedBookings_${routeId}`);
    if (saved) {
      try {
        setCompletedBookings(new Set(JSON.parse(saved)));
      } catch (error) {
        console.error('Error al restaurar estado:', error);
      }
    }
  }, [routeId]);

  // Persistir completedBookings en sessionStorage cuando cambie
  useEffect(() => {
    sessionStorage.setItem(
      `completedBookings_${routeId}`,
      JSON.stringify(Array.from(completedBookings))
    );
  }, [completedBookings, routeId]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await getRouteBookings(routeId);
      setBookings(response.data?.data || []);
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'No se pudieron cargar los pasajeros',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar pasajeros que deben aparecer en el mapa: otpUsado === true
  const visibleBookings = bookings.filter(b => b.otpUsado);

  const handleConfirmStop = async (bookingId: string) => {
    setLoading(true);
    try {
      await completeBooking(bookingId);
      setCompletedBookings(prev => new Set(prev).add(bookingId));
      toast.success('Estación confirmada', {
        description: 'El pasajero ha confirmado su llegada a la estación.'
      });
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'No se pudo confirmar la estación',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndRoute = async () => {
    // Si hay pasajeros, todos deben estar confirmados
    if (visibleBookings.length > 0 && completedBookings.size !== visibleBookings.length) {
      toast.error('Pasajeros pendientes', {
        description: 'Todos los pasajeros deben ser confirmados antes de finalizar.'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await finalizeRoute(routeId);

      if (response.success) {
        // Limpiar sessionStorage después de finalizar
        sessionStorage.removeItem(`completedBookings_${routeId}`);

        // Redirigir al inicio (driver home)
        router.push('/driver');
      } else {
        toast.error('Error', {
          description: response.message || 'No se pudo finalizar la ruta'
        });
      }
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'No se pudo finalizar la ruta',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0 h-96">
              <RouteMapVisualizer
                originCoordinates={originCoordinates}
                stops={sortedStops}
              />
            </CardContent>
          </Card>
        </div>

        {/* Lista de Pasajeros */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            Pasajeros ({visibleBookings.length})
          </h2>

          {visibleBookings.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">No hay pasajeros confirmados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {visibleBookings.map(booking => {
                const isCompleted = completedBookings.has(booking.publicId);

                return (
                  <Card
                    key={booking.publicId}
                    className={isCompleted ? 'border-success/50 bg-success/5' : ''}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {booking.passenger.alias}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.metodoPago}
                          </p>
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                        )}
                      </div>

                      <Button
                        onClick={() => handleConfirmStop(booking.publicId)}
                        disabled={isCompleted || loading}
                        className="w-full"
                        variant={isCompleted ? 'outline' : 'default'}
                      >
                        {isCompleted ? 'Confirmado' : 'Confirmar Estación'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Botón Finalizar Ruta */}
          {routeDetails?.estado !== 'FINALIZADA' && (
            <Card>
              <CardContent className="p-4">
                <Button
                  onClick={handleEndRoute}
                  disabled={loading || (visibleBookings.length > 0 && completedBookings.size !== visibleBookings.length)}
                  className="w-full"
                  size="lg"
                >
                  Finalizar Ruta
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
