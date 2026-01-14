import { fetchWithToken } from '../fetch-with-token';
import { ApiResponse } from '@/interfaces';
import { RouteMapData } from '@/interfaces/responses/routes/RouteMapResponse.interface';

export async function getRouteMap(routeId: string): Promise<ApiResponse<RouteMapData>> {
  try {
    const response = await fetchWithToken<RouteMapData>(`/routes/${routeId}/map`, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener el mapa de la ruta');
    }

    return response;
  } catch (error) {
    throw error;
  }
}
