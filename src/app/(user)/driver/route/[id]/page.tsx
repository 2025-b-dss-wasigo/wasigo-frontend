import { getRouteMap } from '@/actions/routes/getRouteMap';
import { getMyRoutes } from '@/actions';
import { RouteDetailMap } from '@/components/driver/RouteDetailMap';

export const dynamic = 'force-dynamic';

interface RouteMapPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RouteMapPage({ params }: RouteMapPageProps) {
  const { id } = await params;

  let routeMapData = null;
  let originCoordinates = null;
  let routeDetails = null;

  try {
    // Obtener datos del mapa (paradas)
    const mapResponse = await getRouteMap(id);
    routeMapData = mapResponse.data;

    // Obtener datos de la ruta para obtener el origen
    const routesResponse = await getMyRoutes();
    const routes = routesResponse.data?.data || [];
    routeDetails = routes.find((r: any) => r.publicId === id);

    // Establecer coordenadas de origen basadas en el campus
    if (routeDetails) {
      const originMap: Record<string, { lat: number; lng: number }> = {
        'CAMPUS_PRINCIPAL': { lat: -0.2094931, lng: -78.4873596 },
        'EL_BOSQUE': { lat: -0.1641702, lng: -78.5007102 }
      };
      originCoordinates = originMap[routeDetails.origen];
    }
  } catch (error) {
    console.error('Error fetching route data:', error);
  }

  if (!routeMapData || !originCoordinates || !routeDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">No se pudieron cargar los datos de la ruta</p>
      </div>
    );
  }

  // Validar si la ruta está finalizada
  if (routeDetails.estado?.toUpperCase() === 'FINALIZADA') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Detalle de Ruta en Mapa</h1>
          <p className="text-muted-foreground">Visualiza tu ruta y confirma las estaciones</p>
        </div>

        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <div className="inline-block w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            📍
          </div>
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Ruta Finalizada</h3>
          <p className="text-yellow-800 mb-4">
            Esta ruta ya ha sido completada y no puede ser visualizada en tiempo real.
          </p>
          <a href="/driver/routes-map">
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
              ← Volver a Ver en el Mapa
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Detalle de Ruta en Mapa</h1>
        <p className="text-muted-foreground">Visualiza tu ruta y confirma las estaciones</p>
      </div>

      <RouteDetailMap
        routeId={id}
        routeDetails={routeDetails}
        originCoordinates={originCoordinates}
        mapData={routeMapData}
      />
    </div>
  );
}
