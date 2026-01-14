'use server'

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';
import { CreatePaymentRequest, PaymentResponseData } from '@/interfaces/payments/payment.interface';

export async function createPayment(
  data: CreatePaymentRequest,
  idempotencyKey: string
): Promise<ApiResponse<PaymentResponseData>> {
  try {
    const result = await fetchWithToken<PaymentResponseData>('/payments', {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    });

    return result;
  } catch (error) {
    console.error('Error creating payment:', error);
    return {
      success: false,
      error: null,
      message: 'Error al crear el pago',
      data: null as any,
      timestamp: new Date().toISOString(),
    };
  }
}
