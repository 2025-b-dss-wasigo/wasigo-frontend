import { Suspense } from 'react';
import { DriverHomeContent } from '@/components/driver/DriverHomeContent';
import { DriverHomeSkeleton } from '@/components/common/SkeletonLoaders';
import { ClientOnly } from '@/components/common/ClientOnly';
import { obtenerRutasActivas, obtenerEstadisticasConductor } from '@/lib/driverData';

export const dynamic = 'force-dynamic';

async function DriverHomeData() {
  const conductorId = '2'; // En producción vendría del contexto de auth
  const rutasActivas = await obtenerRutasActivas(conductorId);
  const estadisticas = await obtenerEstadisticasConductor(conductorId);

  const stats = {
    rutasActivas: estadisticas.rutasActivas,
    viajesCompletados: estadisticas.viajesCompletados,
    fondosDisponibles: estadisticas.disponible,
    calificacion: estadisticas.calificacion
  };

  return (
    <ClientOnly fallback={<DriverHomeSkeleton />}>
      <DriverHomeContent rutasActivas={rutasActivas} stats={stats} />
    </ClientOnly>
  );
}

export default async function HomePage() {
  return (
    <Suspense fallback={<DriverHomeSkeleton />}>
      <DriverHomeData />
    </Suspense>
  );
}
