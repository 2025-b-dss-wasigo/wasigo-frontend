import { Suspense } from 'react';
import { AdminTransactionsContent } from '@/components/admin/AdminTransactionsContent';
import { PayoutsListSkeleton } from '@/components/common/SkeletonLoaders';
import { getAllPayouts } from '@/actions/payouts/all';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Transacciones',
  description: 'Revisa las transacciones a cuentas de conductores.',
};

async function TransactionsData() {
  const payoutsResponse = await getAllPayouts();
  const payouts = payoutsResponse.data?.data || [];

  return <AdminTransactionsContent payouts={payouts} />;
}

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<PayoutsListSkeleton />}>
        <TransactionsData />
      </Suspense>
    </div>
  );
}
