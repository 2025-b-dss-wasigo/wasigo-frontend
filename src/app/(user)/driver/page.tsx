'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DriverHomeContent } from '@/components/driver/DriverHomeContent';
import { obtenerEstadisticasConductor } from '@/lib/driverData';
import { useAuthStore } from '../../../store/authStore';

interface DriverStats {
  rutasActivas: number;
  viajesCompletados: number;
  fondosDisponibles: number;
  calificacion: number;
}

export default function HomePage() {
  const { isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const conductorId = '2';
        const estadisticas = await obtenerEstadisticasConductor(conductorId);

        setStats({
          rutasActivas: estadisticas.rutasActivas,
          viajesCompletados: estadisticas.viajesCompletados,
          fondosDisponibles: estadisticas.disponible,
          calificacion: estadisticas.calificacion
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      }
    };

    cargarDatos();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content - Integrated with TopBar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <DriverHomeContent stats={stats || {
          rutasActivas: 0,
          viajesCompletados: 0,
          fondosDisponibles: 0,
          calificacion: 0
        }} />
      </div>
    </div>
  );
}