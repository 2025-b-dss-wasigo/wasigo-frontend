export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { RequestsContent, RequestsHeader, RequestsTabs } from '@/components/admin/RequestsContent';
import { RequestsCardsSkeleton } from '@/components/common/SkeletonLoaders';
import { getDriverRequests, RequestStatus } from '@/actions/admin/getDriverRequests';

interface RequestsPageProps {
  searchParams: Promise<{ estado?: string }>;
}

async function RequestsContentWrapper({ searchParams }: RequestsPageProps) {
  const params = await searchParams;

  // Validar que el estado sea uno de los válidos
  const validStates: RequestStatus[] = ['PENDIENTE', 'APROBADO', 'RECHAZADO'];
  const currentStatus = (validStates.includes(params.estado as RequestStatus)
    ? params.estado
    : 'PENDIENTE') as RequestStatus;

  const response = await getDriverRequests(currentStatus);
  const drivers = response.data?.drivers || [];

  return <RequestsContent drivers={drivers} currentStatus={currentStatus} />;
}

async function RequestsPageData({ searchParams }: RequestsPageProps) {
  const params = await searchParams;

  // Validar que el estado sea uno de los válidos
  const validStates: RequestStatus[] = ['PENDIENTE', 'APROBADO', 'RECHAZADO'];
  const currentStatus = (validStates.includes(params.estado as RequestStatus)
    ? params.estado
    : 'PENDIENTE') as RequestStatus;

  const response = await getDriverRequests(currentStatus);
  const drivers = response.data?.drivers || [];

  return <RequestsTabs drivers={drivers} currentStatus={currentStatus} />;
}

export default function RequestsPage({ searchParams }: RequestsPageProps) {
  return (
    <div className="space-y-6">
      <RequestsHeader />

      <Suspense fallback={<RequestsCardsSkeleton />}>
        <RequestsPageData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
