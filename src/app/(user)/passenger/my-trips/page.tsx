import { Suspense } from 'react';
import { ClientOnly } from '@/components/common/ClientOnly';
import { MyTripsContent } from '@/components/passenger/MyTripsContent';
import { MyTripsSkeleton } from '@/components/common/SkeletonLoaders';
import { obtenerViajesPasajero } from '@/lib/passengerData';

export const dynamic = 'force-dynamic';

export default async function MyTripsPage() {
  const pasajeroId = 'pasajero1'; // TODO: Obtener del contexto de autenticación
  const viajes = await obtenerViajesPasajero(pasajeroId);

  return (
    <ClientOnly fallback={<MyTripsSkeleton />}>
      <MyTripsContent viajes={viajes} />
    </ClientOnly>
  );
}
