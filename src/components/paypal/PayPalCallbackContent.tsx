'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { capturePayPalPayment } from '@/actions/passenger/capturePayPalPayment';
import { toast } from 'sonner';

export function PayPalCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const procesarPago = async () => {
      try {
        // Obtener datos del sessionStorage
        const paymentId = sessionStorage.getItem('paymentId');
        const idempotencyKey = sessionStorage.getItem('idempotencyKey');
        const bookingId = sessionStorage.getItem('bookingId');
        const paypalOrderId = searchParams.get('token');

        if (!paymentId || !idempotencyKey || !paypalOrderId) {
          toast.error('Datos de pago incompletos');
          router.push('/passenger/my-trips');
          return;
        }

        // Capturar el pago en PayPal
        const captureResponse = await capturePayPalPayment(
          paymentId,
          idempotencyKey,
          { paypalOrderId }
        );

        // Limpiar sessionStorage
        sessionStorage.removeItem('paymentId');
        sessionStorage.removeItem('idempotencyKey');
        sessionStorage.removeItem('bookingId');

        if (captureResponse.success) {
          toast.success('Pago realizado exitosamente', {
            description: 'Tu viaje ha sido confirmado',
          });
          router.push('/passenger/my-trips');
        } else {
          toast.error(captureResponse.message || 'Error al capturar el pago');
          router.push('/passenger/my-trips');
        }
      } catch (error) {
        console.error('Error en PayPal callback:', error);
        toast.error('Error procesando el pago');
        router.push('/passenger/my-trips');
      } finally {
        setIsProcessing(false);
      }
    };

    procesarPago();
  }, [router, searchParams]);

  return (
    <FullScreenLoader
      message="Procesando tu pago con PayPal..."
    />
  );
}
