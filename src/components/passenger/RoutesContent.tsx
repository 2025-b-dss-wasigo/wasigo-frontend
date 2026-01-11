'use client'

import React, { useState, useMemo } from 'react';
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
import { Search, MapPin, Calendar, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import { Ruta } from '@/data/mockData';
import PlacesAutocomplete from '@/components/maps/PlacesAutocomplete';

interface RoutesContentProps {
  rutas: Ruta[];
}

export function RoutesContent({ rutas }: RoutesContentProps) {
  const [campus, setCampus] = useState<string>('');
  const [fecha, setFecha] = useState('');
  const [destino, setDestino] = useState('');

  // Obtener la fecha mínima (hoy) en formato YYYY-MM-DD
  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const filteredRutas = rutas.filter(r => {
    if (campus && r.lugarSalida !== campus) return false;
    if (destino && !r.destino.toLowerCase().includes(destino.toLowerCase())) return false;
    return true;
  });

  const handleReserve = (ruta: any) => {
    toast.success(`Reserva confirmada para la ruta hacia ${ruta.destino}`, {
      description: 'Revisa "Mis Viajes" para ver tu código OTP',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-(--foreground) mb-2">Buscar Rutas</h2>
        <p className="text-(--muted-foreground)">Encuentra rutas disponibles para tu destino</p>
      </div>

      {/* Search Bar */}
      <div className="card-elevated p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Label className="sr-only">Campus de Salida</Label>
            <Select value={campus} onValueChange={setCampus}>
              <SelectTrigger className="h-12">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-(--muted-foreground)" />
                  <SelectValue placeholder="Selecciona campus de salida" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Campus Principal">Campus Principal</SelectItem>
                <SelectItem value="Sede El Bosque">Sede El Bosque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label className="sr-only">Destino</Label>
            <PlacesAutocomplete
              placeholder="¿A dónde vas?"
              defaultValue={destino}
              onPlaceSelect={(place) => {
                setDestino(place.address);
              }}
            />
          </div>

          <div className="w-full lg:w-48">
            <Label className="sr-only">Fecha</Label>
            <Input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={minDate}
              icon={<Calendar className="w-5 h-5" />}
              className="h-12"
            />
          </div>

          <Button variant="hero" size="lg" className="h-12">
            <Search className="w-5 h-5" />
            Buscar
          </Button>
        </div>

        {/* Active Filters */}
        {(campus || destino || fecha) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-(--border)">
            <span className="text-sm text-(--muted-foreground)">Filtros activos:</span>
            {campus && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-(--primary)/10 text-(--primary) rounded-full text-sm">
                {campus}
                <button onClick={() => setCampus('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {destino && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-(--primary)/10 text-(--primary) rounded-full text-sm">
                {destino}
                <button onClick={() => setDestino('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {fecha && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-(--primary)/10 text-(--primary) rounded-full text-sm">
                {fecha}
                <button onClick={() => setFecha('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => { setCampus(''); setDestino(''); setFecha(''); }}
              className="text-sm text-(--muted-foreground) hover:text-(--foreground)"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-(--muted-foreground)">
            {filteredRutas.length} ruta{filteredRutas.length !== 1 ? 's' : ''} disponible{filteredRutas.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredRutas.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRutas.map((ruta) => (
              <RouteCard
                key={ruta.id}
                ruta={ruta}
                onReserve={handleReserve}
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
            <Button variant="outline" onClick={() => { setCampus(''); setDestino(''); setFecha(''); }}>
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
