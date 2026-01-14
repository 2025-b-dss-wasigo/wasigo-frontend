'use server';

import { fetchWithToken } from '../fetch-with-token';
import { ApiResponse } from '@/interfaces';

export async function finalizeRoute(routeId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetchWithToken<any>(`/routes/${routeId}/finalize`, {
      method: 'PATCH',
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al finalizar la ruta');
    }

    return response;
  } catch (error) {
    throw error;
  }
}
