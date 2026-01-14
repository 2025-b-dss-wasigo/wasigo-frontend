import { PassengerDashboardContent } from '@/components/passenger/PassengerDashboardContent';

export const metadata = {
  title: 'Panel del Pasajero',
  description: 'Panel de control para pasajeros',
};

export default function PassengerDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <PassengerDashboardContent />
    </div>
  );
}