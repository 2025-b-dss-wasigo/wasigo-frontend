'use server'

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';
import { PayPalCreateOrderResponse } from '@/interfaces/payments/payment.interface';

export async function createPayPalOrder(
  paymentId: string,
  idempotencyKey: string
): Promise<ApiResponse<PayPalCreateOrderResponse>> {
  try {
    const result = await fetchWithToken<PayPalCreateOrderResponse>(
      `/payments/${paymentId}/paypal/create?Idempotency-Key=${idempotencyKey}`,
      {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({}),
      }
    );

    return result;

  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return {
      success: false,
      error: null,
      message: 'Error al crear la orden PayPal',
      data: null as any,
      timestamp: new Date().toISOString(),
    };
  }
}
