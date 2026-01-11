'use server'

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse } from '@/interfaces';
import { GetMyRoutesResponse } from '@/interfaces/responses/routes/GetMyRoutesResponse.interface';
import { createErrorResponse } from '@/lib/action-helpers';

export async function getMyRoutes(): Promise<ApiResponse<GetMyRoutesResponse>> {
  try {
    const result = await fetchWithToken<GetMyRoutesResponse>('/routes/my', {
      method: 'GET',
    });
    return result;
  } catch (error) {
    return createErrorResponse<GetMyRoutesResponse>('Ocurrió un error al cargar tus rutas. Intenta nuevamente.');
  }
}
