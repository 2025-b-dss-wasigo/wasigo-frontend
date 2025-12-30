'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MapPin, Clock, Users, DollarSign, Calendar,
  ArrowRight, Car, Info, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { FormularioRuta } from '@/interfaces';
import PlacesAutocomplete from '@/components/maps/PlacesAutocomplete';

const diasSemana = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'martes', label: 'Martes' },
  { id: 'miercoles', label: 'Miércoles' },
  { id: 'jueves', label: 'Jueves' },
  { id: 'viernes', label: 'Viernes' },
];

const horasDisponibles = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '12:00', '13:00', '14:00', '17:00', '18:00', '19:00'
];

const origenesDisponibles = [
  {
    id: 'campus-principal',
    label: 'Campus Principal EPN (Parqueaderos del CEC) Av Toledo',
    value: 'Campus Principal EPN (Parqueaderos del CEC) Av Toledo',
    coordenadas: { lat: -0.2108, lng: -78.4903 }
  },
  {
    id: 'campus-bosque',
    label: 'Campus EPN El Bosque',
    value: 'Campus EPN El Bosque',
    coordenadas: { lat: -0.1750, lng: -78.4900 }
  }
];

export function CreateRouteForm() {
  const navigate = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormularioRuta>({
    origen: '',
    destino: '',
    hora: '',
    diasRecurrentes: [] as string[],
    asientosDisponibles: 3,
    precioPorAsiento: 1.50,
    esRecurrente: true,
  });

  const handleDiaChange = (dia: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      diasRecurrentes: checked
        ? [...prev.diasRecurrentes, dia]
        : prev.diasRecurrentes.filter(d => d !== dia)
    }));
  };

  const handleSubmit = () => {
    toast.success('¡Ruta creada exitosamente!', {
      description: 'Tu ruta está ahora visible para los pasajeros.'
    });
    navigate.push('/my-routes');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-(--foreground)">Crear Nueva Ruta</h1>
        <p className="text-(--muted-foreground) mt-1">
          Configura los detalles de tu ruta para que los pasajeros puedan encontrarte
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s ? 'bg-(--primary) text-(--primary-foreground)' : 'bg-(--muted) text-(--muted-foreground)'
              }`}>
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${step > s ? 'bg-(--primary)' : 'bg-(--muted)'
                }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Route Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-(--primary)" />
              Detalles de la Ruta
            </CardTitle>
            <CardDescription>Define el origen, destino y horario de tu ruta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="origen">Punto de Origen (Campus EPN)</Label>
              <Select
                value={formData.origen}
                onValueChange={(v) => {
                  const origenSeleccionado = origenesDisponibles.find(o => o.value === v);
                  if (origenSeleccionado) {
                    console.log("Origen seleccionado:", {
                      campus: origenSeleccionado.label,
                      coordenadas: origenSeleccionado.coordenadas
                    });
                  }
                  setFormData({ ...formData, origen: v });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el campus de origen" />
                </SelectTrigger>
                <SelectContent>
                  {origenesDisponibles.map((origen) => (
                    <SelectItem key={origen.id} value={origen.value}>
                      {origen.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center py-2">
              <ArrowRight className="w-5 h-5 text-(--muted-foreground)" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">Punto de Destino</Label>
              <PlacesAutocomplete
                placeholder="Ej: San Rafael, Valle de los Chillos"
                defaultValue={formData.destino}
                onPlaceSelect={(place) => {
                  setFormData({ ...formData, destino: place.address });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Hora de Salida</Label>
              <Select value={formData.hora} onValueChange={(v) => setFormData({ ...formData, hora: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la hora" />
                </SelectTrigger>
                <SelectContent>
                  {horasDisponibles.map((hora) => (
                    <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="default"
                onClick={() => setStep(2)}
                disabled={!formData.origen || !formData.destino || !formData.hora}
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Schedule */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-(--primary)" />
              Programación
            </CardTitle>
            <CardDescription>Define los días en que realizarás esta ruta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Días Recurrentes</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {diasSemana.map((dia) => (
                  <div
                    key={dia.id}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors cursor-pointer ${formData.diasRecurrentes.includes(dia.id)
                      ? 'border-(--primary) bg-(--primary)/10'
                      : 'border-(--border) hover:border-(--primary)/50'
                      }`}
                    onClick={() => handleDiaChange(dia.id, !formData.diasRecurrentes.includes(dia.id))}
                  >
                    <Checkbox
                      checked={formData.diasRecurrentes.includes(dia.id)}
                      onCheckedChange={(checked) => handleDiaChange(dia.id, checked as boolean)}
                    />
                    <Label className="cursor-pointer">{dia.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-(--muted)/50 rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 text-(--primary) shrink-0 mt-0.5" />
              <p className="text-sm text-(--muted-foreground)">
                Las rutas recurrentes se publicarán automáticamente cada semana en los días seleccionados.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Atrás
              </Button>
              <Button
                variant="default"
                onClick={() => setStep(3)}
                disabled={formData.diasRecurrentes.length === 0}
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Pricing */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-(--primary)" />
              Precio y Capacidad
            </CardTitle>
            <CardDescription>Define el costo y asientos disponibles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asientos">Asientos Disponibles</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData({ ...formData, asientosDisponibles: Math.max(1, formData.asientosDisponibles - 1) })}
                >
                  -
                </Button>
                <div className="flex items-center gap-2 min-w-[80px] justify-center">
                  <Users className="w-5 h-5 text-(--primary)" />
                  <span className="text-2xl font-bold">{formData.asientosDisponibles}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData({ ...formData, asientosDisponibles: Math.min(4, formData.asientosDisponibles + 1) })}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio por Asiento (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--muted-foreground)" />
                <Input
                  id="precio"
                  type="number"
                  step="0.25"
                  min="0.50"
                  max="5.00"
                  className="pl-9"
                  value={formData.precioPorAsiento}
                  onChange={(e) => setFormData({ ...formData, precioPorAsiento: parseFloat(e.target.value) })}
                />
              </div>
              <p className="text-xs text-(--muted-foreground)">Precio recomendado: $1.00 - $2.00</p>
            </div>

            {/* Summary */}
            <div className="p-4 bg-(--primary)/10 border border-(--primary)/20 rounded-lg space-y-3 mt-6">
              <h4 className="font-semibold text-(--foreground)">Resumen de la Ruta</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">Origen:</span>
                  <span className="font-medium">{formData.origen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">Destino:</span>
                  <span className="font-medium">{formData.destino}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">Hora:</span>
                  <span className="font-medium">{formData.hora}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">Días:</span>
                  <span className="font-medium">{formData.diasRecurrentes.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">Ganancia potencial/viaje:</span>
                  <span className="font-bold text-(--primary)">
                    ${(formData.asientosDisponibles * formData.precioPorAsiento).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Atrás
              </Button>
              <Button variant="default" onClick={handleSubmit}>
                <Car className="w-4 h-4 mr-2" />
                Publicar Ruta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
