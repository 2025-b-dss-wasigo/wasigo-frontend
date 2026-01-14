'use server';

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';

export interface PayoutRequestData {
  amount: number;
  idempotencyKey: string;
}

export interface PayoutData {
  payoutId: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface PayoutRequestResponse extends ApiResponse<PayoutData> { }

export async function requestPayout(data: PayoutRequestData): Promise<PayoutRequestResponse> {
  try {
    const response = await fetchWithToken<PayoutData>('/payouts/request', {
      method: 'POST',
      headers: {
        'Idempotency-Key': data.idempotencyKey,
      },
      body: JSON.stringify({ amount: data.amount }),
    });

    return response;
  } catch (error) {
    console.error('Error requesting payout:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to request payout',
      message: 'Error al procesar la solicitud de retiro. Intenta nuevamente.',
      data: null as any,
      timestamp: new Date().toISOString(),
    };
  }
}
