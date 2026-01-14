import { Suspense } from 'react';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import PaymentSuccessContent from './PaymentSuccessContent';

export const metadata = {
  title: 'Pago Exitoso',
  description: 'Tu pago ha sido procesado exitosamente. Tu viaje ha sido confirmado',
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<FullScreenLoader message="Cargando..." />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
