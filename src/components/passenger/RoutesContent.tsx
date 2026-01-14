'use client'

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RouteCard } from '@/components/common/RouteCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Calendar, X } from 'lucide-react';
import { toast } from 'sonner';
import PlacesAutocomplete from '@/components/maps/PlacesAutocomplete';
import { getAvailableRoutes, createBooking, createPayment, createPayPalOrder, capturePayPalPayment } from '@/actions';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { Route } from '../../interfaces';
import { PaymentMethodModal } from './PaymentMethodModal';
import { PaymentMethod } from '@/interfaces/payments/payment.interface';
import { useAuthStore } from '../../store/authStore';

export function RoutesContent() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [campusFilter, setCampusFilter] = useState<string>('todos');
  const [fecha, setFecha] = useState('');
  const [destino, setDestino] = useState('');
  const [destinoCoordenadas, setDestinoCoordenadas] = useState({ lat: 0, lng: 0 });
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allRoutes, setAllRoutes] = useState<Route[]>([]);
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [campusOrigen, setCampusOrigen] = useState<'CAMPUS_PRINCIPAL' | 'EL_BOSQUE'>('CAMPUS_PRINCIPAL');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedRouteForMap, setSelectedRouteForMap] = useState<Route | null>(null);

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const campusCoordinates: Record<string, { lat: number; lng: number }> = {
    'CAMPUS_PRINCIPAL': { lat: -0.2094931, lng: -78.4873596 },
    'EL_BOSQUE': { lat: -0.1641702, lng: -78.5007102 }
  };

  const campusLabels: Record<string, 'Campus Principal' | 'Sede El Bosque'> = {
    'CAMPUS_PRINCIPAL': 'Campus Principal',
    'EL_BOSQUE': 'Sede El Bosque'
  };

  useEffect(() => {
    if (allRoutes.length > 0) {
      let filtered = allRoutes;

      if (campusFilter && campusFilter !== 'todos') {
        // ← Ahora filtramos directamente sobre allRoutes sin .data
        filtered = allRoutes.filter(ruta => {
          const filterValue = campusFilter === 'Campus Principal' ? 'CAMPUS_PRINCIPAL' : 'EL_BOSQUE';
          return ruta.origen === filterValue; // ← ruta.origen, no ruta.data.origen
        });

        if (filtered.length === 0) {
          toast.info('No hay rutas disponibles con este filtro');
        }
      }

      setSearchResults(filtered);
    }
  }, [campusFilter, allRoutes]);


  const handleSearch = async () => {
    if (!fecha || !destino) {
      toast.error('Por favor completa Fecha y Destino');
      return;
    }

    setIsLoading(true);
    try {
      const campusCoord = campusCoordinates[campusOrigen];

      const response = await getAvailableRoutes({
        lat: campusCoord.lat,
        lng: campusCoord.lng,
        fecha: fecha,
        radiusKm: 1,
      });

      setHasSearched(true);
      setCampusFilter('todos');

      if (response.success && response.data) {
        const routes = response.data;
        // Filtrar rutas que no estén FINALIZADA
        const activeRoutes = routes.filter(r => r.estado?.toUpperCase() !== 'FINALIZADA');
        setAllRoutes(activeRoutes);
        setSearchResults(activeRoutes);
        if (activeRoutes.length === 0) {
          toast.info('No hay rutas disponibles para tu búsqueda');
        }
      } else {
        toast.error(response.message || 'Error al buscar rutas');
      }
    } catch (error) {
      toast.error('Error al buscar rutas');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserve = (ruta: Route) => {
    setSelectedRoute(ruta);
    setPaymentModalOpen(true);
  };

  const handleViewMap = (ruta: Route) => {
    setSelectedRouteForMap(ruta);
    setMapModalOpen(true);
  };

  const handlePaymentMethodSelected = async (paymentMethod: PaymentMethod) => {
    if (!selectedRoute) return;

    setIsLoading(true);
    try {
      // Paso 1: Crear la reserva
      const bookingResponse = await createBooking({
        routeId: selectedRoute.publicId,
        metodoPago: paymentMethod,
        pickupLat: destinoCoordenadas.lat,
        pickupLng: destinoCoordenadas.lng,
        pickupDireccion: destino,
      });

      if (!bookingResponse.success || !bookingResponse.data) {
        toast.error(bookingResponse.message || 'Error al crear la reserva');
        setIsLoading(false);
        return;
      }

      const bookingId = bookingResponse.data.bookingId;

      // Paso 2: Crear el pago si la reserva fue exitosa
      // Calcular la clave idempotente: BKG_[bookingId][aliasPassajero][YYYYMMDD]
      const reservationDate = selectedRoute.fecha.replace(/-/g, '');
      const idempotencyKey = `${bookingId}${user?.alias || 'UNKNOWN'}${reservationDate}`;

      const paymentResponse = await createPayment(
        {
          bookingId,
          method: paymentMethod,
        },
        idempotencyKey
      );

      if (!paymentResponse.success) {
        toast.error(paymentResponse.message || 'Error al procesar el pago');
        setIsLoading(false);
        return;
      }

      const paymentId = paymentResponse.data?.paymentId;

      // Paso 3: Si es PayPal, crear la orden y redirigir
      if (paymentMethod === 'PAYPAL' && paymentId) {
        const paypalOrderResponse = await createPayPalOrder(paymentId, idempotencyKey);

        if (!paypalOrderResponse.success || !paypalOrderResponse.data?.approvalUrl) {
          toast.error(paypalOrderResponse.message || 'Error al crear la orden PayPal');
          setIsLoading(false);
          return;
        }

        // Guardar en sessionStorage para luego capturar el pago
        sessionStorage.setItem('paymentId', paymentId);
        sessionStorage.setItem('idempotencyKey', idempotencyKey);
        sessionStorage.setItem('bookingId', bookingId);

        // Redirigir a PayPal
        window.location.href = paypalOrderResponse.data.approvalUrl;
      } else {
        // Para EFECTIVO, redirigir directamente a mis viajes
        toast.success(`¡Reserva confirmada!`, {
          description: `Tu viaje hacia ${selectedRoute.destinoBase} ha sido reservado`,
        });

        setPaymentModalOpen(false);
        setSelectedRoute(null);
        router.push('/passenger/my-trips');
      }
    } catch (error) {
      console.error('Error en handlePaymentMethodSelected:', error);
      toast.error('Error inesperado al procesar tu reserva');
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setCampusFilter('todos');
  };

  return (
    <div className="space-y-6">
      <FullScreenLoader isOpen={isLoading} message="Buscando rutas disponibles..." />

      <div>
        <h2 className="text-2xl font-bold text-(--foreground) mb-2">Buscar Rutas</h2>
        <p className="text-(--muted-foreground)">Encuentra rutas disponibles para tu destino</p>
      </div>

      {/* Search Bar */}
      <div className="card-elevated p-4 space-y-4">
        {/* Campos obligatorios - Flex en una línea */}
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label className="mb-2 block">Punto de destino</Label>
            <PlacesAutocomplete
              placeholder="¿A dónde vas?"
              onPlaceSelect={(place) => {
                setDestino(place.address);
                setDestinoCoordenadas({ lat: place.lat, lng: place.lng });
              }}
            />
          </div>

          <div className="flex-none w-full lg:w-40">
            <Label className="mb-2 block">Fecha de viaje</Label>
            <Input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={minDate}
              icon={<Calendar className="w-5 h-5" />}
              className="h-12 pr-20"
            />
          </div>

          <Button variant="hero" size="lg" className="w-full lg:w-auto" onClick={handleSearch} disabled={isLoading}>
            <Search className="w-5 h-5 mr-2" />
            Buscar
          </Button>
        </div>

        {/* Filtros adicionales y opcionales */}
        {hasSearched && (
          <div className="flex flex-col lg:flex-row gap-4 items-end pt-4 border-t border-(--border)">
            <div className="flex-none lg:w-48">
              <Label className="text-sm mb-2 block">Filtro de Campus</Label>
              <Select value={campusFilter} onValueChange={setCampusFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Todos los campus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los campus</SelectItem>
                  <SelectItem value="Campus Principal">Campus Principal</SelectItem>
                  <SelectItem value="Campus El Bosque">Campus El Bosque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {hasSearched && campusFilter && campusFilter !== 'todos' && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-(--border)">
            <span className="text-sm text-(--muted-foreground)">Filtros activos:</span>
            {campusFilter && campusFilter !== 'todos' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-(--primary)/10 text-(--primary) rounded-full text-sm">
                {campusFilter}
                <button onClick={() => setCampusFilter('todos')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-(--muted-foreground) hover:text-(--foreground)"
            >
              Limpiar sede
            </button>
          </div>
        )}
      </div>

      {hasSearched && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <p className="text-(--muted-foreground)">
              {searchResults.length} ruta{searchResults.length !== 1 ? 's' : ''} disponible{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 w-full">
              {searchResults.map((ruta) => (
                <RouteCard
                  key={ruta.publicId}
                  ruta={ruta}
                  onReserve={handleReserve}
                  onViewMap={handleViewMap}
                />
              ))}
            </div>
          ) : (
            <div className="card-elevated p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-(--muted) flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-(--muted-foreground)" />
              </div>
              <h3 className="text-lg font-semibold text-(--foreground) mb-2">No hay rutas disponibles</h3>
              <p className="text-(--muted-foreground) mb-4">
                Intenta ajustar tus filtros de búsqueda
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      )}

      <PaymentMethodModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        onConfirm={handlePaymentMethodSelected}
        isLoading={isLoading}
      />
    </div>
  );
}
