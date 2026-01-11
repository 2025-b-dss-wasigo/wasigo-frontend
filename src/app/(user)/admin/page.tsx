export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { Users, FileText, TrendingUp, Car } from 'lucide-react';
import { StatCard } from '../../../components';
import { DriverRequestsSection, TransactionsSection } from '../../../components/admin';
import { TransactionsSkeleton } from '../../../components/common/SkeletonLoaders';
import { mockSolicitudes, mockTransacciones } from '../../../data/mockData';

export default function AdminDashboardPage() {
  const solicitudesPendientes = mockSolicitudes.filter(s => s.estado === 'pendiente');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-(--foreground) mb-2">Panel de Administrador</h2>
        <p className="text-(--muted-foreground)">Gestión general de la plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Usuarios"
          value="523"
          icon={Users}
          trend={{ value: 8, positive: true }}
          className="stagger-1"
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={solicitudesPendientes.length}
          icon={FileText}
          className="stagger-2"
          iconClassName="bg-(--warning)/10 text-(--warning)"
        />
        <StatCard
          title="Ingresos del Mes"
          value="$2,450"
          icon={TrendingUp}
          trend={{ value: 15, positive: true }}
          className="stagger-3"
          iconClassName="bg-(--success)/10 text-(--success)"
        />
        <StatCard
          title="Viajes Activos"
          value="12"
          icon={Car}
          className="stagger-4"
        />
      </div>

      {/* Grid de gestión */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solicitudes de Conductor - Client Component */}
        <DriverRequestsSection solicitudes={solicitudesPendientes} />

        {/* Últimas Transacciones - Client Component */}
        <Suspense fallback={<TransactionsSkeleton />}>
          <TransactionsSection transacciones={mockTransacciones} />
        </Suspense>
      </div>
    </div>
  );
}
