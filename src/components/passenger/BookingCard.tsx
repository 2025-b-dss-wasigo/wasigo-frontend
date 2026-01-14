'use client'

import React, { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Car,
  MapPin,
  Clock,
  Star,
  Copy,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  CreditCard,
  Map,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Booking } from '@/interfaces';
import { RatingModal } from '@/components/passenger/RatingModal';
import { canRate } from '@/actions';

interface BookingCardProps {
  booking: Booking;
  onPayPalPayment: (booking: Booking) => void;
  paymentLoading: boolean;
}

export function BookingCard({ booking, onPayPalPayment, paymentLoading }: BookingCardProps) {

  const [copiedOTP, setCopiedOTP] = useState<string | null>(null);
  const [visibleOTP, setVisibleOTP] = useState<boolean>(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [canRateRoute, setCanRateRoute] = useState(false);
  const [isCheckingRating, setIsCheckingRating] = useState(false);
  const [hasCheckedRating, setHasCheckedRating] = useState(false);

  const copyOTP = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOTP(otp);
    toast.success('Código OTP copiado');
    setTimeout(() => setCopiedOTP(null), 2000);
  };

  const toggleOTPVisibility = () => {
    setVisibleOTP(!visibleOTP);
  };

  const checkCanRate = async () => {
    if (booking.estado?.toUpperCase() !== 'COMPLETADA' || hasCheckedRating) return;

    setIsCheckingRating(true);
    try {
      const response = await canRate(booking.route.publicId);
      if (response.success && response.data) {
        setCanRateRoute(response.data.canRate);
      }
    } catch (error) {
      console.error('Error al verificar si puede calificar:', error);
    } finally {
      setIsCheckingRating(false);
      setHasCheckedRating(true);
    }
  };

  useEffect(() => {
    checkCanRate();
  }, [booking.publicId]);

  const handleRatingSubmitted = () => {
    setRatingModalOpen(false);
    toast.success('¡Gracias por tu calificación!');
    setCanRateRoute(false);
  };

  return (
    <div className="card-elevated p-5">
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
        (booking.metodoPago?.toUpperCase() === 'EFECTIVO' ||
          (booking.metodoPago?.toUpperCase() === 'PAYPAL' && booking.paymentStatus === 'PAID')) && (
          <div className="flex items-center justify-between p-3 bg-(--primary)/5 rounded-lg border border-(--primary)/10 mb-4">
            <div className="flex-1">
              <p className="text-xs text-(--muted-foreground)">Tu código OTP</p>
              {visibleOTP ? (
                <p className="text-2xl font-bold text-(--primary) tracking-widest font-mono">{booking.otp}</p>
              ) : (
                <p className="text-2xl font-bold text-(--primary) tracking-widest font-mono">{'•'.repeat(booking.otp.length)}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleOTPVisibility()}
                title={visibleOTP ? 'Ocultar OTP' : 'Mostrar OTP'}
              >
                {visibleOTP ? (
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
        )
      )}

      {booking.estado?.toUpperCase() === 'CONFIRMADA' && booking.paymentStatus === 'PENDING' &&
        (booking.metodoPago?.toUpperCase() === 'PAYPAL' || booking.metodoPago?.toUpperCase() === 'TARJETA') && (
          <div className="flex items-center gap-3 p-3 bg-(--warning)/5 rounded-lg border border-(--warning)/10 mb-4">
            <AlertTriangle className="w-5 h-5 text-(--warning) shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-(--foreground)">Pago pendiente</p>
              <p className="text-xs text-(--muted-foreground)">Completa el pago para obtener tu código OTP</p>
            </div>
            <Button size="sm" onClick={() => onPayPalPayment(booking)} disabled={paymentLoading}>
              <CreditCard className="w-4 h-4 mr-1" />
              Pagar
            </Button>
          </div>
        )}

      {booking.estado?.toUpperCase() === 'CONFIRMADA' && booking.otpUsado && booking.otp && (
        <div className="flex items-center justify-between p-3 bg-(--primary)/5 rounded-lg border border-(--primary)/10 mb-4">
          <div className="flex-1">
            <p className="text-xs text-(--muted-foreground)">Tu código OTP</p>
            {visibleOTP ? (
              <p className="text-2xl font-bold text-(--primary) tracking-widest font-mono">{booking.otp}</p>
            ) : (
              <p className="text-2xl font-bold text-(--primary) tracking-widest font-mono">{'•'.repeat(booking.otp.length)}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleOTPVisibility()}
              title={visibleOTP ? 'Ocultar OTP' : 'Mostrar OTP'}
            >
              {visibleOTP ? (
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
          {booking.estado?.toUpperCase() === 'CONFIRMADA' && booking.otpUsado && (
            <Button asChild size="sm" variant="soft" className='text-white font-bold'>
              <Link href={`/passenger/route/${booking.publicId}`}>
                <Map className="w-4 h-4 mr-1" />
                Ver en Mapa
              </Link>
            </Button>
          )}
          {booking.estado?.toUpperCase() === 'COMPLETADA' && booking.cancelledAt === null && canRateRoute && (
            <>
              <Button
                variant="soft"
                size="sm"
                className='text-white font-bold'
                onClick={() => setRatingModalOpen(true)}
                disabled={isCheckingRating}
              >
                <Star className="w-4 h-4 text-white font-bold" />
                Calificar
              </Button>
            </>
          )}
        </div>
      </div>

      {booking.estado?.toUpperCase() === 'COMPLETADA' && booking.cancelledAt === null && (
        <RatingModal
          open={ratingModalOpen}
          onOpenChange={setRatingModalOpen}
          routeId={booking.route.publicId}
          driverId={booking.route.driver.user.publicId}
          driverName={booking.route.driver.user.alias}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
}

