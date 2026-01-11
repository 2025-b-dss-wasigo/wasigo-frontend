export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { RequestsContent } from '@/components/admin/RequestsContent';
import { RequestsTableSkeleton } from '@/components/common/SkeletonLoaders';
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

  return (
    <RequestsContent
      drivers={drivers}
      currentStatus={currentStatus}
    />
  );
}

export default function RequestsPage({ searchParams }: RequestsPageProps) {
  return (
    <Suspense fallback={<RequestsTableSkeleton />}>
      <RequestsContentWrapper searchParams={searchParams} />
    </Suspense>
  );
}
