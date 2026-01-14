'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Banknote } from 'lucide-react';
import { PaymentMethod } from '@/interfaces/payments/payment.interface';

interface PaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (method: PaymentMethod) => void;
  isLoading?: boolean;
}

export function PaymentMethodModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('PAYPAL');

  const handleConfirm = () => {
    onConfirm(selectedMethod);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Seleccionar Método de Pago</DialogTitle>
          <DialogDescription>
            Elige cómo deseas pagar tu reserva
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
            {/* PayPal Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent"
              onClick={() => setSelectedMethod('PAYPAL')}>
              <RadioGroupItem value="PAYPAL" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-3 flex-1 cursor-pointer">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold">PayPal</p>
                  <p className="text-sm text-muted-foreground">Pago en línea seguro</p>
                </div>
              </Label>
            </div>

            {/* Efectivo Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent"
              onClick={() => setSelectedMethod('EFECTIVO')}>
              <RadioGroupItem value="EFECTIVO" id="efectivo" />
              <Label htmlFor="efectivo" className="flex items-center gap-3 flex-1 cursor-pointer">
                <Banknote className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">Efectivo</p>
                  <p className="text-sm text-muted-foreground">Pago al conductor</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
