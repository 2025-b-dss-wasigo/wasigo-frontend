'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Clock, User } from 'lucide-react';

interface Route {
  id: string;
  lugarSalida: string;
  destino: string;
  horaSalida: string;
  pasajeros: Array<{ id: string }>;
}

interface RouteSelectorProps {
  routes: Route[];
  onSelectRoute: (routeId: string) => void;
}

export function RouteSelector({ routes, onSelectRoute }: RouteSelectorProps) {
  if (routes.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No tienes rutas activas en este momento</p>
          <Button className="mt-4" asChild>
            <a href="/driver/create-route">Crear nueva ruta</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {routes.map((route) => (
        <Card
          key={route.id}
          className="cursor-pointer hover:shadow-md transition-all hover:border-primary"
          onClick={() => onSelectRoute(route.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{route.lugarSalida} → {route.destino}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {route.horaSalida}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {route.pasajeros.length} pasajeros
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline">Seleccionar</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
