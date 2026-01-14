'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { submitRating } from '@/actions';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeId: string;
  driverId: string;
  driverName: string;
  onRatingSubmitted?: () => void;
}

export function RatingModal({
  open,
  onOpenChange,
  routeId,
  driverId,
  driverName,
  onRatingSubmitted,
}: RatingModalProps) {
  const [score, setScore] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
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
        toUserId: driverId,
        score,
        comment: comment.trim(),
      });

      if (response.success) {
        toast.success('¡Calificación enviada correctamente!');
        setScore(5);
        setComment('');
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
      onOpenChange(false);
    }
  };

  return (
    <>
      <FullScreenLoader isOpen={isLoading} message="Enviando calificación..." />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Calificar a {driverName}</DialogTitle>
            <DialogDescription>
              Comparte tu experiencia del viaje
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
                placeholder="Comparte detalles sobre tu experiencia..."
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
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Enviar Calificación
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
