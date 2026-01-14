'use server'

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';
import { CanRateResponse } from '@/interfaces/responses/ratings/CanRateResponse.interface';
import { createErrorResponse } from '@/lib/action-helpers';

export async function canRate(routeId: string): Promise<ApiResponse<CanRateResponse>> {
  try {
    const result = await fetchWithToken<CanRateResponse>(`/ratings/can-rate/${routeId}`, {
      method: 'GET',
    });
    return result;
  } catch (error) {
    return createErrorResponse<CanRateResponse>('Ocurrió un error al verificar si puedes calificar esta ruta.');
  }
}
