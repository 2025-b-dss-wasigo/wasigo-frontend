import { Suspense } from 'react';
import { ClientOnly } from '@/components/common/ClientOnly';
import { RoutesContent } from '@/components/passenger/RoutesContent';
import { RoutesSearchSkeleton } from '@/components/common/SkeletonLoaders';
import { obtenerRutasDisponibles } from '@/lib/passengerData';

export const dynamic = 'force-dynamic';

export default async function RoutesPage() {
  const rutas = await obtenerRutasDisponibles();

  return (
    <ClientOnly fallback={<RoutesSearchSkeleton />}>
      <RoutesContent rutas={rutas} />
    </ClientOnly>
  );
}
