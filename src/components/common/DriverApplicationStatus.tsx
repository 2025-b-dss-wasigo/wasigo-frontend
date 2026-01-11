import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Car, Clock, CheckCircle2, XCircle, AlertCircle,
  FileText, RefreshCw
} from 'lucide-react';

export interface DriverApplication {
  id: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaSolicitud: string;
  motivoRechazo?: string;
  vehiculo: {
    marca: string;
    modelo: string;
    placa: string;
  };
}

interface DriverApplicationStatusProps {
  application: DriverApplication | null;
  onNewApplication: () => void;
}

export function DriverApplicationStatus({ application, onNewApplication }: DriverApplicationStatusProps) {
  if (!application) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-foreground">¿Quieres ser conductor?</h3>
              <p className="text-muted-foreground text-sm">
                Comparte tus viajes y genera ingresos extra mientras ayudas a otros universitarios
              </p>
            </div>
            <Button onClick={onNewApplication}>
              Solicitar ahora
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusConfig = () => {
    switch (application.estado) {
      case 'pendiente':
        return {
          icon: Clock,
          iconColor: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          title: 'Solicitud en Revisión',
          description: 'Tu solicitud está siendo evaluada por nuestro equipo. Te notificaremos cuando tengamos una respuesta.',
        };
      case 'aprobada':
        return {
          icon: CheckCircle2,
          iconColor: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          title: '¡Solicitud Aprobada!',
          description: 'Ya puedes crear rutas y empezar a compartir viajes.',
        };
      case 'rechazada':
        return {
          icon: XCircle,
          iconColor: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          title: 'Solicitud Rechazada',
          description: 'Lamentablemente tu solicitud no fue aprobada.',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <Card className={`border ${config.borderColor} ${config.bgColor}`}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center shrink-0`}>
              <StatusIcon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{config.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{config.description}</p>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
            <Car className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">
                {application.vehiculo.marca} {application.vehiculo.modelo}
              </p>
              <p className="text-xs text-muted-foreground">Placa: {application.vehiculo.placa}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Enviada: {new Date(application.fechaSolicitud).toLocaleDateString('es-EC')}
            </p>
          </div>

          {/* Rejection Reason */}
          {application.estado === 'rechazada' && application.motivoRechazo && (
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive text-sm">Motivo del rechazo:</p>
                  <p className="text-sm text-muted-foreground mt-1">{application.motivoRechazo}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {application.estado === 'rechazada' && (
            <Button onClick={onNewApplication} className="w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Enviar Nueva Solicitud
            </Button>
          )}

          {application.estado === 'pendiente' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>Tiempo estimado de respuesta: 1-3 días hábiles</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
