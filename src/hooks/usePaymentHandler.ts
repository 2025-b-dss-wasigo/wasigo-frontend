import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface PaymentHandlerOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePaymentHandler(options?: PaymentHandlerOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const capturePayment = useCallback(
    async (
      orderID: string,
      paymentId: string,
      idempotencyKey: string
    ) => {
      setIsProcessing(true);
      setError(null);

      try {
        const response = await fetch('/api/paypal/orders/capture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKey,
          },
          body: JSON.stringify({
            orderID,
            paymentId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMsg = errorData.error || `HTTP ${response.status}: Payment failed`;
          throw new Error(errorMsg);
        }

        const result = await response.json();

        if (!result.success && result.error) {
          throw new Error(result.error);
        }

        toast.success('¡Pago realizado exitosamente!', {
          description: 'Tu viaje ha sido confirmado',
        });

        setIsProcessing(false);
        options?.onSuccess?.();
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error desconocido');
        setError(error);
        setIsProcessing(false);

        toast.error(error.message || 'Error al completar el pago');
        options?.onError?.(error);

        throw error;
      }
    },
    [options]
  );

  return {
    isProcessing,
    error,
    capturePayment,
  };
}
