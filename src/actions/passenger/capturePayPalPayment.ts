'use server'

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';
import { PayPalCaptureRequest, PayPalCaptureResponse } from '@/interfaces/payments/payment.interface';

export async function capturePayPalPayment(
  paymentId: string,
  idempotencyKey: string,
  data: PayPalCaptureRequest
): Promise<ApiResponse<PayPalCaptureResponse>> {
  try {
    const result = await fetchWithToken<PayPalCaptureResponse>(
      `/payments/${paymentId}/paypal/capture?Idempotency-Key=${idempotencyKey}&id=${paymentId}`,
      {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(data),
      }
    );

    return result;

  } catch (error) {
    console.error('Error capturing PayPal payment:');
    return {
      success: false,
      error: null,
      message: 'Error al capturar el pago de PayPal',
      data: null as any,
      timestamp: new Date().toISOString(),
    };
  }
}
