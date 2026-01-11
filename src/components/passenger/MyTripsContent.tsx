'use client'

import React, { useState } from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Car,
  MapPin,
  Clock,
  Star,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { Booking } from '@/interfaces';

interface MyTripsContentProps {
  bookings: Booking[];
}

export function MyTripsContent({ bookings }: MyTripsContentProps) {
  const [copiedOTP, setCopiedOTP] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('activos');
  const [visibleOTP, setVisibleOTP] = useState<string | null>(null);

  // Viajes activos: estado CONFIRMADA sin cancelar
  const bookingsActivos = bookings.filter(b => b.estado?.toUpperCase() === 'CONFIRMADA' && b.cancelledAt === null);
  // Viajes completados: estado FINALIZADA
  const bookingsCompletados = bookings.filter(b => {
    const isFinalized = b.estado?.toUpperCase() === 'FINALIZADA';
    const notCancelled = !b.cancelledAt;
    return isFinalized && notCancelled;
  });
  // Viajes cancelados: con cancelledAt
  const bookingsCancelados = bookings.filter(b => b.cancelledAt !== null);

  console.log('Bookings completos:', bookings);
  console.log('Bookings completados filtrados:', bookingsCompletados);

  const getActiveBookings = () => {
    switch (activeTab) {
      case 'activos': return bookingsActivos;
      case 'completados': return bookingsCompletados;
      case 'cancelados': return bookingsCancelados;
      default: return bookingsActivos;
    }
  };

  const activeBookings = getActiveBookings();

  const copyOTP = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOTP(otp);
    toast.success('Código OTP copiado');
    setTimeout(() => setCopiedOTP(null), 2000);
  };

  const toggleOTPVisibility = (bookingId: string) => {
    setVisibleOTP(visibleOTP === bookingId ? null : bookingId);
  };

  const renderBooking = (booking: Booking) => (
    <div key={booking.publicId} className="card-elevated p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-(--primary)/10 flex items-center justify-center">
            <Car className="w-6 h-6 text-(--primary)" />
          </div>
          <div>
            <p className="font-semibold text-(--foreground)">@{booking.route.driver.user.alias}</p>
            <div className="flex items-center gap-1 text-sm text-(--muted-foreground)">
              <Star className="w-4 h-4 text-(--warning) fill-(--warning)" />
              <span>{booking.route.driver.user.profile.ratingPromedio}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={booking.estado.toLowerCase() as any} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-(--success) mt-1" />
          <div>
            <p className="text-xs text-(--muted-foreground)">Origen</p>
            <p className="font-medium text-(--foreground) text-sm">{booking.route.origen}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-(--destructive) mt-1" />
          <div>
            <p className="text-xs text-(--muted-foreground)">Destino</p>
            <p className="font-medium text-(--foreground) text-sm">{booking.route.destinoBase}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-(--muted-foreground) mb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{booking.route.fecha} • {booking.route.horaSalida}</span>
        </div>
        <span>•</span>
        <span className="capitalize">{booking.metodoPago.toLowerCase()}</span>
      </div>

      {booking.estado?.toUpperCase() === 'CONFIRMADA' && !booking.otpUsado && booking.otp && (
        <div className="flex items-center justify-between p-3 bg-(--primary)/5 rounded-lg border border-(--primary)/10 mb-4">
          <div className="flex-1">
            <p className="text-xs text-(--muted-foreground)">Tu código OTP</p>
            {visibleOTP === booking.publicId ? (
              <p className="text-2xl font-bold text-(--primary) tracking-widest font-mono">{booking.otp}</p>
            ) : (
              <p className="text-2xl font-bold text-(--primary) tracking-widest font-mono">{'•'.repeat(booking.otp.length)}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleOTPVisibility(booking.publicId)}
              title={visibleOTP === booking.publicId ? 'Ocultar OTP' : 'Mostrar OTP'}
            >
              {visibleOTP === booking.publicId ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyOTP(booking.otp!)}
              title="Copiar OTP"
            >
              {copiedOTP === booking.otp ? (
                <CheckCircle className="w-5 h-5 text-(--success)" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-(--border)">
        <p className="text-lg font-bold text-(--primary)">${booking.route.precioPasajero}</p>
        <div className="flex gap-2">
          {booking.estado?.toUpperCase() === 'FINALIZADA' && booking.cancelledAt === null && (
            <>
              <Button variant="ghost" size="sm">
                <AlertTriangle className="w-4 h-4" />
              </Button>
              <Button variant="soft" size="sm">
                <Star className="w-4 h-4" />
                Calificar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-(--foreground) mb-2">Mis Viajes</h2>
        <p className="text-(--muted-foreground)">Gestiona tus reservas y viajes</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="activos" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Activos</span>
            <span className="sm:hidden">Activos</span>
            {bookingsActivos.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-(--primary) text-(--primary-foreground) rounded-full">
                {bookingsActivos.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completados" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Completados</span>
            <span className="sm:hidden">Comp.</span>
          </TabsTrigger>
          <TabsTrigger value="cancelados" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Cancelados</span>
            <span className="sm:hidden">Canc.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {activeBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeBookings.map(renderBooking)}
            </div>
          ) : (
            <div className="card-elevated p-12 text-center">
              {activeTab === 'activos' && <Clock className="w-12 h-12 mx-auto text-(--muted-foreground) mb-4" />}
              {activeTab === 'completados' && <CheckCircle className="w-12 h-12 mx-auto text-(--muted-foreground) mb-4" />}
              {activeTab === 'cancelados' && <XCircle className="w-12 h-12 mx-auto text-(--muted-foreground) mb-4" />}
              <h3 className="text-lg font-semibold text-(--foreground) mb-2">
                No tienes viajes {activeTab}
              </h3>
              <p className="text-(--muted-foreground)">
                {activeTab === 'activos' && 'Busca rutas disponibles para reservar tu próximo viaje'}
                {activeTab === 'completados' && 'Aquí aparecerán tus viajes finalizados'}
                {activeTab === 'cancelados' && 'Aquí aparecerán los viajes que canceles'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
