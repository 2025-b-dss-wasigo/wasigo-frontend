'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Route {
  publicId: string;
  origen: 'EL_BOSQUE' | 'CAMPUS_PRINCIPAL';
  fecha: string;
  horaSalida: string;
  destinoBase: string;
  asientosTotales: number;
  asientosDisponibles: number;
  precioPasajero: string;
  estado: string;
}

interface RoutesMapContentProps {
  routes: Route[];
}

export function RoutesMapContent({ routes }: RoutesMapContentProps) {
  const getOrigenLabel = (origen: string) => {
    const labels: Record<string, string> = {
      'CAMPUS_PRINCIPAL': 'Campus Principal',
      'EL_BOSQUE': 'Campus El Bosque'
    };
    return labels[origen] || origen;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {routes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tienes rutas creadas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {routes.map(route => (
            <Card key={route.publicId} className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Car className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {getOrigenLabel(route.origen)} → {route.destinoBase}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {route.horaSalida}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {formatDate(route.fecha)}
                        </span>
                        <span className="text-primary">
                          {route.asientosDisponibles}/{route.asientosTotales} asientos
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/driver/route/${route.publicId}`}>
                    <Button>Ver en Mapa</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
