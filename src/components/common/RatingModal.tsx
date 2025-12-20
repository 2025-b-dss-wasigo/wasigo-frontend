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
import { Star, User } from 'lucide-react';
import { toast } from 'sonner';

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driverName: string;
  driverAlias: string;
  tripInfo: string;
}

export function RatingModal({ open, onOpenChange, driverName, driverAlias, tripInfo }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    toast.success('¡Gracias por tu calificación!', {
      description: `Has calificado a ${driverAlias} con ${rating} estrellas.`
    });

    setRating(0);
    setComment('');
    onOpenChange(false);
  };

  const ratingLabels = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calificar Viaje</DialogTitle>
          <DialogDescription>
            Comparte tu experiencia con el conductor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Driver Info */}
          <div className="flex items-center gap-4 p-4 bg-(--muted)/50 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-(--primary)/10 flex items-center justify-center">
              <User className="w-7 h-7 text-(--primary)" />
            </div>
            <div>
              <p className="font-semibold text-(--foreground)">{driverName}</p>
              <p className="text-sm text-(--muted-foreground)">@{driverAlias}</p>
              <p className="text-xs text-(--muted-foreground) mt-1">{tripInfo}</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="text-center space-y-3">
            <p className="text-sm text-(--muted-foreground)">¿Cómo fue tu experiencia?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${star <= (hoveredRating || rating)
                      ? 'fill-(--warning) text-(--warning)'
                      : 'text-(--muted-foreground)/30'
                      }`}
                  />
                </button>
              ))}
            </div>
            {(hoveredRating || rating) > 0 && (
              <p className="text-sm font-medium text-(--foreground)">
                {ratingLabels[hoveredRating || rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-(--foreground)">
              Comentario (opcional)
            </label>
            <Textarea
              placeholder="Cuéntanos más sobre tu experiencia..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={rating === 0}>
            Enviar Calificación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
