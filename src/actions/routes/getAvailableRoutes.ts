'use server'

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse, Route } from '@/interfaces';
import { createErrorResponse } from '@/lib/action-helpers';

export interface AvailableRoutesRequest {
  lat: number;
  lng: number;
  fecha: string;
  radiusKm?: number;
}

interface BackendRoutesResponse {
  data: Route[];
}

export async function getAvailableRoutes(
  data: AvailableRoutesRequest
): Promise<ApiResponse<Route[]>> {
  try {

    const queryParams = new URLSearchParams({
      lat: String(data.lat),
      lng: String(data.lng),
      fecha: data.fecha,
      radiusKm: String(data.radiusKm || 10),
    });

    const result = await fetchWithToken<BackendRoutesResponse>(
      `/routes/available?${queryParams.toString()}`,
      {
        method: 'GET',
      }
    );

    if (result.success && result.data && 'data' in result.data) {

      const routes = result.data.data;

      return {
        error: null,
        success: true,
        message: result.message || 'Rutas encontradas exitosamente',
        data: routes,
        timestamp: result.timestamp || new Date().toISOString()
      };
    }

    return {
      error: null,
      success: true,
      message: result.message || 'Rutas encontradas exitosamente',
      timestamp: result.timestamp || new Date().toISOString()
    };

  } catch (error) {

    console.error('Error al buscar rutas disponibles:', error);
    return createErrorResponse<Route[]>('Error al buscar rutas disponibles. Intenta nuevamente.');

  }
}