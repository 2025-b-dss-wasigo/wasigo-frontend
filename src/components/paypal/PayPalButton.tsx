'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { usePaymentHandler } from '@/hooks/usePaymentHandler';

interface PayPalButtonProps {
  paymentId: string;
  idempotencyKey: string;
  bookingId: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

function PayPalButtonContent({
  paymentId,
  idempotencyKey,
  bookingId,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const [{ isPending, isResolved }] = usePayPalScriptReducer();
  const { capturePayment } = usePaymentHandler({ onSuccess, onError });

  const handleCreateOrder = async (data: any) => {
    try {

      const response = await fetch('/api/paypal/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          paymentId,
          idempotencyKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create order`);
      }

      const order = await response.json();

      if (order.data?.paypalOrderId) {
        // Guardar datos en sessionStorage
        sessionStorage.setItem('paymentId', paymentId);
        sessionStorage.setItem('idempotencyKey', idempotencyKey);
        sessionStorage.setItem('bookingId', bookingId);

        return order.data.paypalOrderId;
      } else {
        throw new Error(order.message || order.error || 'Fallo al crear la orden');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear la orden de pago';
      toast.error(errorMsg);
      throw error;
    }
  };

  const handleApproveOrder = async (data: any) => {
    try {
      await capturePayment(data.orderID, paymentId, idempotencyKey);
    } catch (error) {
      console.error('Error in approve handler:', error);
    }
  };

  const handleError = (error: any) => {
    console.error('PayPal error:', error);
    toast.error('Error en el proceso de pago');
    onError?.(error);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando PayPal...</span>
      </div>
    );
  }

  if (!isResolved) {
    return (
      <div className="text-center py-6 text-red-500">
        Error: PayPal SDK no pudo cargar. Verifica tu conexión.
      </div>
    );
  }

  return (
    <PayPalButtons
      createOrder={handleCreateOrder}
      onApprove={handleApproveOrder}
      onError={handleError}
      style={{
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay',
      }}
    />
  );
}

export function PayPalButton(props: PayPalButtonProps) {
  return <PayPalButtonContent {...props} />;
}
