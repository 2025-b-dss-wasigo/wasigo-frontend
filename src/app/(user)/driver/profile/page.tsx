import { Suspense } from 'react';
import { DriverProfileServer } from '@/components/driver/DriverProfileServer';
import {
  ProfileHeaderSkeleton,
  ProfileAlertSkeleton,
  ProfileTabsSkeleton,
} from '@/components/driver/DriverProfileSkeleton';

export const metadata = {
  title: 'Mi Perfil',
  description: 'Visualiza tu información personal.',
};

export default function DriverProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-(--foreground)">Mi Perfil</h1>
          <ProfileHeaderSkeleton />
          <ProfileTabsSkeleton />
        </div>
      }
    >
      <DriverProfileServer />
    </Suspense>
  );
}