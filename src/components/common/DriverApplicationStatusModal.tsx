import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Car } from 'lucide-react';

interface Vehicle {
  publicId: string;
  marca: string;
  modelo: string;
  color: string;
  placa: string;
  asientosDisponibles: number;
  isActivo: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DriverApplicationStatusModalProps {
  vehicle?: Vehicle;
}

export const DriverApplicationStatusModal: React.FC<DriverApplicationStatusModalProps> = ({
  vehicle,
}) => {
  if (!vehicle) return null;

  const formattedDate = new Date(vehicle.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Alert Card */}
      <Card className="border-l-4 border-l-yellow-500 bg-yellow-100/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-(--foreground) text-lg">Solicitud en Revisión</h3>
              <p className="text-sm text-(--muted-foreground) mt-1">
                Tu solicitud está siendo evaluada por nuestro equipo. Te notificaremos cuando tengamos una respuesta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Info Card */}
      <Card className="border border-(--border)">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-(--primary)/20 flex items-center justify-center shrink-0">
              <Car className="w-6 h-6 text-(--primary)" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-(--foreground)">
                {vehicle.marca} {vehicle.modelo}
              </h4>
              <div className="mt-2 space-y-1 text-sm text-(--muted-foreground)">
                <p>
                  <span className="font-medium text-(--foreground)">Placa:</span> {vehicle.placa}
                </p>
                <p>
                  <span className="font-medium text-(--foreground)">Color:</span> {vehicle.color}
                </p>
                <p>
                  <span className="font-medium text-(--foreground)">Asientos:</span> {vehicle.asientosDisponibles}
                </p>
                <p>
                  <span className="font-medium text-(--foreground)">Enviada:</span> {formattedDate}
                </p>
              </div>
              <p className="text-xs text-(--muted-foreground) mt-3">
                Tiempo estimado de respuesta: 1-3 días hábiles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
