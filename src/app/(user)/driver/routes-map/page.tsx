import { getMyRoutes } from '@/actions';
import { RoutesMapContent } from '@/components/driver/RoutesMapContent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mapas',
  description: 'Visualiza las rutas disponibles para visualizar en el mapa.',
};

export default async function RoutesMapPage() {
  let routes: any[] = [];

  try {
    const response = await getMyRoutes();
    routes = response.data?.data || [];
  } catch (error) {
    console.error('Error fetching routes:', error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ver en el Mapa</h1>
        <p className="text-muted-foreground">Visualiza tus rutas en el mapa</p>
      </div>

      {/* Routes Map Content */}
      <RoutesMapContent routes={routes} />
    </div>
  );
}
