'use server';

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';

export interface BalanceData {
  availableForWithdrawal: number;
  monthlyEarnings: number;
  pendingCollection: number;
  completedTrips: number;
}

export interface BalanceResponse extends ApiResponse<BalanceData> { }

export async function getPayoutBalance(): Promise<BalanceResponse> {
  try {
    const response = await fetchWithToken<BalanceData>('/payouts/balance');
    return response;
  } catch (error) {
    console.error('Error fetching payout balance:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch payout balance',
      message: 'Error al obtener el saldo disponible',
      data: null as any,
      timestamp: new Date().toISOString(),
    };
  }
}
