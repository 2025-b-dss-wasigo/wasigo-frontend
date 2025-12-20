import { Ruta } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { MapPin, Clock, Users, Star, MessageCircle, Car } from 'lucide-react';

interface RouteCardProps {
  ruta: Ruta;
  onReserve?: (ruta: Ruta) => void;
  onViewDetails?: (ruta: Ruta) => void;
  showActions?: boolean;
  isConductor?: boolean;
}
export const RouteCard = ({
  ruta,
  onReserve,
  onViewDetails,
  showActions = true,
  isConductor = false,
}: RouteCardProps) => {
  return (
    <div className="card-interactive p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-(--primary)/10 flex items-center justify-center">
            <Car className="w-6 h-6 text-(--primary)" />
          </div>
          <div>
            <p className="font-semibold text-(--foreground)">{ruta.conductorAlias}</p>
            <div className="flex items-center gap-1 text-sm text-(--muted-foreground)">
              <Star className="w-4 h-4 text-(--warning) fill-(--warning)" />
              <span>{ruta.conductorCalificacion.toFixed(1)}</span>
              <span className="mx-1">•</span>
              <span>{ruta.vehiculo.marca} {ruta.vehiculo.modelo}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={ruta.estado} />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-(--success)/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-(--success)" />
          </div>
          <div>
            <p className="text-xs text-(--muted-foreground)">Origen</p>
            <p className="font-medium text-(--foreground)">{ruta.lugarSalida}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-(--destructive)/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-(--destructive)" />
          </div>
          <div>
            <p className="text-xs text-(--muted-foreground)">Destino</p>
            <p className="font-medium text-(--foreground)">{ruta.destino}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-(--muted-foreground) mb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{ruta.horaSalida}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{ruta.asientosDisponibles}/{ruta.asientosTotales} asientos</span>
        </div>
      </div>

      {ruta.mensajeAdicional && (
        <div className="flex items-start gap-2 p-3 bg-(--accent) rounded-lg mb-4">
          <MessageCircle className="w-4 h-4 text-(--muted-foreground) mt-0.5" />
          <p className="text-sm text-(--muted-foreground)">{ruta.mensajeAdicional}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-(--border)">
        <div>
          <p className="text-2xl font-bold text-(--primary)">${ruta.precio.toFixed(2)}</p>
          <p className="text-xs text-(--muted-foreground)">por asiento</p>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={() => onViewDetails(ruta)}>
                Ver detalles
              </Button>
            )}
            {onReserve && ruta.asientosDisponibles > 0 && (
              <Button size="sm" onClick={() => onReserve(ruta)}>
                Reservar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
