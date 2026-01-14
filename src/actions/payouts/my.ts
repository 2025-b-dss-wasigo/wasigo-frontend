'use server';

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';

export interface PayoutRecord {
  publicId: string;
  period: string;
  amount: string;
  status: string;
  paypalBatchId: string | null;
  attempts: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

export interface PayoutHistoryData {
  data: PayoutRecord[];
}

export interface PayoutHistoryResponse extends ApiResponse<PayoutHistoryData> { }

export async function getPayoutHistory(): Promise<PayoutHistoryResponse> {
  try {
    const response = await fetchWithToken<PayoutHistoryData>('/payouts/my');
    return response;
  } catch (error) {
    console.error('Error fetching payout history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch payout history',
      message: 'Error al obtener el historial de pagos',
      data: null as any,
      timestamp: new Date().toISOString(),
    };
  }
}
