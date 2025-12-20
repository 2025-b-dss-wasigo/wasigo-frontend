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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserPlus, Shield, Headphones, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateUserModal = ({ open, onOpenChange }: CreateUserModalProps) => {
  const [step, setStep] = useState<'form' | 'creating' | 'success'>('form');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.nombre && formData.apellido && formData.email.includes('@') && formData.rol;

  const handleSubmit = () => {
    if (!isFormValid) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setStep('creating');
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ nombre: '', apellido: '', email: '', rol: '' });
    onOpenChange(false);
  };

  const handleFinish = () => {
    toast.success('Usuario creado', {
      description: `Se ha enviado un correo de invitación a ${formData.email}`
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-(--primary)" />
                Crear Usuario Staff
              </DialogTitle>
              <DialogDescription>
                Crea una cuenta para un nuevo miembro del equipo
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@epn.edu.ec"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <p className="text-xs text-(--muted-foreground)">
                  Se enviará una invitación a este correo
                </p>
              </div>

              <div className="space-y-3">
                <Label>Rol del usuario</Label>
                <RadioGroup value={formData.rol} onValueChange={(value) => handleInputChange('rol', value)}>
                  <div className="flex items-start space-x-3 p-3 rounded-lg border border-(--border) hover:bg-(--accent)/50 transition-colors">
                    <RadioGroupItem value="soporte" id="soporte" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="soporte" className="flex items-center gap-2 cursor-pointer">
                        <Headphones className="w-4 h-4 text-(--warning)" />
                        Soporte
                      </Label>
                      <p className="text-xs text-(--muted-foreground) mt-1">
                        Puede gestionar tickets y ver alias de usuarios
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg border border-(--border) hover:bg-(--accent)/50 transition-colors">
                    <RadioGroupItem value="admin" id="admin" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="admin" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="w-4 h-4 text-(--destructive)" />
                        Administrador
                      </Label>
                      <p className="text-xs text-(--muted-foreground) mt-1">
                        Acceso completo: usuarios, transacciones, auditoría
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={!isFormValid}>
                Crear Usuario
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'creating' && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 text-(--primary) animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-(--foreground)">Creando usuario...</p>
            <p className="text-sm text-(--muted-foreground)">Por favor espera un momento</p>
          </div>
        )}

        {step === 'success' && (
          <>
            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-(--success)/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-(--success)" />
              </div>
              <h3 className="text-xl font-bold text-(--foreground) mb-2">¡Usuario Creado!</h3>
              <p className="text-(--muted-foreground)">
                Se ha enviado una invitación a <strong>{formData.email}</strong>
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
