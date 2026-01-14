export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getDriverRequests } from '@/actions';
import { getAllPayouts } from '@/actions/payouts';
import { AdminDashboardContent } from '@/components/admin';
import { DriverRequestsListSkeleton, PayoutsListSkeleton } from '@/components/common/SkeletonLoaders';
import { Driver } from '../../../interfaces/responses/admin/GetDriverRequestsResponse';

async function AdminData() {
  const [requestsResponse, payoutsResponse] = await Promise.all([
    getDriverRequests(),
    getAllPayouts(10),
  ]);

  const driverRequests: Driver[] = requestsResponse.success && requestsResponse.data?.drivers ? requestsResponse.data.drivers.slice(0, 5) : [];
  const payouts = payoutsResponse.success && payoutsResponse.data?.data ? payoutsResponse.data.data.slice(0, 5) : [];

  return (
    <AdminDashboardContent
      driverRequests={driverRequests}
      payouts={payouts}
    />
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-(--foreground) mb-2">Panel de Administrador</h2>
        <p className="text-(--muted-foreground)">Gestión general de la plataforma</p>
      </div>

      {/* Content with Suspense for individual sections */}
      <Suspense fallback={<div className="space-y-6"><DriverRequestsListSkeleton /><PayoutsListSkeleton /></div>}>
        <AdminData />
      </Suspense>
    </div>
  );
}
