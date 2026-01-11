'use client';

import { Button } from '@radix-ui/themes';
import { toast } from 'sonner';
import { StatusBadge, type StatusType } from '@/components/common/StatusBadge';

interface Solicitud {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  estado: string;
  vehiculo: {
    marca: string;
    modelo: string;
    placa: string;
  };
}

interface DriverRequestsSectionProps {
  solicitudes: Solicitud[];
}

export function DriverRequestsSection({ solicitudes }: DriverRequestsSectionProps) {
  const handleApprove = (solicitudId: string) => {
    toast.success('Solicitud aprobada', {
      description: `La solicitud ${solicitudId} ha sido aprobada.`
    });
  };

  const handleReject = (solicitudId: string) => {
    toast.error('Solicitud rechazada', {
      description: `La solicitud ${solicitudId} ha sido rechazada.`
    });
  };

  return (
    <div className="card-elevated">
      <div className="p-4 border-b border-(--border) flex items-center justify-between">
        <h3 className="text-lg font-semibold text-(--foreground)">Solicitudes de Conductor</h3>
        <Button variant="ghost" size="1">
          Ver todas
        </Button>
      </div>

      <div className="divide-y divide-(--border)">
        {solicitudes.map((solicitud) => (
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
              <StatusBadge status={solicitud.estado as StatusType} />
            </div>
            <div className="flex items-center gap-4 text-sm text-(--muted-foreground) mt-2">
              <span>{solicitud.vehiculo.marca} {solicitud.vehiculo.modelo}</span>
              <span>•</span>
              <span>{solicitud.vehiculo.placa}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
