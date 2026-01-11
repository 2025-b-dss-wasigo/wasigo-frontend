import { fetchWithToken } from '../fetch-with-token';

export async function getRouteMap(routeId: string) {
  try {
    const response = await fetchWithToken<any>(`/routes/${routeId}/map`, {
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
