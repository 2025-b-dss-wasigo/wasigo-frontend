'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock, Users, DollarSign, Plus,
  Calendar
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useRouter } from 'next/navigation';
import { Route } from '@/interfaces';

const ITEMS_PER_PAGE = 5;

interface MyRoutesContentProps {
  routes: Route[];
}

export function MyRoutesContent({ routes }: MyRoutesContentProps) {
  const navigate = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // Mostrar todas las rutas
  const routesActivas = routes;

  const totalPages = Math.ceil(routesActivas.length / ITEMS_PER_PAGE);
  const paginatedRoutes = routesActivas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const RouteCard = ({ route }: { route: Route }) => (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Route Info */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-(--foreground)">{route.origen === 'CAMPUS_PRINCIPAL' ? 'Campus Principal' : 'Campus El Bosque'}</span>
              </div>
              <span className="text-(--muted-foreground)">→</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-(--primary)" />
                <span className="font-medium text-(--foreground)">{route.destinoBase}</span>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-(--muted-foreground)">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{route.horaSalida}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{route.asientosDisponibles}/{route.asientosTotales} asientos</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>${route.precioPasajero}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{route.fecha}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-(--foreground)">
                {route.mensaje}
              </div>
              <StatusBadge status="confirmado" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">Mis Rutas</h1>
          <p className="text-(--muted-foreground)">Gestiona las rutas que ofreces</p>
        </div>
        <Button variant="default" onClick={() => navigate.push('/driver/create-route')}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Ruta
        </Button>
      </div>

      {/* Routes Section */}
      <div suppressHydrationWarning>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-(--foreground)">
            Mis Rutas ({routesActivas.length})
          </h2>
        </div>

        <div className="space-y-4">
          {paginatedRoutes.map((route) => (
            <RouteCard key={route.publicId} route={route} />
          ))}
          {paginatedRoutes.length === 0 && (
            <div className="text-center py-12 text-(--muted-foreground)">
              No tienes rutas
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-(--muted-foreground)">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
