'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2, XCircle, User, MapPin, Clock,
  AlertCircle, Car, X, Copy, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { getRouteBookings, markBookingAsNoShow, completeBooking } from '@/actions/drivers/getRouteBookings';
import { verifyOtp } from '@/actions';
import { RouteBooking } from '@/interfaces/bookings-route.interface';

interface Ruta {
  publicId: string;
  origen: 'EL_BOSQUE' | 'CAMPUS_PRINCIPAL';
  fecha: string;
  horaSalida: string;
  destinoBase: string;
  asientosTotales: number;
  asientosDisponibles: number;
  precioPasajero: string;
  estado: string;
}

interface ValidateOTPContentProps {
  routes: Ruta[];
}

export function ValidateOTPContent({ routes }: ValidateOTPContentProps) {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [bookings, setBookings] = useState<RouteBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [processedBookings, setProcessedBookings] = useState<Record<string, 'validated' | 'noshow'>>({});
  const [otpByPassenger, setOtpByPassenger] = useState<Record<string, string>>({});
  const [passengerInOtpMode, setPassengerInOtpMode] = useState<string | null>(null);
  const [validatingOtp, setValidatingOtp] = useState(false);
  const [copiedOtpId, setCopiedOtpId] = useState<string | null>(null);

  const currentRoute = routes.find(r => r.publicId === selectedRoute);

  // Mapear origen a nombre legible
  const getOrigenLabel = (origen: string) => {
    const labels: Record<string, string> = {
      'CAMPUS_PRINCIPAL': 'Campus Principal',
      'EL_BOSQUE': 'Campus El Bosque'
    };
    return labels[origen] || origen;
  };

  // Cargar bookings cuando se selecciona una ruta
  useEffect(() => {
    if (selectedRoute) {
      loadBookings();
    }
  }, [selectedRoute]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await getRouteBookings(selectedRoute!);
      setBookings(response.data?.data || []);
      setProcessedBookings({});
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'No se pudieron cargar los pasajeros',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOtpInput = (bookingId: string) => {
    setPassengerInOtpMode(bookingId);
    setOtpByPassenger(prev => ({ ...prev, [bookingId]: '' }));
  };

  const handleValidateOtp = async (bookingId: string) => {
    const otp = otpByPassenger[bookingId];

    if (!otp.trim()) {
      toast.error('Error', {
        description: 'Por favor ingresa el código OTP',
      });
      return;
    }

    setValidatingOtp(true);
    try {
      // Enviar el OTP al backend para validación
      const response = await verifyOtp(bookingId, otp.trim());

      if (!response.success) {
        toast.error('Error', {
          description: response.message || 'El código OTP es incorrecto',
        });
        return;
      }

      // Si la validación es exitosa, completar la reserva
      await completeBooking(bookingId);
      setProcessedBookings(prev => ({ ...prev, [bookingId]: 'validated' }));
      toast.success('OTP validado', {
        description: 'El pasajero ha sido verificado para este viaje.'
      });
      setPassengerInOtpMode(null);
      setOtpByPassenger(prev => ({ ...prev, [bookingId]: '' }));
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'No se pudo validar el OTP',
      });
    } finally {
      setValidatingOtp(false);
    }
  };

  const handleCancelOtp = (bookingId: string) => {
    setPassengerInOtpMode(null);
    setOtpByPassenger(prev => ({ ...prev, [bookingId]: '' }));
  };

  const handleCopyOtp = (otp: string, bookingId: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtpId(bookingId);
    toast.success('Código copiado', {
      description: 'El código OTP ha sido copiado al portapapeles'
    });
    setTimeout(() => setCopiedOtpId(null), 2000);
  };

  const handleNoShow = async (bookingId: string) => {
    setLoading(true);
    try {
      await markBookingAsNoShow(bookingId);
      setProcessedBookings(prev => ({ ...prev, [bookingId]: 'noshow' }));
      toast.success('Pasajero marcado como no presentado', {
        description: 'El pasajero ha sido registrado como no presentado.'
      });
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'No se pudo marcar como no presentado',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = () => {
    const allProcessed = bookings.every(b => processedBookings[b.publicId]);
    if (!allProcessed) {
      toast.error('Pasajeros pendientes', {
        description: 'Todos los pasajeros deben estar validados o marcados como no presentados.'
      });
      return;
    }

    toast.success('¡Viaje iniciado!', {
      description: 'Todos los pasajeros han sido procesados. ¡Buen viaje!'
    });
  };

  return (
    <>
      {loading && <FullScreenLoader />}

      {/* Route Selection */}
      {!selectedRoute ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Selecciona una ruta activa</h2>
          {routes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tienes rutas activas en este momento</p>
                <Button className="mt-4" onClick={() => window.location.href = '/driver/create-route'}>
                  Crear nueva ruta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {routes.map(route => (
                <Card
                  key={route.publicId}
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary"
                  onClick={() => setSelectedRoute(route.publicId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Car className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{getOrigenLabel(route.origen)} → {route.destinoBase}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {route.horaSalida}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">Seleccionar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selected Route Info */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {currentRoute && getOrigenLabel(currentRoute.origen)} → {currentRoute?.destinoBase}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentRoute?.fecha} a las {currentRoute?.horaSalida}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedRoute(null)}>
                  Cambiar ruta
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Passengers List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Pasajeros ({bookings.length})</h2>
              <div className="text-sm text-muted-foreground">
                {Object.values(processedBookings).length} / {bookings.length} procesados
              </div>
            </div>

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay pasajeros confirmados para esta ruta</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {bookings.map(booking => {
                  const isProcessed = processedBookings[booking.publicId];
                  const isValidated = isProcessed === 'validated';
                  const isNoShow = isProcessed === 'noshow';

                  return (
                    <Card
                      key={booking.publicId}
                      className={`${isValidated ? 'border-success/50 bg-success/5' : ''} ${isNoShow ? 'border-destructive/50 bg-destructive/5' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Passenger Info */}
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${isValidated
                              ? 'bg-success/20 text-success'
                              : isNoShow
                                ? 'bg-destructive/20 text-destructive'
                                : 'bg-muted text-muted-foreground'
                              }`}>
                              {isValidated ? <CheckCircle2 className="w-6 h-6" /> : isNoShow ? <XCircle className="w-6 h-6" /> : booking.passenger.alias.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{booking.passenger.alias}</p>
                              <p className="text-sm text-muted-foreground">{booking.metodoPago}</p>
                              {/* OTP Display */}
                              {booking.otp && (
                                <div className="mt-2 flex items-center gap-2 bg-muted/50 rounded-md px-3 py-1.5">
                                  <code className="text-sm font-mono font-bold text-foreground">{booking.otp}</code>
                                  <button
                                    onClick={() => handleCopyOtp(booking.otp, booking.publicId)}
                                    className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1"
                                    title="Copiar OTP"
                                  >
                                    {copiedOtpId === booking.publicId ? (
                                      <Check className="w-4 h-4 text-success" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          {!isProcessed ? (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleOpenOtpInput(booking.publicId)}
                                disabled={validatingOtp || passengerInOtpMode === booking.publicId}
                              >
                                Validar OTP
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleNoShow(booking.publicId)}
                                disabled={loading}
                              >
                                No se presentó
                              </Button>
                            </div>
                          ) : isValidated ? (
                            <div className="flex items-center gap-2 text-success">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="font-medium">Validado</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-destructive">
                              <XCircle className="w-5 h-5" />
                              <span className="font-medium">No presentado</span>
                            </div>
                          )}
                        </div>

                        {/* OTP Input - Mostrar solo si está en modo OTP */}
                        {passengerInOtpMode === booking.publicId && !isProcessed && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="space-y-3">
                              <label className="text-sm font-medium text-foreground block">
                                Código OTP para {booking.passenger.alias}
                              </label>
                              <Input
                                type="text"
                                placeholder="Ingresa el código OTP"
                                value={otpByPassenger[booking.publicId] || ''}
                                onChange={(e) => setOtpByPassenger(prev => ({ ...prev, [booking.publicId]: e.target.value }))}
                                disabled={validatingOtp}
                                maxLength={10}
                                className="text-center text-lg tracking-widest"
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleCancelOtp(booking.publicId)}
                                  disabled={validatingOtp}
                                  className="flex-1"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={() => handleValidateOtp(booking.publicId)}
                                  disabled={!otpByPassenger[booking.publicId]?.trim() || validatingOtp}
                                  className="flex-1"
                                >
                                  {validatingOtp ? 'Validando...' : 'Confirmar OTP'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Start Trip Button */}
          {bookings.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">¿Listo para iniciar el viaje?</p>
                    <p className="text-sm text-muted-foreground">
                      {Object.values(processedBookings).length === bookings.length
                        ? 'Todos los pasajeros han sido procesados'
                        : 'Algunos pasajeros están pendientes'
                      }
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleStartTrip}
                    className="w-full sm:w-auto"
                    disabled={loading}
                  >
                    <Car className="w-5 h-5 mr-2" />
                    Iniciar Viaje
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
