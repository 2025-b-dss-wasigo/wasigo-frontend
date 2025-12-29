'use client'

import React from 'react';
import { StatCard } from '@/components/common/StatCard';
import { RouteCard } from '@/components/common/RouteCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Car,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { EstadisticasPasajero, ViajePasajero } from '@/lib/passengerData';
import { Ruta } from '@/data/mockData';

interface DashboardContentProps {
  estadisticas: EstadisticasPasajero;
  proximosViajes: ViajePasajero[];
  rutasDisponibles: Ruta[];
}

export function DashboardContent({ estadisticas, proximosViajes, rutasDisponibles }: DashboardContentProps) {
  const proximoViaje = proximosViajes[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-(--foreground) mb-2">Panel de Pasajero</h2>
        <p className="text-(--muted-foreground)">Encuentra rutas y gestiona tus viajes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Viajes Realizados"
          value={estadisticas.viajesRealizados}
          icon={Car}
          trend={{ value: 20, positive: true }}
          className="stagger-1"
        />
        <StatCard
          title="Próximos Viajes"
          value={estadisticas.proximosViajes}
          icon={Clock}
          className="stagger-2"
        />
        <StatCard
          title="Ahorro Total"
          value={`$${estadisticas.ahorroTotal.toFixed(2)}`}
          icon={Wallet}
          trend={{ value: 15, positive: true }}
          className="stagger-3"
        />
        <StatCard
          title="Calificación"
          value={estadisticas.calificacion.toFixed(1)}
          icon={Star}
          className="stagger-4"
          iconClassName="bg-(--warning)/10 text-(--warning)"
        />
      </div>

      {/* Próximo Viaje */}
      {proximoViaje && (
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-(--foreground)">Tu Próximo Viaje</h3>
            <StatusBadge status={proximoViaje.estado} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-(--primary)/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-(--primary)" />
                </div>
                <div>
                  <p className="font-semibold text-(--foreground)">{proximoViaje.conductor.nombre}</p>
                  <div className="flex items-center gap-1 text-sm text-(--muted-foreground)">
                    <Star className="w-4 h-4 text-(--warning) fill-(--warning)" />
                    <span>{proximoViaje.conductor.calificacion.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-(--success) mt-1" />
                  <div>
                    <p className="text-xs text-(--muted-foreground)">Origen</p>
                    <p className="font-medium text-(--foreground)">{proximoViaje.origen}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-(--destructive) mt-1" />
                  <div>
                    <p className="text-xs text-(--muted-foreground)">Destino</p>
                    <p className="font-medium text-(--foreground)">{proximoViaje.destino}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center p-4 bg-(--primary)/5 rounded-xl border border-(--primary)/10">
              <p className="text-sm text-(--muted-foreground) mb-1">Tu código OTP</p>
              <p className="text-3xl font-bold text-(--primary) tracking-wider">{proximoViaje.otp}</p>
              <p className="text-xs text-(--muted-foreground) mt-1">Muéstralo al conductor</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-(--border)">
            <Button variant="outline">Cancelar viaje</Button>
          </div>
        </div>
      )}

      {/* Rutas Disponibles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-(--foreground)">Rutas Disponibles</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/routes">
              Ver todas <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rutasDisponibles.map((ruta) => (
            <RouteCard
              key={ruta.id}
              ruta={ruta}
              onReserve={() => toast.success('Reserva realizada exitosamente')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
