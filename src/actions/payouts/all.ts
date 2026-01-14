'use server';

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';

export interface PayoutDriverInfo {
  publicId: string;
  businessUserId: string;
  paypalEmail: string;
  estado: string;
  fechaSolicitud: string;
  fechaAprobacion: string | null;
  fechaRechazo: string | null;
  motivoRechazo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutAdmin {
  publicId: string;
  driverId: string;
  driver: PayoutDriverInfo;
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

export interface PayoutsData {
  data: PayoutAdmin[];
  total: number;
}

export interface PayoutsResponse extends ApiResponse<PayoutsData> { }

export async function getAllPayouts(limit?: number): Promise<PayoutsResponse> {
  try {
    const params = limit ? `?limit=${limit}` : '';
    const response = await fetchWithToken<PayoutsData>(`/payouts${params}`);
    return response;
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch payouts',
      message: 'Error al obtener el historial de payouts',
      data: null as any,
      timestamp: new Date().toISOString(),
    };
  }
}
