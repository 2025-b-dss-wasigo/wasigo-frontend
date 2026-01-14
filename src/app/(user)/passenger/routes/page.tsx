export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Buscar Rutas',
  description: 'Encuentra y reserva rutas disponibles para tu próximo viaje',
};

import { ClientOnly } from '@/components/common/ClientOnly';
import { RoutesContent } from '@/components/passenger/RoutesContent';
import { RoutesSearchSkeleton } from '@/components/common/SkeletonLoaders';


export default async function RoutesPage() {
  return (
    <ClientOnly fallback={<RoutesSearchSkeleton />}>
      <RoutesContent />
    </ClientOnly>
  );
}
