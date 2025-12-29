import { Suspense } from 'react';
import { ClientOnly } from '@/components/common/ClientOnly';
import { DashboardContent } from '@/components/passenger/DashboardContent';
import { PassengerDashboardSkeleton } from '@/components/common/SkeletonLoaders';
import {
  obtenerEstadisticasPasajero,
  obtenerProximosViajes,
  obtenerRutasDisponibles
} from '@/lib/passengerData';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const pasajeroId = 'pasajero1'; // TODO: Obtener del contexto de autenticación
  const [estadisticas, proximosViajes, rutasDisponibles] = await Promise.all([
    obtenerEstadisticasPasajero(pasajeroId),
    obtenerProximosViajes(pasajeroId),
    obtenerRutasDisponibles(),
  ]);

  return (
    <ClientOnly fallback={<PassengerDashboardSkeleton />}>
      <DashboardContent
        estadisticas={estadisticas}
        proximosViajes={proximosViajes}
        rutasDisponibles={rutasDisponibles}
      />
    </ClientOnly>
  );
}
