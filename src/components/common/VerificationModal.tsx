'use client';

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { AlertCircle } from 'lucide-react';
import { sendVerificationCode } from '@/actions';
import { ConfirmVerificationCode } from '@/actions';
import { FullScreenLoader } from './FullScreenLoader';

interface VerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);

    const newCode = [...code];
    digits.split('').forEach((digit, index) => {
      newCode[index] = digit;
    });
    setCode(newCode);

    if (digits.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');

    // Validar que todos los campos estén completos
    if (code.some(digit => digit === '')) {
      setError('Por favor completa todos los dígitos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await ConfirmVerificationCode(fullCode);

      if (response.success) {
        setIsLoading(false);
        // ✅ Solo cerrar el modal, sin actualizar authStore ni mostrar modales
        onOpenChange(false);
        return;
      }

      let errorMessage = response.message || 'Error al verificar el código';

      if (response.statusCode === 429) {
        errorMessage = 'Demasiadas solicitudes, inténtalo de nuevo más tarde';
      }

      setError(errorMessage);
      setIsLoading(false);
    } catch (err) {
      setError('Error al procesar la solicitud');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      const response = await sendVerificationCode();

      if (response.success) {
        setResendSuccess(true);
        setResendLoading(false);
        setTimeout(() => {
          setResendSuccess(false);
        }, 3000);
        return;
      }

      let errorMessage = response.message || 'Error al reenviar el código';

      if (response.statusCode === 429) {
        errorMessage = 'Demasiadas solicitudes, inténtalo de nuevo más tarde';
      }

      setError(errorMessage);
      setResendLoading(false);
    } catch (err) {
      setError('Error al procesar la solicitud');
      setResendLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
    }
  };

  return (
    <>
      <FullScreenLoader isOpen={isLoading} message="Verificando código..." />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            if (isLoading) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-(--primary)/10 flex items-center justify-center">
                <FaCheckCircle className="w-8 h-8 text-(--primary)" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Verifica tu identidad</DialogTitle>
            <DialogDescription className="text-center mt-2">
              Hemos enviado un código de 6 dígitos a tu correo electrónico. Ingresalo a continuación para completar la verificación.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Code Input Grid */}
            <div className="flex gap-2 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-(--primary)/20 rounded-lg bg-(--primary)/5 focus:border-(--primary) focus:outline-none focus:ring-2 focus:ring-(--primary)/20 transition-all duration-200 hover:border-(--primary)/40"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-(--destructive)/10 border border-(--destructive)/20 rounded-lg text-(--destructive) text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {resendSuccess && (
              <div className="flex items-center gap-2 p-3 bg-(--success)/10 border border-(--success)/20 rounded-lg text-(--success) text-sm">
                <FaCheckCircle className="w-4 h-4 shrink-0" />
                <span>Código reenviado exitosamente</span>
              </div>
            )}

            {/* Info Text */}
            <p className="text-center text-xs text-(--muted-foreground)">
              ¿No recibiste el código? <button onClick={handleResend} disabled={resendLoading} className="text-(--primary) hover:underline font-medium disabled:opacity-50">
                {resendLoading ? 'Reenviando...' : 'Reenviar'}
              </button>
            </p>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isLoading || code.join('').length !== 6}
            className="w-full bg-(--primary) hover:bg-(--primary)/90 text-white flex items-center justify-center gap-2"
          >
            Verificar
            <FaArrowRight className="w-4 h-4" />
          </Button>

          {/* Footer */}
          <p className="text-center text-xs text-(--muted-foreground)">
            Tus datos están protegidos y encriptados de forma segura
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};
