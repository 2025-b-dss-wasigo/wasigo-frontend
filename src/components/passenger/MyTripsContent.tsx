'use client'

import React, { useState } from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Car,
  MapPin,
  Clock,
  Star,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { ViajePasajero } from '@/lib/passengerData';

interface MyTripsContentProps {
  viajes: ViajePasajero[];
}

export function MyTripsContent({ viajes }: MyTripsContentProps) {
  const [copiedOTP, setCopiedOTP] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('programados');

  const viajesProgramados = viajes.filter(v => v.estado === 'programado');
  const viajesCompletados = viajes.filter(v => v.estado === 'completado');
  const viajesCancelados = viajes.filter(v => v.estado === 'cancelado');

  const getActiveViajes = () => {
    switch (activeTab) {
      case 'programados': return viajesProgramados;
      case 'completados': return viajesCompletados;
      case 'cancelados': return viajesCancelados;
      default: return viajesProgramados;
    }
  };

  const activeViajes = getActiveViajes();

  const copyOTP = (otp: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedOTP(otp);
    toast.success('Código OTP copiado');
    setTimeout(() => setCopiedOTP(null), 2000);
  };

  const renderViaje = (viaje: ViajePasajero) => (
    <div key={viaje.id} className="card-elevated p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-(--primary)/10 flex items-center justify-center">
            <Car className="w-6 h-6 text-(--primary)" />
          </div>
          <div>
            <p className="font-semibold text-(--foreground)">@{viaje.conductor.alias}</p>
            <div className="flex items-center gap-1 text-sm text-(--muted-foreground)">
              <Star className="w-4 h-4 text-(--warning) fill-(--warning)" />
              <span>{viaje.conductor.calificacion.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={viaje.estado} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-(--success) mt-1" />
          <div>
            <p className="text-xs text-(--muted-foreground)">Origen</p>
            <p className="font-medium text-(--foreground) text-sm">{viaje.origen}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-(--destructive) mt-1" />
          <div>
            <p className="text-xs text-(--muted-foreground)">Destino</p>
            <p className="font-medium text-(--foreground) text-sm">{viaje.destino}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-(--muted-foreground) mb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{viaje.fecha} • {viaje.hora}</span>
        </div>
        <span>•</span>
        <span className="capitalize">{viaje.metodoPago}</span>
      </div>

      {viaje.estado === 'programado' && (
        <div className="flex items-center justify-between p-3 bg-(--primary)/5 rounded-lg border border-(--primary)/10 mb-4">
          <div>
            <p className="text-xs text-(--muted-foreground)">Tu código OTP</p>
            <p className="text-2xl font-bold text-(--primary) tracking-wider">{viaje.otp}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyOTP(viaje.otp)}
          >
            {copiedOTP === viaje.otp ? (
              <CheckCircle className="w-5 h-5 text-(--success)" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-(--border)">
        <p className="text-lg font-bold text-(--primary)">${viaje.precio.toFixed(2)}</p>
        <div className="flex gap-2">
          {viaje.estado === 'programado' && (
            <>
              <Button variant="ghost" size="sm">
                <AlertTriangle className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                Cancelar
              </Button>
            </>
          )}
          {viaje.estado === 'completado' && (
            <>
              <Button variant="ghost" size="sm">
                <AlertTriangle className="w-4 h-4" />
              </Button>
              <Button variant="soft" size="sm">
                <Star className="w-4 h-4" />
                Calificar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-(--foreground) mb-2">Mis Viajes</h2>
        <p className="text-(--muted-foreground)">Gestiona tus reservas y viajes</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="programados" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Programados</span>
            <span className="sm:hidden">Prog.</span>
            {viajesProgramados.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-(--primary) text-(--primary-foreground) rounded-full">
                {viajesProgramados.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completados" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Completados</span>
            <span className="sm:hidden">Comp.</span>
          </TabsTrigger>
          <TabsTrigger value="cancelados" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Cancelados</span>
            <span className="sm:hidden">Canc.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {activeViajes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeViajes.map(renderViaje)}
            </div>
          ) : (
            <div className="card-elevated p-12 text-center">
              {activeTab === 'programados' && <Clock className="w-12 h-12 mx-auto text-(--muted-foreground) mb-4" />}
              {activeTab === 'completados' && <CheckCircle className="w-12 h-12 mx-auto text-(--muted-foreground) mb-4" />}
              {activeTab === 'cancelados' && <XCircle className="w-12 h-12 mx-auto text-(--muted-foreground) mb-4" />}
              <h3 className="text-lg font-semibold text-(--foreground) mb-2">
                No tienes viajes {activeTab}
              </h3>
              <p className="text-(--muted-foreground)">
                {activeTab === 'programados' && 'Busca rutas disponibles para reservar tu próximo viaje'}
                {activeTab === 'completados' && 'Aquí aparecerán tus viajes finalizados'}
                {activeTab === 'cancelados' && 'Aquí aparecerán los viajes que canceles'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
