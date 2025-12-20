import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/common/StatCard';
import { RouteCard } from '@/components/common/RouteCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockRutas, mockViajes, mockTickets, mockTransacciones, mockSolicitudes } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  Car,
  Route,
  Users,
  CreditCard,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  AlertTriangle,
  FileText,
  ArrowRight,
  MessageCircle,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function HomePage() {
  const misRutas = mockRutas.filter(r => r.conductorId === '2');
  const rutasActivas = misRutas.filter(r => r.estado === 'activa');

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
          value={rutasActivas.length}
          icon={Route}
          className="stagger-1"
        />
        <StatCard
          title="Viajes Completados"
          value="28"
          icon={Car}
          trend={{ value: 12, positive: true }}
          className="stagger-2"
        />
        <StatCard
          title="Fondos Disponibles"
          value="$127.50"
          icon={Wallet}
          className="stagger-3"
          iconClassName="bg-(--success)/10 text-(--success)"
        />
        <StatCard
          title="Calificación"
          value="4.9"
          icon={Star}
          className="stagger-4"
          iconClassName="bg-(--warning)/10 text-(--warning)"
        />
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
