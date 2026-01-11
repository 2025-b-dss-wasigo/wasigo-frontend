'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaCheckCircle } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Importar Confetti de manera dinámica para evitar problemas de hidratación
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

interface VerificationSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export const VerificationSuccessModal: React.FC<VerificationSuccessModalProps> = ({
  open,
  onClose,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (open) {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, [open]);

  const handleClose = () => {
    onClose();

    // ✅ Agregar delay antes de recargar para que se vea el confeti
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <>
      {open && dimensions.width > 0 && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.3}
        />
      )}

      <Dialog open={open} onOpenChange={() => { }}>
        <DialogContent
          className="max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-(--success)/10 flex items-center justify-center animate-bounce">
                <FaCheckCircle className="w-10 h-10 text-(--success)" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">¡Felicitaciones!</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-center py-4">
            <p className="text-(--foreground) font-semibold text-lg">
              Tu identidad ha sido verificada exitosamente
            </p>
            <p className="text-(--muted-foreground) text-sm">
              Ahora tienes acceso completo a todas las funciones de WasiGo. ¡Bienvenido a nuestra comunidad de universitarios!
            </p>
          </div>

          <Button
            onClick={handleClose}
            className="w-full bg-(--success) hover:bg-(--success)/90 text-(--success-foreground)"
          >
            Continuar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
