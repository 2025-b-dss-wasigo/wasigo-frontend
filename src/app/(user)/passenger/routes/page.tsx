export const dynamic = 'force-dynamic';

import { ClientOnly } from '@/components/common/ClientOnly';
import { RoutesContent } from '@/components/passenger/RoutesContent';
import { RoutesSearchSkeleton } from '@/components/common/SkeletonLoaders';


export default async function RoutesPage() {
  return (
    <ClientOnly fallback={<RoutesSearchSkeleton />}>
      <RoutesContent />
    </ClientOnly>
  );
}
