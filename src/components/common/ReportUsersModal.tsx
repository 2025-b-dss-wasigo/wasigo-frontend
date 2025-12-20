import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, User, Loader2, CheckCircle2, Car } from 'lucide-react';
import { toast } from 'sonner';

export interface TripUser {
  id: string;
  nombre: string;
  alias: string;
  foto?: string;
  isDriver: boolean;
}

interface ReportUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripInfo: string;
  users: TripUser[];
}

const reportReasons = [
  { id: 'conducta', label: 'Conducta inapropiada' },
  { id: 'seguridad', label: 'Problemas de seguridad' },
  { id: 'pago', label: 'Problemas de pago' },
  { id: 'puntualidad', label: 'Impuntualidad' },
  { id: 'otro', label: 'Otro motivo' },
];

export function ReportUsersModal({ open, onOpenChange, tripInfo, users }: ReportUsersModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<'select' | 'form' | 'submitting' | 'success'>('select');

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleNext = () => {
    if (selectedUsers.length === 0) {
      toast.error('Selecciona al menos un usuario');
      return;
    }
    setStep('form');
  };

  const handleSubmit = () => {
    if (!reason) {
      toast.error('Por favor selecciona un motivo');
      return;
    }
    if (!description.trim()) {
      toast.error('Por favor describe el incidente');
      return;
    }

    setStep('submitting');
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  const handleClose = () => {
    setStep('select');
    setSelectedUsers([]);
    setReason('');
    setDescription('');
    onOpenChange(false);
  };

  const handleFinish = () => {
    const selectedNames = users
      .filter(u => selectedUsers.includes(u.id))
      .map(u => u.nombre)
      .join(', ');
    toast.success('Reporte enviado', {
      description: `Has reportado a: ${selectedNames}`
    });
    handleClose();
  };

  const driver = users.find(u => u.isDriver);
  const passengers = users.filter(u => !u.isDriver);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'select' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-(--destructive)" />
                Reportar Usuarios
              </DialogTitle>
              <DialogDescription>
                Selecciona a quién deseas reportar de este viaje
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <p className="text-sm text-(--muted-foreground) mb-4">{tripInfo}</p>

              {/* Driver Section */}
              {driver && (
                <div className="mb-4">
                  <Label className="text-xs text-(--muted-foreground) uppercase tracking-wide mb-2 block">
                    Conductor
                  </Label>
                  <div
                    onClick={() => handleUserToggle(driver.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedUsers.includes(driver.id)
                      ? 'border-(--destructive) bg-(--destructive)/5'
                      : 'border-(--border) hover:border-(--muted-foreground)/50'
                      }`}
                  >
                    <Checkbox
                      checked={selectedUsers.includes(driver.id)}
                      onCheckedChange={() => handleUserToggle(driver.id)}
                    />
                    <div className="w-10 h-10 rounded-full bg-(--primary)/10 flex items-center justify-center overflow-hidden">
                      {driver.foto ? (
                        <img src={driver.foto} alt={driver.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <Car className="w-5 h-5 text-(--primary)" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-(--foreground)">{driver.nombre}</p>
                      <p className="text-xs text-(--muted-foreground)">@{driver.alias}</p>
                      <p className="text-xs text-(--primary)">Conductor</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Passengers Section */}
              {passengers.length > 0 && (
                <div>
                  <Label className="text-xs text-(--muted-foreground) uppercase tracking-wide mb-2 block">
                    Pasajeros ({passengers.length})
                  </Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {passengers.map((passenger) => (
                      <div
                        key={passenger.id}
                        onClick={() => handleUserToggle(passenger.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedUsers.includes(passenger.id)
                          ? 'border-(--destructive) bg-(--destructive)/5'
                          : 'border-(--border) hover:border-(--muted-foreground)/50'
                          }`}
                      >
                        <Checkbox
                          checked={selectedUsers.includes(passenger.id)}
                          onCheckedChange={() => handleUserToggle(passenger.id)}
                        />
                        <div className="w-10 h-10 rounded-full bg-(--muted) flex items-center justify-center overflow-hidden">
                          {passenger.foto ? (
                            <img src={passenger.foto} alt={passenger.nombre} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-(--muted-foreground)" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-(--foreground)">{passenger.nombre}</p>
                          <p className="text-xs text-(--muted-foreground)">@{passenger.alias}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedUsers.length > 0 && (
                <div className="mt-4 p-3 bg-(--destructive)/5 rounded-lg border border-(--destructive)/20">
                  <p className="text-sm text-(--destructive)">
                    {selectedUsers.length} usuario(s) seleccionado(s) para reportar
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleNext}
                className="flex-1"
                disabled={selectedUsers.length === 0}
              >
                Continuar
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-(--destructive)" />
                Detalles del Reporte
              </DialogTitle>
              <DialogDescription>
                Reportando a {selectedUsers.length} usuario(s)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Selected Users Summary */}
              <div className="flex flex-wrap gap-2">
                {users
                  .filter(u => selectedUsers.includes(u.id))
                  .map(user => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-(--destructive)/10 rounded-full"
                    >
                      <div className="w-6 h-6 rounded-full bg-(--muted) flex items-center justify-center overflow-hidden">
                        {user.foto ? (
                          <img src={user.foto} alt={user.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-3 h-3 text-(--muted-foreground)" />
                        )}
                      </div>
                      <span className="text-sm text-(--destructive)">{user.nombre}</span>
                    </div>
                  ))
                }
              </div>

              {/* Reason Selection */}
              <div className="space-y-3">
                <Label>¿Cuál es el motivo del reporte?</Label>
                <RadioGroup value={reason} onValueChange={setReason}>
                  {reportReasons.map((r) => (
                    <div key={r.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={r.id} id={r.id} />
                      <Label htmlFor={r.id} className="font-normal cursor-pointer">
                        {r.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Describe lo sucedido
                </Label>
                <Textarea
                  id="description"
                  placeholder="Por favor proporciona detalles sobre el incidente..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
                Atrás
              </Button>
              <Button
                variant="destructive"
                onClick={handleSubmit}
                className="flex-1"
                disabled={!reason || !description.trim()}
              >
                Enviar Reporte
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'submitting' && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 text-(--primary) animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-(--foreground)">Enviando reporte...</p>
            <p className="text-sm text-(--muted-foreground)">Por favor espera un momento</p>
          </div>
        )}

        {step === 'success' && (
          <>
            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-(--success)/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-(--success)" />
              </div>
              <h3 className="text-xl font-bold text-(--foreground) mb-2">¡Reporte Enviado!</h3>
              <p className="text-(--muted-foreground)">
                Nuestro equipo de soporte revisará tu reporte y tomará las medidas necesarias.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleFinish} className="w-full">
                Entendido
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
