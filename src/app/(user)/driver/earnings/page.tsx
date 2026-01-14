import { Suspense } from 'react';
import { getPayoutBalance } from '@/actions/payouts';
import { getDriverPayments } from '@/actions/payments/driver';
import { getPayoutHistory } from '@/actions/payouts/my';
import { getDriverProfile } from '@/actions/drivers/profile';
import { EarningsPageClient } from '@/components/driver/EarningsPageClient';
import { EarningsSkeleton } from '@/components/common/SkeletonLoaders';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mis Ganancias',
  description: 'Visualiza tus ganancias.',
};

async function EarningsData() {

  const [balanceResponse, paymentsResponse, payoutsResponse, driverResponse] = await Promise.all([
    getPayoutBalance(),
    getDriverPayments(),
    getPayoutHistory(),
    getDriverProfile(),
  ]);

  // Balance data con valores por defecto si hay error
  let balanceData = null;
  if (balanceResponse.success && balanceResponse.data) {
    // La API responde con data.data, entonces accedemos así
    const balanceDataRaw = (balanceResponse.data as any).data || balanceResponse.data;
    balanceData = {
      availableForWithdrawal: balanceDataRaw?.availableForWithdrawal ?? 0,
      monthlyEarnings: balanceDataRaw?.monthlyEarnings ?? 0,
      pendingCollection: balanceDataRaw?.pendingCollection ?? 0,
      completedTrips: balanceDataRaw?.completedTrips ?? 0,
    };
  }

  const ingresos = paymentsResponse.success && paymentsResponse.data?.data ? paymentsResponse.data.data : [];
  const retiros = payoutsResponse.success && payoutsResponse.data?.data ? payoutsResponse.data.data : [];
  const paypalEmail = driverResponse.success && driverResponse.data?.driver?.paypalEmail ? driverResponse.data.driver.paypalEmail : null;

  return (
    <EarningsPageClient
      initialBalanceData={balanceData}
      initialIngresos={ingresos}
      initialRetiros={retiros}
      initialPaypalEmail={paypalEmail}
    />
  );
}

export default async function EarningsPage() {
  return (
    <Suspense fallback={<EarningsSkeleton />}>
      <EarningsData />
    </Suspense>
  );
}
