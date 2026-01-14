'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock, Users, DollarSign, Plus,
  Calendar, CheckCircle, XCircle, Star
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useRouter } from 'next/navigation';
import { Route } from '@/interfaces';
import { DriverRatingModal } from '@/components/driver/DriverRatingModal';
import { canRate } from '@/actions';
import { UserToRate } from '@/interfaces/responses/ratings/CanRateResponse.interface';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

interface MyRoutesContentProps {
  routes: Route[];
}

interface RatingState {
  routeId: string;
  usersToRate: UserToRate[];
  canRate: boolean;
}

export function MyRoutesContent({ routes }: MyRoutesContentProps) {
  const navigate = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('activas');
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [ratingStates, setRatingStates] = useState<Map<string, RatingState>>(new Map());

  // Filtrar rutas por estado
  const routesActivas = routes.filter(r => r.estado?.toUpperCase() === 'ACTIVA');
  const routesFinalizadas = routes.filter(r => r.estado?.toUpperCase() === 'FINALIZADA' || r.estado?.toUpperCase() === 'COMPLETADA');

  const getActiveRoutes = () => {
    switch (activeTab) {
      case 'activas': return routesActivas;
      case 'finalizadas': return routesFinalizadas;
      default: return routesActivas;
    }
  };

  const activeRoutes = getActiveRoutes();
  const totalPages = Math.ceil(activeRoutes.length / ITEMS_PER_PAGE);
  const paginatedRoutes = activeRoutes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  // Verificar si puede calificar una ruta
  const checkCanRateRoute = async (routeId: string) => {
    if (ratingStates.has(routeId)) return; // Ya se verificó

    try {
      const response = await canRate(routeId);
      if (response.success && response.data) {
        setRatingStates(prev => new Map(prev).set(routeId, {
          routeId,
          usersToRate: response.data?.usersToRate || [],
          canRate: response.data?.canRate || false,
        }));
      }
    } catch (error) {
      console.error('Error al verificar si puede calificar:', error);
    }
  };

  // Cargar estado de calificación para rutas finalizadas
  useEffect(() => {
    routesFinalizadas.forEach(route => {
      if (route.publicId) {
        checkCanRateRoute(route.publicId);
      }
    });
  }, [routesFinalizadas]);

  const handleRateClick = (route: Route) => {
    if (!route.publicId) {
      toast.error('No se pudo obtener el ID de la ruta');
      return;
    }
    setSelectedRoute(route.publicId);
    setRatingModalOpen(true);
  };

  const handleRatingSubmitted = () => {
    setRatingModalOpen(false);
    setSelectedRoute(null);
  };

  const getStatusBadgeStatus = (estado: string | undefined) => {
    const upperEstado = estado?.toUpperCase();
    if (upperEstado === 'ACTIVA') return 'activo';
    if (upperEstado === 'FINALIZADA' || upperEstado === 'COMPLETADA') return 'completado';
    return 'pendiente';
  };

  const RouteCard = ({ route }: { route: Route }) => {
    const ratingState = ratingStates.get(route.publicId || '');
    const canRateThisRoute = ratingState?.canRate && (ratingState?.usersToRate?.length ?? 0) > 0;

    return (
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
                  <span>
                    {(route.asientosTotales || route.asientosDisponibles) - route.asientosDisponibles || 0}/{route.asientosTotales || route.asientosDisponibles} asientos
                  </span>
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
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-(--foreground)">
                  {route.mensaje}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={getStatusBadgeStatus(route.estado)} />
                  {canRateThisRoute && (
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => handleRateClick(route)}
                      className='text-white font-bold'
                    >
                      <Star className="w-4 h-4" />
                      Calificar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="activas" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Activas</span>
            {routesActivas.length > 0 && (
              <span className="text-xs text-(--foreground)">
                {routesActivas.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="finalizadas" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Finalizadas</span>
            {routesFinalizadas.length > 0 && (
              <span className="text-xs text-(--foreground)">
                {routesFinalizadas.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div suppressHydrationWarning>
            <div className="space-y-4">
              {paginatedRoutes.map((route) => (
                <RouteCard key={route.publicId} route={route} />
              ))}
              {paginatedRoutes.length === 0 && (
                <div className="text-center py-12 text-(--muted-foreground)">
                  {activeTab === 'activas' ? 'No tienes rutas activas' : 'No tienes rutas finalizadas'}
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
        </TabsContent>
      </Tabs>

      {/* Rating Modal */}
      {selectedRoute && ratingStates.has(selectedRoute) && (
        <DriverRatingModal
          open={ratingModalOpen}
          onOpenChange={setRatingModalOpen}
          routeId={selectedRoute}
          usersToRate={ratingStates.get(selectedRoute)?.usersToRate || []}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
}
