'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PayPalButton } from './PayPalButton';
import { useRouter } from 'next/navigation';

interface PayPalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentId: string;
  bookingId: string;
  idempotencyKey: string;
  destinoBase: string;
}

export function PayPalModal({
  open,
  onOpenChange,
  paymentId,
  bookingId,
  idempotencyKey,
  destinoBase,
}: PayPalModalProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = () => {
    setIsProcessing(false);
    onOpenChange(false);

    // Esperar un poco para asegurar que el backend haya procesado el pago
    setTimeout(() => {
      // Usar router.refresh para refrescar los datos del servidor
      router.refresh();
      // Luego redirigir a mis viajes
      router.push('/passenger/my-trips');
    }, 500);
  };

  const handlePaymentError = (error: any) => {
    setIsProcessing(false);
    console.error('Payment error:', error);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagar con PayPal</DialogTitle>
          <DialogDescription>
            Completa tu pago para reservar tu viaje a {destinoBase}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <PayPalButton
            paymentId={paymentId}
            bookingId={bookingId}
            idempotencyKey={idempotencyKey}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
