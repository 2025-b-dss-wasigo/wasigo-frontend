'use client';

import { Suspense } from 'react';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import PaymentCancelContent from './PaymentCancelContent';

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<FullScreenLoader message="Procesando cancelación..." />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
