import { Suspense } from 'react';
import { PassengerProfileServer } from '@/components/passenger/PassengerProfileServer';
import {
  ProfileHeaderSkeleton,
  ProfileAlertSkeleton,
  ProfileTabsSkeleton,
} from '@/components/passenger/ProfileSkeleton';

export default function PassengerProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-(--foreground)">Mi Perfil</h1>
          <ProfileHeaderSkeleton />
          <ProfileAlertSkeleton />
          <ProfileTabsSkeleton />
        </div>
      }
    >
      <PassengerProfileServer />
    </Suspense>
  );
}