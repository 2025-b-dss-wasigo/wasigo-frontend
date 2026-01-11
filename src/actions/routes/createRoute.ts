'use server'

import { fetchWithToken } from '@/actions/fetch-with-token';
import { ApiResponse, CreateRouteRequest } from '@/interfaces';
import { createErrorResponse } from '@/lib/action-helpers';

export async function createRoute(routeData: CreateRouteRequest): Promise<ApiResponse<{ routeId: string }>> {

  console.log("=== CREAR RUTA - DATOS COMPLETOS ===");
  console.log("Origen:", routeData.origen);
  console.log("Destino Base:", routeData.destinoBase);
  console.log("Stops (paradas):", routeData.stops);
  console.log("Coordenadas del destino (lat, lng):", routeData.stops[0]?.lat, routeData.stops[0]?.lng);
  console.log("=== FIN DATOS ===");
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
