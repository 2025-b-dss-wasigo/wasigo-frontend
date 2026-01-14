import { Suspense } from 'react';
import { AdminProfileServer } from '@/components/admin/AdminProfileServer';
import {
  ProfileHeaderSkeleton,
  ProfileAlertSkeleton,
  ProfileTabsSkeleton,
} from '@/components/admin/AdminProfileSkeleton';

export default function AdminProfilePage() {
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
      <AdminProfileServer />
    </Suspense>
  );
}