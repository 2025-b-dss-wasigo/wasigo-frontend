'use client'

import { StatCard } from '@/components/common/StatCard';
import { RouteCard } from '@/components/common/RouteCard';
import { Button } from '@/components/ui/button';
import {
  Car,
  Route,
  Users,
  Star,
  Wallet,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { Ruta } from '@/data/mockData';

interface DriverHomeContentProps {
  rutasActivas: Ruta[];
  stats: {
    rutasActivas: number;
    viajesCompletados: number;
    fondosDisponibles: number;
    calificacion: number;
  };
}

export function DriverHomeContent({ rutasActivas, stats }: DriverHomeContentProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-(--foreground) mb-2">Panel de Conductor</h2>
        <p className="text-(--muted-foreground)">Gestiona tus rutas y ganancias</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Rutas Activas"
          value={stats.rutasActivas}
          icon={Route}
          className="stagger-1"
        />
        <StatCard
          title="Viajes Completados"
          value={stats.viajesCompletados.toString()}
          icon={Car}
          trend={{ value: 12, positive: true }}
          className="stagger-2"
        />
        <StatCard
          title="Fondos Disponibles"
          value={`$${stats.fondosDisponibles.toFixed(2)}`}
          icon={Wallet}
          className="stagger-3"
          iconClassName="bg-(--success)/10 text-(--success)"
        />
        <StatCard
          title="Calificación"
          value={stats.calificacion.toFixed(1)}
          icon={Star}
          className="stagger-4"
          iconClassName="bg-(--warning)/10 text-(--warning)"
        />
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Button variant="hero" size="lg" className="h-auto py-4" asChild>
          <Link href="/create-route" className="flex flex-col items-center gap-2">
            <Route className="w-6 h-6" />
            <span>Crear Nueva Ruta</span>
          </Link>
        </Button>
        <Button variant="soft" size="lg" className="h-auto py-4 text-white" asChild>
          <Link href="/validate-routes" className="flex flex-col items-center gap-2">
            <Users className="w-6 h-6" />
            <span>Validar OTP</span>
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="h-auto py-4" asChild>
          <Link href="/earnings" className="flex flex-col items-center gap-2">
            <Wallet className="w-6 h-6" />
            <span>Retirar Fondos</span>
          </Link>
        </Button>
        <Button variant="default" size="lg" className="h-auto py-4 bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/driver-route/demo-123" className="flex flex-col items-center gap-2">
            <MapPin className="w-6 h-6" />
            <span>🗺️ Ver Ruta Demo</span>
          </Link>
        </Button>
      </div>

      {/* Mis Rutas Activas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-(--foreground)">Mis Rutas Activas</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mis-rutas">
              Ver todas <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rutasActivas.slice(0, 2).map((ruta) => (
            <RouteCard
              key={ruta.id}
              ruta={ruta}
              showActions={false}
              isConductor
            />
          ))}
        </div>
      </div>
    </div>
  );
}
