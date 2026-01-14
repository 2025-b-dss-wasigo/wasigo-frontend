'use client';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DollarSign, CreditCard, AlertCircle, CheckCircle2,
  ArrowRight, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { requestPayout } from '@/actions/payouts';

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  paypalEmail: string;
}

export function WithdrawModal({ open, onOpenChange, availableBalance, paypalEmail }: WithdrawModalProps) {
  const [step, setStep] = useState<'amount' | 'confirm' | 'processing' | 'success'>('amount');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const minAmount = 5;
  const { user } = useAuthStore();

  const generateIdempotencyKey = (): string => {
    if (!user?.alias) {
      throw new Error('User alias not found');
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const dateStr = `${year}${month}${day}`;
    const timeStr = `${hours}${minutes}`;

    return `${user.alias}${dateStr}${timeStr}`;
  };

  const handleContinue = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < minAmount) {
      toast.error(`El monto mínimo es $${minAmount}`);
      return;
    }
    if (numAmount > availableBalance) {
      toast.error('No tienes suficiente saldo disponible');
      return;
    }
    setStep('confirm');
  };

  const handleWithdraw = async () => {
    try {
      setStep('processing');
      setError('');

      const idempotencyKey = generateIdempotencyKey();
      const numAmount = parseFloat(amount);

      const response = await requestPayout({
        amount: numAmount,
        idempotencyKey,
      });

      if (response.success) {
        setTimeout(() => {
          setStep('success');
        }, 2000);
      } else {
        setError(response.message || 'Error al procesar el retiro');
        setStep('confirm');
      }
    } catch (err) {
      console.error('Error in handleWithdraw:', err);
      setError('Error al procesar el retiro. Intenta nuevamente.');
      setStep('confirm');
    }
  };

  const handleClose = () => {
    setStep('amount');
    setAmount('');
    setError('');
    onOpenChange(false);
  };

  const handleFinish = () => {
    toast.success('Retiro procesado', {
      description: `Se han enviado $${amount} a tu cuenta PayPal.`
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'amount' && (
          <>
            <DialogHeader>
              <DialogTitle>Retirar Fondos</DialogTitle>
              <DialogDescription>
                Transfiere tu saldo disponible a PayPal
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Available Balance */}
              <div className="p-4 bg-(--primary)/5 rounded-lg border border-(--primary)/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-(--muted-foreground)">Saldo Disponible</span>
                  <span className="text-2xl font-bold text-(--primary)">${availableBalance.toFixed(2)}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Monto a retirar</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-(--muted-foreground)" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-10 text-lg"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <p className="text-xs text-(--muted-foreground)">Monto mínimo: ${minAmount}</p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {[5, 20, 50].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setAmount(quickAmount.toString())}
                    disabled={quickAmount > availableBalance}
                  >
                    ${quickAmount}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setAmount(availableBalance.toString())}
                >
                  Todo
                </Button>
              </div>

              {/* PayPal Account */}
              <div className="p-4 bg-(--muted)/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">PP</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-(--foreground)">PayPal</p>
                    <p className="text-xs text-(--muted-foreground)">{paypalEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleContinue} className="flex-1" disabled={!amount}>
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle>Confirmar Retiro</DialogTitle>
              <DialogDescription>
                Revisa los detalles antes de continuar
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <div className="p-3 bg-red-500/10 rounded-lg flex items-start gap-3 border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              <div className="p-6 bg-(--muted)/50 rounded-lg text-center">
                <p className="text-sm text-(--muted-foreground) mb-2">Monto a retirar</p>
                <p className="text-4xl font-bold text-(--foreground)">${parseFloat(amount).toFixed(2)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-(--border)">
                  <span className="text-sm text-(--muted-foreground)">Destino</span>
                  <span className="text-sm font-medium text-(--foreground)">PayPal - {paypalEmail}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-(--border)">
                  <span className="text-sm text-(--muted-foreground)">Tiempo estimado</span>
                  <span className="text-sm font-medium text-(--foreground)">1-2 días hábiles</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-(--muted-foreground)">Comisión</span>
                  <span className="text-sm font-medium text-(--success)">$0.00</span>
                </div>
              </div>

              <div className="p-3 bg-(--warning)/10 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-(--warning) shrink-0 mt-0.5" />
                <p className="text-sm text-(--muted-foreground)">
                  Una vez confirmado, el retiro no puede ser cancelado.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
                Volver
              </Button>
              <Button onClick={handleWithdraw} className="flex-1">
                Confirmar Retiro
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 text-(--primary) animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-(--foreground)">Procesando retiro...</p>
            <p className="text-sm text-(--muted-foreground)">Por favor espera un momento</p>
          </div>
        )}

        {step === 'success' && (
          <>
            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-(--success)/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-(--success)" />
              </div>
              <h3 className="text-xl font-bold text-(--foreground) mb-2">¡Retiro Exitoso!</h3>
              <p className="text-(--muted-foreground) mb-4">
                Se han enviado ${parseFloat(amount).toFixed(2)} a tu cuenta PayPal.
              </p>
              <p className="text-sm text-(--muted-foreground)">
                Recibirás los fondos en 1-2 días hábiles.
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
