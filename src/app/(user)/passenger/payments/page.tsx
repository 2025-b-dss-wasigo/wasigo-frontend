import { PassengerPaymentsGuard } from '@/components/passenger/PassengerPaymentsGuard';

export const metadata = {
  title: 'Mis Pagos',
  description: 'Visualiza el historial de pagos y transacciones de tus viajes',
};

export default function PassengerPaymentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PassengerPaymentsGuard />
    </div>
  );
}
