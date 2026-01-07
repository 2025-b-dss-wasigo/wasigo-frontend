import { ClientOnly } from '@/components/common/ClientOnly';
import { RequestsContent } from '@/components/admin/RequestsContent';
import { RequestsTableSkeleton } from '@/components/common/SkeletonLoaders';
import { obtenerSolicitudes } from '@/lib/adminData';

export const dynamic = 'force-dynamic';

export default async function RequestsPage() {
  const solicitudes = await obtenerSolicitudes();

  return (
    <ClientOnly fallback={<RequestsTableSkeleton />}>
      <RequestsContent solicitudes={solicitudes} />
    </ClientOnly>
  );
}
