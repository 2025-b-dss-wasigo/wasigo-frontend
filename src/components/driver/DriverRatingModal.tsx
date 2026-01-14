'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { submitRating } from '@/actions';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { UserToRate } from '@/interfaces/responses/ratings/CanRateResponse.interface';

interface DriverRatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeId: string;
  usersToRate: UserToRate[];
  onRatingSubmitted?: () => void;
}

type ModalStep = 'select-passenger' | 'rate';

export function DriverRatingModal({
  open,
  onOpenChange,
  routeId,
  usersToRate,
  onRatingSubmitted,
}: DriverRatingModalProps) {
  const [step, setStep] = useState<ModalStep>('select-passenger');
  const [selectedPassenger, setSelectedPassenger] = useState<UserToRate | null>(null);
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPassenger = () => {
    if (!selectedPassenger) {
      toast.error('Por favor selecciona un pasajero');
      return;
    }
    setStep('rate');
  };

  const handleBackToSelect = () => {
    setStep('select-passenger');
  };

  const handleSubmit = async () => {
    if (!selectedPassenger) {
      toast.error('No se ha seleccionado pasajero');
      return;
    }

    if (score === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    if (comment.trim().length === 0) {
      toast.error('Por favor escribe un comentario');
      return;
    }

    setIsLoading(true);
    try {
      const response = await submitRating({
        routeId,
        toUserId: selectedPassenger.userId,
        score,
        comment: comment.trim(),
      });

      if (response.success) {
        toast.success('¡Calificación enviada correctamente!');
        setScore(5);
        setComment('');
        setSelectedPassenger(null);
        setStep('select-passenger');
        onOpenChange(false);
        onRatingSubmitted?.();
        // Refrescar la página después de 1 segundo
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(response.message || 'Error al enviar la calificación');
      }
    } catch (error) {
      console.error('Error al calificar:', error);
      toast.error('Error al enviar la calificación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setScore(5);
      setComment('');
      setSelectedPassenger(null);
      setStep('select-passenger');
      onOpenChange(false);
    }
  };

  return (
    <>
      <FullScreenLoader isOpen={isLoading} message="Enviando calificación..." />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          {/* PASO 1: SELECCIONAR PASAJERO */}
          {step === 'select-passenger' && (
            <>
              <DialogHeader>
                <DialogTitle>Calificar Pasajero</DialogTitle>
                <DialogDescription>
                  Selecciona el pasajero que deseas calificar
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                {usersToRate.length > 0 ? (
                  <>
                    {usersToRate.map((user) => (
                      <button
                        key={user.userId}
                        onClick={() => setSelectedPassenger(user)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${selectedPassenger?.userId === user.userId
                          ? 'border-(--primary) bg-(--primary)/5'
                          : 'border-(--border) hover:border-(--primary)/50'
                          }`}
                      >
                        <div className="text-left">
                          <p className="font-medium text-(--foreground)">{user.name}</p>
                          <p className="text-sm text-(--muted-foreground)">ID: {user.userId}</p>
                        </div>
                        {selectedPassenger?.userId === user.userId && (
                          <div className="w-5 h-5 rounded-full bg-(--primary) flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-(--muted-foreground)">
                    No hay pasajeros para calificar
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button onClick={handleSelectPassenger} disabled={!selectedPassenger || isLoading}>
                  Continuar
                </Button>
              </div>
            </>
          )}

          {/* PASO 2: CALIFICAR */}
          {step === 'rate' && selectedPassenger && (
            <>
              <DialogHeader>
                <DialogTitle>Calificar a {selectedPassenger.name}</DialogTitle>
                <DialogDescription>
                  Comparte tu experiencia con este pasajero
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Score Selection */}
                <div>
                  <label className="text-sm font-medium text-(--foreground) block mb-3">
                    Calificación
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => setScore(value)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${value <= score
                            ? 'fill-(--warning) text-(--warning)'
                            : 'text-(--muted-foreground)'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-(--muted-foreground) mt-2">
                    {score === 5 && 'Excelente experiencia'}
                    {score === 4 && 'Buena experiencia'}
                    {score === 3 && 'Experiencia neutral'}
                    {score === 2 && 'Mala experiencia'}
                    {score === 1 && 'Muy mala experiencia'}
                  </p>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-sm font-medium text-(--foreground) block mb-2">
                    Comentario
                  </label>
                  <Textarea
                    placeholder="Comparte detalles sobre tu experiencia con este pasajero..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-(--muted-foreground) mt-1">
                    {comment.length}/500 caracteres
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleBackToSelect}
                    disabled={isLoading}
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    Enviar Calificación
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
