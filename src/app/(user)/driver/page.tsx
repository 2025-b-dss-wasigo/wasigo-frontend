import { DriverStatsSection } from '@/components/driver/DriverStatsSection';
import { DriverRoutesSection } from '@/components/driver/DriverRoutesSection';

export const metadata = {
  title: 'Conductor Inicio',
  description: 'Panel de control para conductores',
};

interface DriverStats {
  rutasActivas: number;
  viajesCompletados: number;
  fondosDisponibles: number;
  calificacion: number;
}

export default function DriverPage() {
  // Stats por defecto (estos pueden venir de una BD o API en el futuro)
  const stats: DriverStats = {
    rutasActivas: 0,
    viajesCompletados: 0,
    fondosDisponibles: 0,
    calificacion: 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel del Conductor</h1>

        <DriverStatsSection stats={stats} />

        <DriverRoutesSection />
      </div>
    </div>
  );
}