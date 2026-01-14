import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { ClientOnly } from '@/components/common/ClientOnly';
import { MyTripsContent } from '@/components/passenger/MyTripsContent';
import { MyTripsSkeleton } from '@/components/common/SkeletonLoaders';
import { getMyBookings } from '@/actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mis Viajes',
  description: 'Visualiza todos tus viajes reservados, activos y completados',
};

export default async function MyTripsPage() {
  const response = await getMyBookings();

  if (!response.success) {
    redirect('/login');
  }

  const bookings = response.data?.data || [];

  return (
    <ClientOnly fallback={<MyTripsSkeleton />}>
      <MyTripsContent bookings={bookings} />
    </ClientOnly>
  );
}
