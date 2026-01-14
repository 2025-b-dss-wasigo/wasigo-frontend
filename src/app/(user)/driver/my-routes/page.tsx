import { Suspense } from 'react';
import { MyRoutesContent } from '@/components/driver/MyRoutesContent';
import { MyRoutesSkeleton } from '@/components/common/SkeletonLoaders';
import { getMyRoutes } from '@/actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mis Rutas',
  description: 'Visualiza tus rutas.',
};

async function MyRoutesData() {
  const response = await getMyRoutes();

  if (!response.success || !response.data) {
    return (
      <div className="text-center py-12 text-(--muted-foreground)">
        Error al cargar las rutas. Intenta nuevamente.
      </div>
    );
  }

  const routes = response.data.data || [];

  return <MyRoutesContent routes={routes} />;
}

export default async function MisRutasPage() {
  return (
    <Suspense fallback={<MyRoutesSkeleton />}>
      <MyRoutesData />
    </Suspense>
  );
}
