'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListLoader, ListPagination } from '@/components/common/LoadingSpinner';
import {
  MapPin, Clock, Users, DollarSign, Plus,
  MoreVertical, Edit2, Trash2, Eye, EyeOff,
  Calendar, TrendingUp
} from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { mockRutas } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 5;

export default function MisRutasPage() {
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState('activas');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter routes for the driver
  const rutasActivas = mockRutas.filter(r => r.asientosDisponibles > 0);
  const rutasPausadas = mockRutas.slice(0, 1);

  const getActiveRoutes = () => activeTab === 'activas' ? rutasActivas : rutasPausadas;
  const activeRoutes = getActiveRoutes();
  const totalPages = Math.ceil(activeRoutes.length / ITEMS_PER_PAGE);
  const paginatedRoutes = activeRoutes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab: string) => {
    setLoading(true);
    setActiveTab(tab);
    setCurrentPage(1);
    setTimeout(() => setLoading(false), 300);
  };

  const RouteCard = ({ route, isPaused = false }: { route: typeof mockRutas[0], isPaused?: boolean }) => (
    <Card className={`transition-all hover:shadow-md ${isPaused ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Route Info */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-(--foreground)">{route.lugarSalida}</span>
              </div>
              <span className="text-(--muted-foreground)">→</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-(--primary)" />
                <span className="font-medium text-(--foreground)">{route.destino}</span>
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
                <span>{route.asientosDisponibles} asientos</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>${route.precio.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>L-V</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-(--foreground) font-medium">12 viajes</span>
                <span className="text-(--muted-foreground)">este mes</span>
              </div>
              <StatusBadge status={isPaused ? 'pendiente' : 'confirmado'} />
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                {isPaused ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Activar
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Pausar
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-(--destructive)">
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <Button variant="default" onClick={() => navigate.push('/create-route')}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Ruta
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-(--primary)">4</p>
            <p className="text-sm text-(--muted-foreground)">Rutas Activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-(--foreground)">48</p>
            <p className="text-sm text-(--muted-foreground)">Viajes Totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-500">$127.50</p>
            <p className="text-sm text-(--muted-foreground)">Ganancias Mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">4.9</p>
            <p className="text-sm text-(--muted-foreground)">Calificación</p>
          </CardContent>
        </Card>
      </div>

      {/* Routes Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="activas">
            Activas ({rutasActivas.length})
          </TabsTrigger>
          <TabsTrigger value="pausadas">
            Pausadas ({rutasPausadas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <ListLoader count={3} />
          ) : (
            <>
              <div className="space-y-4">
                {paginatedRoutes.map((route) => (
                  <RouteCard key={route.id} route={route} isPaused={activeTab === 'pausadas'} />
                ))}
                {paginatedRoutes.length === 0 && (
                  <div className="text-center py-12 text-(--muted-foreground)">
                    No tienes rutas {activeTab}
                  </div>
                )}
              </div>
              <ListPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={activeRoutes.length}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
