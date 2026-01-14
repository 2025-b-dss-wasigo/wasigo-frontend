'use client';

import { useEffect, useState } from 'react';
import { getMyRoutes } from '@/actions';
import { Route as RouteData } from '@/interfaces';
import {
  MapPin,
  Clock,
  Armchair,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DriverRoutesSection() {
  const [rutasActivas, setRutasActivas] = useState<RouteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarRutas = async () => {
      try {
        setIsLoading(true);
        const response = await getMyRoutes();
        if (response.success && response.data?.data) {
          setRutasActivas(response.data.data);
        }
      } catch (err) {
        console.error('Error al cargar rutas:', err);
        setError('Error al cargar las rutas');
      } finally {
        setIsLoading(false);
      }
    };

    cargarRutas();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Cargando rutas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Rutas Activas</h2>
        <Link href="/driver/routes">
          <Button variant="outline">Ver todas</Button>
        </Link>
      </div>

      {rutasActivas.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">No tienes rutas activas</p>
            <Link href="/driver/routes/create">
              <Button>Crear una ruta</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rutasActivas.map((ruta) => (
            <Card key={ruta.publicId}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {ruta.origen || 'Ruta sin nombre'}
                  </h3>
                  <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Activa
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{ruta.destinoBase || 'Destino no especificado'}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {ruta.horaSalida
                        ? new Date(ruta.horaSalida).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        : 'Hora no especificada'}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Armchair className="w-4 h-4 mr-2" />
                    <span>{ruta.asientosDisponibles || 0} asientos disponibles</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>${ruta.precioPasajero || 0} por asiento</span>
                  </div>
                </div>

                <Link href={`/driver/routes/${ruta.publicId}`}>
                  <Button variant="ghost" className="mt-4 w-full justify-between">
                    Ver detalles
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
