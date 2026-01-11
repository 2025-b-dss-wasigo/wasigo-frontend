import { fetchWithToken } from '../fetch-with-token';

export async function getActiveRoutes() {
  try {
    const response = await fetchWithToken<any>('/routes/my', {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener rutas');
    }

    // Filtrar solo rutas activas
    const activeRoutes = response.data?.data?.filter((route: any) =>
      route.estado === 'ACTIVA' || route.estado === 'EN_CURSO'
    ) || [];

    return {
      ...response,
      data: activeRoutes,
    };
  } catch (error) {
    throw error;
  }
}
