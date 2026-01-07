import { Suspense } from 'react';
import { MyRoutesContent } from '@/components/driver/MyRoutesContent';
import { MyRoutesSkeleton } from '@/components/common/SkeletonLoaders';
import { ClientOnly } from '@/components/common/ClientOnly';
import { obtenerRutasActivas, obtenerRutasPausadas } from '@/lib/driverData';

export const dynamic = 'force-dynamic';

async function MyRoutesData() {
  const conductorId = '2'; // En producción vendría del contexto de auth
  const rutasActivas = await obtenerRutasActivas(conductorId);
  const rutasPausadas = await obtenerRutasPausadas(conductorId);

  const stats = {
    rutasActivas: rutasActivas.length,
    viajesCompletados: 48,
    gananciasMes: 127.50,
    calificacion: 4.9
  };

  return (
    <ClientOnly fallback={<MyRoutesSkeleton />}>
      <MyRoutesContent
        rutasActivas={rutasActivas}
        rutasPausadas={rutasPausadas}
        stats={stats}
      />
    </ClientOnly>
  );
}

export default async function MisRutasPage() {
  return (
    <Suspense fallback={<MyRoutesSkeleton />}>
      <MyRoutesData />
    </Suspense>
  );
}
