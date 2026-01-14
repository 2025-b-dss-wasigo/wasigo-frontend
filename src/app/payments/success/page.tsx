'use client';

import { Suspense } from 'react';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import PaymentSuccessContent from './PaymentSuccessContent';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<FullScreenLoader message="Cargando..." />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
