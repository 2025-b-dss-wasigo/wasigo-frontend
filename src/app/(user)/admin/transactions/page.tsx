import { ClientOnly } from '@/components/common/ClientOnly';
import { TransactionsContent } from '@/components/admin/TransactionsContent';
import { TransactionsTableSkeleton } from '@/components/common/SkeletonLoaders';
import { obtenerTransacciones } from '@/lib/adminData';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  const transacciones = await obtenerTransacciones();

  return (
    <ClientOnly fallback={<TransactionsTableSkeleton />}>
      <TransactionsContent transacciones={transacciones} />
    </ClientOnly>
  );
}
