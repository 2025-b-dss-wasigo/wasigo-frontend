'use client'

import React, { useState } from 'react';
import { BookingCard } from './BookingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { PayPalModal } from '@/components/paypal/PayPalModal';
import {
  Clock,
  CheckSquare,
  Ban,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Booking } from '@/interfaces';

interface MyTripsContentProps {
  bookings: Booking[];
}

export function MyTripsContent({ bookings }: MyTripsContentProps) {
  const [activeTab, setActiveTab] = useState('activos');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paypalModalOpen, setPaypalModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const bookingsActivos = bookings.filter(b => b.estado?.toUpperCase() === 'CONFIRMADA' && b.cancelledAt === null);
  const bookingsCompletados = bookings.filter(b => {
    const isCompleted = b.estado?.toUpperCase() === 'COMPLETADA';
    const notCancelled = !b.cancelledAt;
    return isCompleted && notCancelled;
  });

  const bookingsCancelados = bookings.filter(b => b.cancelledAt !== null);

  const getActiveBookings = () => {
    switch (activeTab) {
      case 'activos': return bookingsActivos;
      case 'completados': return bookingsCompletados;
      case 'cancelados': return bookingsCancelados;
      default: return bookingsActivos;
    }
  };

  const activeBookings = getActiveBookings();

  const handlePayPalPayment = (booking: Booking) => {
    if (booking.metodoPago?.toUpperCase() !== 'PAYPAL' || !booking.paymentId) {
      toast.error('No hay ID de pago disponible');
      return;
    }

    setSelectedBooking(booking);
    setPaypalModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <FullScreenLoader isOpen={paymentLoading} message="Procesando pago con PayPal..." />

      {selectedBooking && (
        <PayPalModal
          open={paypalModalOpen}
          onOpenChange={setPaypalModalOpen}
          paymentId={selectedBooking.paymentId!}
          bookingId={selectedBooking.publicId}
          idempotencyKey={`${selectedBooking.publicId}${selectedBooking.route.driver.user.alias}${selectedBooking.route.fecha.replace(/-/g, '')}`}
          destinoBase={selectedBooking.route.destinoBase}
        />
      )}


      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
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
            {bookingsCompletados.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-(--primary) text-(--primary-foreground) rounded-full">
                {bookingsCompletados.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {activeBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeBookings.map((booking) => (
                <BookingCard
                  key={booking.publicId}
                  booking={booking}
                  onPayPalPayment={handlePayPalPayment}
                  paymentLoading={paymentLoading}
                />
              ))}
            </div>
          ) : (
            <div className="card-elevated p-12 text-center">
              {activeTab === 'activos' && <Clock className="w-12 h-12 mx-auto text-(--muted-foreground) mb-4" />}
              {activeTab === 'completados' && <CheckCircle className="w-12 h-12 mx-auto text-(--muted-foreground) mb-4" />}
              <h3 className="text-lg font-semibold text-(--foreground) mb-2">
                No tienes viajes {activeTab}
              </h3>
              <p className="text-(--muted-foreground)">
                {activeTab === 'activos' && 'Busca rutas disponibles para reservar tu próximo viaje'}
                {activeTab === 'completados' && 'Aquí aparecerán tus viajes completados'}
                {activeTab === 'cancelados' && 'Aquí aparecerán los viajes que canceles'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
