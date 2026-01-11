'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  MapPin, Clock, Users, DollarSign, Calendar,
  ArrowRight, Car, Info, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { FormularioRuta } from '@/interfaces';
import PlacesAutocomplete from '@/components/maps/PlacesAutocomplete';
import { createRoute } from '@/actions';
import { CreateRouteRequest, GeoPoint, OrigenCampus } from '@/interfaces/routes/CreateRouteRequest.interface';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';

const diasSemana = [
  { id: 'lunes', label: 'Lunes', dayOfWeek: 1 },
  { id: 'martes', label: 'Martes', dayOfWeek: 2 },
  { id: 'miercoles', label: 'Miércoles', dayOfWeek: 3 },
  { id: 'jueves', label: 'Jueves', dayOfWeek: 4 },
  { id: 'viernes', label: 'Viernes', dayOfWeek: 5 },
];

const horasDisponibles = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

const origenesDisponibles = [
  {
    id: 'campus-principal',
    label: 'Campus Principal EPN (Parqueaderos del CEC) Av Toledo',
    displayValue: 'Campus Principal EPN (Parqueaderos del CEC) Av Toledo',
    apiValue: 'CAMPUS_PRINCIPAL' as OrigenCampus,
    coordenadas: { lat: -0.2094931, lng: -78.4873596 }
  },
  {
    id: 'campus-bosque',
    label: 'Campus EPN El Bosque',
    displayValue: 'Campus EPN El Bosque',
    apiValue: 'EL_BOSQUE' as OrigenCampus,
    coordenadas: { lat: -0.1641702, lng: -78.5007102 }
  }
];

// Función para obtener los días de la semana actual con fechas
const getWeekDaysWithDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado

  // Si es sábado (6) o domingo (0), mostrar la próxima semana
  let firstDay = new Date(today);
  let diff;

  if (dayOfWeek === 0) {
    // Si es domingo, el próximo lunes es en 1 día
    diff = firstDay.getDate() + 1;
  } else if (dayOfWeek === 6) {
    // Si es sábado, el próximo lunes es en 2 días
    diff = firstDay.getDate() + 2;
  } else {
    // Si es entre lunes y viernes, calcular el lunes de la semana actual
    diff = firstDay.getDate() - dayOfWeek + 1;
  }

  firstDay.setDate(diff);

  const weekDays = diasSemana.map((dia, index) => {
    const date = new Date(firstDay);
    date.setDate(date.getDate() + index);
    return {
      ...dia,
      date: date.getDate(),
      fullDate: date.toISOString().split('T')[0] // Formato YYYY-MM-DD
    };
  });

  return weekDays;
};

export function CreateRouteForm() {
  const navigate = useRouter();
  const [step, setStep] = useState(1);
  const [weekDays, setWeekDays] = useState(getWeekDaysWithDates());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinoCoordenadas, setDestinoCoordenadas] = useState({ lat: 0, lng: 0 });
  const [formData, setFormData] = useState<FormularioRuta>({
    origen: 'CAMPUS_PRINCIPAL',
    destino: '',
    hora: '',
    diasRecurrentes: [] as string[],
    asientosDisponibles: 3,
    precioPorAsiento: 1.50,
    esRecurrente: true,
    nota: '',
  });

  useEffect(() => {
    setWeekDays(getWeekDaysWithDates());
  }, []);

  const handleDiaChange = (dia: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      diasRecurrentes: checked ? [dia] : []
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Obtener las coordenadas del origen
      const origenSeleccionado = origenesDisponibles.find(o => o.apiValue === formData.origen);
      if (!origenSeleccionado) {
        toast.error('Error', { description: 'Origen no válido' });
        return;
      }

      // Obtener la fecha del día seleccionado
      const diaSeleccionado = weekDays.find(d => d.id === formData.diasRecurrentes[0]);
      if (!diaSeleccionado) {
        toast.error('Error', { description: 'Día no válido' });
        return;
      }

      // Crear las paradas (solo destino)
      const stops = [
        {
          lat: destinoCoordenadas.lat,
          lng: destinoCoordenadas.lng,
          direccion: formData.destino
        }
      ];

      console.log("Coordenadas enviadas al API:", stops);

      // Construir el body para el API
      const routeData: CreateRouteRequest = {
        origen: origenSeleccionado.apiValue,
        fecha: diaSeleccionado.fullDate,
        horaSalida: formData.hora,
        destinoBase: formData.destino,
        asientosTotales: formData.asientosDisponibles,
        precioPasajero: formData.precioPorAsiento,
        mensaje: formData.nota || 'Conductor puntual',
        stops: stops
      };

      const result = await createRoute(routeData);

      if (result.success) {
        toast.success('¡Éxito!', {
          description: 'Tu ruta ha sido creada exitosamente'
        });
        navigate.push('/driver/my-routes');
      } else {
        toast.error('Error', {
          description: result.message || 'No se pudo crear la ruta'
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Ocurrió un error al crear la ruta'
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Full Screen Loader */}
      {isSubmitting && <FullScreenLoader />}

      <div>
        <h1 className="text-2xl font-bold text-(--foreground)">Crear Nueva Ruta</h1>
        <p className="text-(--muted-foreground) mt-1">
          Configura los detalles de tu ruta para que los pasajeros puedan encontrarte
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center">
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
                  const origenSeleccionado = origenesDisponibles.find(o => o.apiValue === v);
                  if (origenSeleccionado) {
                    console.log("Origen seleccionado:", {
                      campus: origenSeleccionado.label,
                      coordenadas: origenSeleccionado.coordenadas
                    });
                  }
                  setFormData({ ...formData, origen: v as OrigenCampus });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el campus de origen" />
                </SelectTrigger>
                <SelectContent>
                  {origenesDisponibles.map((origen) => (
                    <SelectItem key={origen.id} value={origen.apiValue}>
                      {origen.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">Punto de Destino</Label>
              <PlacesAutocomplete
                placeholder="Ej: San Rafael, Valle de los Chillos"
                defaultValue={formData.destino}
                onPlaceSelect={(place) => {
                  console.log("Respuesta completa de Google Maps:", place);
                  setFormData({ ...formData, destino: place.address });
                  setDestinoCoordenadas({ lat: place.lat, lng: place.lng });

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
              <Label>Día de la Semana</Label>
              <RadioGroup value={formData.diasRecurrentes[0] || ''}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {weekDays.map((dia) => {
                    const isSelected = formData.diasRecurrentes.includes(dia.id);

                    return (
                      <div
                        key={dia.id}
                        onClick={() => handleDiaChange(dia.id, !isSelected)}
                        className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors cursor-pointer select-none ${isSelected
                          ? 'border-(--primary) bg-(--primary)/10'
                          : 'border-(--border) hover:border-(--primary)/50'
                          }`}
                      >
                        <RadioGroupItem
                          value={dia.id}
                          id={dia.id}
                          checked={isSelected}
                          className="pointer-events-none"
                        />
                        <Label
                          htmlFor={dia.id}
                          className="cursor-pointer select-none flex-1 pointer-events-none"
                        >
                          {dia.label} {dia.date}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
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
                <div className="flex items-center gap-2 min-w-20 justify-center">
                  <Users className="w-5 h-5 text-(--primary)" />
                  <span className="text-2xl font-bold">{formData.asientosDisponibles}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData({ ...formData, asientosDisponibles: Math.min(7, formData.asientosDisponibles + 1) })}
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

            <div className="space-y-2">
              <Label htmlFor="nota">Nota (Opcional)</Label>
              <Textarea
                id="nota"
                placeholder="Ej: Punto de partida exacto, detalles adicionales, etc."
                maxLength={100}
                value={formData.nota || ''}
                onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                className="resize-none"
              />
              <p className="text-xs text-(--muted-foreground) text-right">
                {(formData.nota || '').length}/100 caracteres
              </p>
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
                  <span className="text-(--muted-foreground)">Fecha:</span>
                  <span className="font-medium">
                    {formData.diasRecurrentes.length > 0
                      ? weekDays.find(d => d.id === formData.diasRecurrentes[0])?.fullDate
                      : 'No seleccionado'}
                  </span>
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
              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
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
