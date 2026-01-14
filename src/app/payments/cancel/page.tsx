import { Suspense } from 'react';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import PaymentCancelContent from './PaymentCancelContent';

export const metadata = {
  title: 'Pago Cancelado',
  description: 'Tu pago ha sido cancelado. Puedes intentarlo nuevamente cuando lo desees',
};

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<FullScreenLoader message="Procesando cancelación..." />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
