'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, AlertCircle, Car, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Passenger {
  id: string;
  alias: string;
  destino: string;
  metodoPago: string;
  otp?: string;
}

interface PassengerValidationListProps {
  passengers: Passenger[];
  onStartTrip: (validatedCount: number) => void;
}

export function PassengerValidationList({ passengers, onStartTrip }: PassengerValidationListProps) {
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [validatedPassengers, setValidatedPassengers] = useState<Record<string, boolean>>({});

  const handleOtpChange = (passengerId: string, value: string) => {
    setOtpInputs((prev) => ({ ...prev, [passengerId]: value }));
  };

  const handleValidateOtp = (passengerId: string, correctOtp: string) => {
    const inputOtp = otpInputs[passengerId] || '';
    if (inputOtp === correctOtp) {
      setValidatedPassengers((prev) => ({ ...prev, [passengerId]: true }));
      toast.success('OTP validado correctamente', {
        description: 'El pasajero ha sido verificado para este viaje.',
      });
    } else {
      toast.error('OTP incorrecto', {
        description: 'El código ingresado no coincide. Pide al pasajero que lo verifique.',
      });
    }
  };

  const handleStartTrip = () => {
    const allValidated = passengers.every((p) => validatedPassengers[p.id]);
    if (allValidated) {
      toast.success('¡Viaje iniciado!', {
        description: 'Todos los pasajeros han sido verificados. ¡Buen viaje!',
      });
    } else {
      toast.warning('Pasajeros pendientes', {
        description: 'Hay pasajeros sin verificar. Puedes iniciar el viaje, pero se marcará como incompleto.',
      });
    }
    onStartTrip(Object.values(validatedPassengers).filter(Boolean).length);
  };

  if (passengers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay pasajeros confirmados para esta ruta</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Pasajeros ({passengers.length})</h2>
        <div className="text-sm text-muted-foreground">
          {Object.values(validatedPassengers).filter(Boolean).length} / {passengers.length} verificados
        </div>
      </div>

      <div className="grid gap-4">
        {passengers.map((passenger) => {
          const isValidated = validatedPassengers[passenger.id];
          return (
            <Card key={passenger.id} className={isValidated ? 'border-success/50 bg-success/5' : ''}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Passenger Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${isValidated ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                        }`}
                    >
                      {isValidated ? <CheckCircle2 className="w-6 h-6" /> : passenger.alias.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{passenger.alias}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{passenger.destino}</span>
                        <span className="text-primary">• {passenger.metodoPago}</span>
                      </div>
                    </div>
                  </div>

                  {/* OTP Validation */}
                  {!isValidated ? (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Código OTP"
                        className="w-32 text-center font-mono"
                        maxLength={6}
                        value={otpInputs[passenger.id] || ''}
                        onChange={(e) => handleOtpChange(passenger.id, e.target.value)}
                      />
                      <Button
                        onClick={() => handleValidateOtp(passenger.id, passenger.otp || '')}
                        disabled={!otpInputs[passenger.id] || otpInputs[passenger.id].length < 6}
                      >
                        Validar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Verificado</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Start Trip Button */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">¿Listo para iniciar el viaje?</p>
              <p className="text-sm text-muted-foreground">
                {Object.values(validatedPassengers).filter(Boolean).length === passengers.length
                  ? 'Todos los pasajeros están verificados'
                  : 'Algunos pasajeros no han sido verificados'}
              </p>
            </div>
            <Button size="lg" onClick={handleStartTrip} className="w-full sm:w-auto">
              <Car className="w-5 h-5 mr-2" />
              Iniciar Viaje
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
