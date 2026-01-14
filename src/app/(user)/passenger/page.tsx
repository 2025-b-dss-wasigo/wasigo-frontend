'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Star, Eye, EyeOff, Copy, Check, CheckIcon, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '../../../store/authStore';
import { getMyBookings } from '@/actions';
import { Booking } from '@/interfaces';
import { toast } from 'sonner';
import { PassengerPaymentsSection } from '@/components/passenger/PassengerPaymentsSection';

export default function PassengerDashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [visibleOTP, setVisibleOTP] = useState<string | null>(null);
  const [copiedOTP, setCopiedOTP] = useState<string | null>(null);

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

  const handleVerEnMapa = (viajeId: string) => {
    router.push(`/passenger/route/${viajeId}`);
  };

  const toggleOTPVisibility = (bookingId: string) => {
    setVisibleOTP(visibleOTP === bookingId ? null : bookingId);
  };

  const copyOTP = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOTP(otp);
    toast.success('Código OTP copiado');
    setTimeout(() => setCopiedOTP(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">

        {/* Próximo Viaje */}
        {proximoViaje ? (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-(--foreground)">Tu Próximo Viaje</h3>
            <div className="rounded-lg border border-(--border) bg-(--background) p-6 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Detalles */}
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-(--primary)" />
                      <h4 className="font-semibold text-lg text-(--foreground)">
                        {proximoViaje.route.origen} → {proximoViaje.route.destinoBase}
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm text-(--muted-foreground)">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-(--primary)" />
                        <span>{proximoViaje.route.fecha} a las {proximoViaje.route.horaSalida}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-(--primary)" />
                        <span>Precio: <strong className="text-(--foreground)">${proximoViaje.route.precioPasajero}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Conductor */}
                  <div className="border-t border-(--border) pt-4 mt-4">
                    <p className="text-xs font-semibold text-(--muted-foreground) mb-3 uppercase">Conductor</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-(--primary) to-[#1a9970] rounded-full flex items-center justify-center text-white font-bold">
                        {proximoViaje.route.driver.user.alias.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-(--foreground)">@{proximoViaje.route.driver.user.alias}</p>
                        <div className="flex items-center gap-1 text-(--warning) text-sm">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{proximoViaje.route.driver.user.profile.ratingPromedio}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OTP - Solo mostrar si es EFECTIVO y tiene OTP */}
                  {!proximoViaje.otpUsado && proximoViaje.otp && proximoViaje.metodoPago?.toUpperCase() === 'EFECTIVO' && (
                    <div className="border-t border-(--border) pt-4 mt-4">
                      <p className="text-xs font-semibold text-(--muted-foreground) mb-3 uppercase">Tu código OTP</p>
                      <div className="flex items-center justify-between bg-(--primary)/5 p-3 rounded-lg border border-(--primary)/10">
                        <div>
                          {visibleOTP === proximoViaje.publicId ? (
                            <p className="text-2xl font-bold text-(--primary) tracking-wider font-mono">{proximoViaje.otp}</p>
                          ) : (
                            <p className="text-2xl font-bold text-(--primary) tracking-wider font-mono">{'•'.repeat(proximoViaje.otp.length)}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleOTPVisibility(proximoViaje.publicId)}
                            title={visibleOTP === proximoViaje.publicId ? 'Ocultar OTP' : 'Mostrar OTP'}
                          >
                            {visibleOTP === proximoViaje.publicId ? (
                              <Eye className="w-5 h-5" />
                            ) : (
                              <EyeOff className="w-5 h-5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyOTP(proximoViaje.otp!)}
                            title="Copiar OTP"
                          >
                            {copiedOTP === proximoViaje.otp ? (
                              <Check className="w-5 h-5 text-success" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OTP - Mostrar si CONFIRMADA y otpUsado es true */}
                  {proximoViaje.otpUsado && proximoViaje.otp && proximoViaje.estado?.toUpperCase() === 'CONFIRMADA' && (
                    <div className="border-t border-(--border) pt-4 mt-4">
                      <p className="text-xs font-semibold text-(--muted-foreground) mb-3 uppercase">Tu código OTP</p>
                      <div className="flex items-center justify-between bg-(--primary)/5 p-3 rounded-lg border border-(--primary)/10">
                        <div>
                          {visibleOTP === proximoViaje.publicId ? (
                            <p className="text-2xl font-bold text-(--primary) tracking-wider font-mono">{proximoViaje.otp}</p>
                          ) : (
                            <p className="text-2xl font-bold text-(--primary) tracking-wider font-mono">{'•'.repeat(proximoViaje.otp.length)}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleOTPVisibility(proximoViaje.publicId)}
                            title={visibleOTP === proximoViaje.publicId ? 'Ocultar OTP' : 'Mostrar OTP'}
                          >
                            {visibleOTP === proximoViaje.publicId ? (
                              <Eye className="w-5 h-5" />
                            ) : (
                              <EyeOff className="w-5 h-5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyOTP(proximoViaje.otp!)}
                            title="Copiar OTP"
                          >
                            {copiedOTP === proximoViaje.otp ? (
                              <Check className="w-5 h-5 text-success" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-3 md:justify-center">
                  {proximoViaje.paymentStatus === 'PENDING' && (proximoViaje.metodoPago?.toUpperCase() === 'PAYPAL' || proximoViaje.metodoPago?.toUpperCase() === 'TARJETA') ? (
                    <Button
                      onClick={() => router.push('/passenger/my-trips')}
                      className="bg-(--warning) hover:bg-(--warning)/90 text-white w-full font-semibold flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pagar
                    </Button>
                  ) : proximoViaje.otpUsado && proximoViaje.estado?.toUpperCase() === 'CONFIRMADA' ? (
                    <Button
                      onClick={() => handleVerEnMapa(proximoViaje.publicId)}
                      className="bg-(--primary) hover:bg-(--primary)/90 text-white w-full font-semibold flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Ver en Mapa
                    </Button>
                  ) : null}
                  <Button
                    onClick={() => router.push('/passenger/my-trips')}
                    variant="outline"
                    className="w-full"
                  >
                    Ver todos
                  </Button>
                </div>
              </div>
            </div>
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
    </div>
  );
}