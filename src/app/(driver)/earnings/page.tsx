import { Suspense } from 'react';
import { EarningsContent } from '@/components/driver/EarningsContent';
import { EarningsSkeleton } from '@/components/common/SkeletonLoaders';
import { ClientOnly } from '@/components/common/ClientOnly';
import { obtenerEstadisticasConductor, obtenerTransaccionesConductor } from '@/lib/driverData';

export const dynamic = 'force-dynamic';

async function EarningsData() {
  const conductorId = '2'; // En producción vendría del contexto de auth
  const stats = await obtenerEstadisticasConductor(conductorId);
  const transacciones = await obtenerTransaccionesConductor(conductorId);

  return (
    <ClientOnly fallback={<EarningsSkeleton />}>
      <EarningsContent stats={stats} transacciones={transacciones} />
    </ClientOnly>
  );
}

export default async function EarningsPage() {
  return (
    <Suspense fallback={<EarningsSkeleton />}>
      <EarningsData />
    </Suspense>
  );
}
