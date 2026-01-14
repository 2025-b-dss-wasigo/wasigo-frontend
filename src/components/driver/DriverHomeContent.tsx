'use client'

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Route,
  Users,
  Wallet,
  ArrowRight,
  MapPin,
  Clock,
  Armchair,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { getMyRoutes } from '@/actions';
import { Card, CardContent } from '@/components/ui/card';
import { Route as RouteData } from '@/interfaces';

interface DriverHomeContentProps {
  stats: {
    rutasActivas: number;
    viajesCompletados: number;
    fondosDisponibles: number;
    calificacion: number;
  };
}

export function DriverHomeContent({ stats }: DriverHomeContentProps) {
  const [rutasActivas, setRutasActivas] = useState<RouteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarRutas = async () => {
      try {
        setIsLoading(true);
        const response = await getMyRoutes();
        if (response.success && response.data?.data) {
          setRutasActivas(response.data.data);
        }
      } catch (error) {
        console.error('Error al cargar rutas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarRutas();
  }, []);
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-(--foreground) mb-2">Panel de Conductor</h2>
        <p className="text-(--muted-foreground)">Gestiona tus rutas y ganancias</p>
      </div>

      {/* Acciones Rápidas */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="success" size="lg" className="h-auto py-4 sm:w-48" asChild>
          <Link href="/driver/create-route" className="flex flex-col items-center gap-2">
            <Route className="w-6 h-6" />
            <span>Crear Nueva Ruta</span>
          </Link>
        </Button>
        <Button variant="hero" size="lg" className="h-auto py-4 text-white sm:w-48" asChild>
          <Link href="/driver/validate-otp" className="flex flex-col items-center gap-2">
            <Users className="w-6 h-6" />
            <span>Validar OTP</span>
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="h-auto py-4 sm:w-48" asChild>
          <Link href="/driver/earnings" className="flex flex-col items-center gap-2">
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
            <Link href="/driver/my-routes">
              Ver todas <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rutasActivas.slice(0, 2).map((ruta) => (
              <Card key={ruta.publicId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Origen y Destino */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-(--success) mt-1 shrink-0" />
                        <div>
                          <p className="text-xs text-(--muted-foreground)">Origen</p>
                          <p className="font-medium text-(--foreground)">{ruta.origen}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-(--destructive) mt-1 shrink-0" />
                        <div>
                          <p className="text-xs text-(--muted-foreground)">Destino</p>
                          <p className="font-medium text-(--foreground)">{ruta.destinoBase}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fecha, Hora y Precio */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-(--border)">
                      <div>
                        <p className="text-xs text-(--muted-foreground)">Fecha</p>
                        <p className="font-medium text-sm text-(--foreground)">{ruta.fecha}</p>
                      </div>
                      <div>
                        <p className="text-xs text-(--muted-foreground)">Hora</p>
                        <p className="font-medium text-sm text-(--foreground)">{ruta.horaSalida}</p>
                      </div>
                      <div>
                        <p className="text-xs text-(--muted-foreground)">Precio</p>
                        <p className="font-medium text-sm text-(--primary)">${ruta.precioPasajero}</p>
                      </div>
                    </div>

                    {/* Asientos */}
                    <div className="flex items-center gap-2 text-sm">
                      <Armchair className="w-4 h-4 text-(--muted-foreground)" />
                      <span className="text-(--muted-foreground)">
                        {ruta.asientosDisponibles} de {ruta.asientosDisponibles} asientos disponibles
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
