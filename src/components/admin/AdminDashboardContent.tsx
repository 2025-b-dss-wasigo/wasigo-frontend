'use client'

import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Car,
  Users,
  CreditCard,
  TrendingUp,
  FileText,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { EstadisticasAdmin } from '@/lib/adminData';
import { SolicitudConductor, Transaccion } from '@/data/mockData';

interface AdminDashboardContentProps {
  estadisticas: EstadisticasAdmin;
  solicitudesPendientes: SolicitudConductor[];
  transaccionesRecientes: Transaccion[];
}

export function AdminDashboardContent({
  estadisticas,
  solicitudesPendientes,
  transaccionesRecientes
}: AdminDashboardContentProps) {
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
          value={estadisticas.totalUsuarios}
          icon={Users}
          trend={{ value: 8, positive: true }}
          className="stagger-1"
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={estadisticas.solicitudesPendientes}
          icon={FileText}
          className="stagger-2"
          iconClassName="bg-(--warning)/10 text-(--warning)"
        />
        <StatCard
          title="Ingresos del Mes"
          value={`$${estadisticas.ingresosDelMes.toFixed(2)}`}
          icon={TrendingUp}
          trend={{ value: 15, positive: true }}
          className="stagger-3"
          iconClassName="bg-(--success)/10 text-(--success)"
        />
        <StatCard
          title="Viajes Activos"
          value={estadisticas.viajesActivos}
          icon={Car}
          className="stagger-4"
        />
      </div>

      {/* Grid de gestión */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solicitudes de Conductor */}
        <div className="card-elevated">
          <div className="p-4 border-b border-(--border) flex items-center justify-between">
            <h3 className="text-lg font-semibold text-(--foreground)">Solicitudes de Conductor</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/requests">Ver todas</Link>
            </Button>
          </div>

          <div className="divide-y divide-(--border)">
            {solicitudesPendientes.map((solicitud) => (
              <div key={solicitud.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary) font-semibold">
                      {solicitud.nombre.charAt(0)}{solicitud.apellido.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-(--foreground)">{solicitud.nombre} {solicitud.apellido}</p>
                      <p className="text-sm text-(--muted-foreground)">{solicitud.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={solicitud.estado} />
                </div>
                <div className="flex items-center gap-4 text-sm text-(--muted-foreground) mt-2">
                  <span>{solicitud.vehiculo.marca} {solicitud.vehiculo.modelo}</span>
                  <span>•</span>
                  <span>{solicitud.vehiculo.placa}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="success" onClick={() => toast.success('Solicitud aprobada')}>
                    Aprobar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.error('Solicitud rechazada')}>
                    Rechazar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Transacciones */}
        <div className="card-elevated">
          <div className="p-4 border-b border-(--border) flex items-center justify-between">
            <h3 className="text-lg font-semibold text-(--foreground)">Últimas Transacciones</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/transactions">Ver todas</Link>
            </Button>
          </div>

          <div className="divide-y divide-(--border)">
            {transaccionesRecientes.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.tipo === 'ingreso' ? 'bg-(--success)/10' :
                    tx.tipo === 'egreso' ? 'bg-(--destructive)/10' : 'bg-(--warning)/10'
                    }`}>
                    <CreditCard className={`w-5 h-5 ${tx.tipo === 'ingreso' ? 'text-(--success)' :
                      tx.tipo === 'egreso' ? 'text-(--destructive)' : 'text-(--warning)'
                      }`} />
                  </div>
                  <div>
                    <p className="font-medium text-(--foreground) text-sm">{tx.concepto}</p>
                    <p className="text-xs text-(--muted-foreground)">{tx.usuario} • {tx.fecha}</p>
                  </div>
                </div>
                <p className={`font-semibold ${tx.tipo === 'ingreso' ? 'text-(--success)' :
                  tx.tipo === 'egreso' ? 'text-(--destructive)' : 'text-(--warning)'
                  }`}>
                  {tx.tipo === 'ingreso' ? '+' : ''}${Math.abs(tx.monto).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
