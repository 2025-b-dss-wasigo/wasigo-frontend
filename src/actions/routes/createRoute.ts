'use server'

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse, CreateRouteRequest } from '@/interfaces';
import { createErrorResponse } from '@/lib/action-helpers';

export async function createRoute(routeData: CreateRouteRequest): Promise<ApiResponse<{ routeId: string }>> {

  try {

    const result = await fetchWithToken<{ routeId: string }>('/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });

    return result;

  } catch (error) {

    return createErrorResponse<{ routeId: string }>('Ocurrió un error al crear la ruta. Intenta nuevamente.');

  }
}
