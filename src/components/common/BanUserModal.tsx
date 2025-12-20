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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Ban, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface BanUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userAlias: string;
  onConfirm: (duration: string, reason: string) => void;
}

const banDurations = [
  { id: '1d', label: '1 día' },
  { id: '3d', label: '3 días' },
  { id: '7d', label: '1 semana' },
  { id: '30d', label: '1 mes' },
  { id: 'permanent', label: 'Permanente' },
];

export const BanUserModal = ({ open, onOpenChange, userName, userAlias, onConfirm }: BanUserModalProps) => {
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!duration) {
      toast.error('Selecciona una duración para el baneo');
      return;
    }
    if (!reason.trim()) {
      toast.error('Proporciona una razón para el baneo');
      return;
    }
    onConfirm(duration, reason);
    setDuration('');
    setReason('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setDuration('');
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-(--destructive)">
            <Ban className="w-5 h-5" />
            Banear Usuario
          </DialogTitle>
          <DialogDescription>
            Esta acción restringirá el acceso del usuario a la plataforma
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-(--destructive)/10 rounded-lg border border-(--destructive)/20">
            <AlertTriangle className="w-5 h-5 text-(--destructive) shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-(--foreground)">¿Estás seguro?</p>
              <p className="text-sm text-(--muted-foreground)">
                Vas a banear a <strong>@{userAlias}</strong> ({userName}).
                El usuario no podrá acceder a la plataforma durante el tiempo especificado.
              </p>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="space-y-3">
            <Label>Duración del baneo</Label>
            <RadioGroup value={duration} onValueChange={setDuration}>
              {banDurations.map((d) => (
                <div key={d.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={d.id} id={d.id} />
                  <Label htmlFor={d.id} className="font-normal cursor-pointer">
                    {d.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="ban-reason">Motivo del baneo</Label>
            <Textarea
              id="ban-reason"
              placeholder="Describe el motivo del baneo..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex-1"
            disabled={!duration || !reason.trim()}
          >
            <Ban className="w-4 h-4 mr-2" />
            Confirmar Baneo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
