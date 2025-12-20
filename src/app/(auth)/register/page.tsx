'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Car, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    // Simulate registration
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    setStep(3); // Show verification step
  };

  const renderStep1 = () => (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            placeholder="Carlos"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            icon={<User className="w-5 h-5" />}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            placeholder="Mendoza"
            value={formData.apellido}
            onChange={(e) => handleChange('apellido', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="celular">Celular</Label>
        <Input
          id="celular"
          placeholder="0991234567"
          value={formData.celular}
          onChange={(e) => handleChange('celular', e.target.value)}
          icon={<Phone className="w-5 h-5" />}
          required
        />
        <p className="text-xs text-(--muted-foreground)">Debe iniciar con 09</p>
      </div>

      <Button
        type="button"
        variant="hero"
        size="lg"
        className="w-full"
        onClick={() => setStep(2)}
        disabled={!formData.nombre || !formData.apellido || !formData.celular}
      >
        Continuar
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="email">Correo Institucional</Label>
        <Input
          id="email"
          type="email"
          placeholder="usuario@epn.edu.ec"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          required
        />
        <p className="text-xs text-(--muted-foreground)">Solo correos @epn.edu.ec</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            icon={<Lock className="w-5 h-5" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted-foreground) hover:text-(--foreground)"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-(--muted-foreground)">Min 7 caracteres, mayúsculas, números y caracteres especiales</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          icon={<Lock className="w-5 h-5" />}
          required
        />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="terminos"
          checked={formData.aceptaTerminos}
          onCheckedChange={(checked) => handleChange('aceptaTerminos', checked as boolean)}
        />
        <label htmlFor="terminos" className="text-sm text-(--muted-foreground) cursor-pointer">
          Acepto los{' '}
          <Link href="/terminos" className="text-(--primary) hover:underline">Términos y Condiciones</Link>
          {' '}y la{' '}
          <Link href="/privacidad" className="text-(--primary) hover:underline">Política de Privacidad</Link>
        </label>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setStep(1)}
        >
          <ArrowLeft className="w-5 h-5" />
          Atrás
        </Button>
        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="flex-1"
          disabled={loading || !formData.email || !formData.password || !formData.aceptaTerminos}
        >
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="w-20 h-20 mx-auto rounded-full bg-(--success)/10 flex items-center justify-center">
        <Mail className="w-10 h-10 text-(--success)" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-(--foreground) mb-2">¡Verifica tu correo!</h3>
        <p className="text-(--muted-foreground)">
          Hemos enviado un código de verificación a<br />
          <span className="font-medium text-(--foreground)">{formData.email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label>Código de Verificación</Label>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-(--input) bg-(--background) focus:border-(--primary) focus:ring-2 focus:ring-(--ring)"
            />
          ))}
        </div>
        <p className="text-xs text-(--muted-foreground)">El código expira en 15 minutos</p>
      </div>

      <Button
        variant="hero"
        size="lg"
        className="w-full"
        onClick={() => {
          toast.success('¡Cuenta verificada exitosamente!');
          navigate.replace('/login');
        }}
      >
        Verificar Cuenta
        <CheckCircle className="w-5 h-5" />
      </Button>

      <button className="text-sm text-(--primary) hover:underline">
        Reenviar código (3 intentos restantes)
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-(--background)">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-(--primary) flex items-center justify-center">
              <Car className="w-7 h-7 text-(--primary-foreground)" />
            </div>
            <h1 className="text-2xl font-bold text-(--foreground)">WasiGo</h1>
          </div>

          {step < 3 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-(--foreground) mb-2">Crear Cuenta</h2>
                <p className="text-(--muted-foreground)">Únete a la comunidad WasiGo</p>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2].map((s) => (
                  <React.Fragment key={s}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s
                      ? 'bg-(--primary) text-(--primary-foreground)'
                      : 'bg-(--muted) text-(--muted-foreground)'
                      }`}>
                      {s}
                    </div>
                    {s < 2 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-(--primary)' : 'bg-(--muted)'}`} />}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </form>

          {step < 3 && (
            <div className="mt-6 text-center">
              <p className="text-(--muted-foreground)">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-(--primary) font-medium hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <h2 className="text-3xl xl:text-4xl font-bold text-(--primary-foreground) mb-4 leading-tight">
            Tu viaje universitario<br />comienza aquí
          </h2>

          <p className="text-lg text-(--primary-foreground)/80 mb-8 max-w-md">
            Regístrate con tu correo @epn.edu.ec y empieza a compartir viajes con tus compañeros de forma segura y económica.
          </p>

          <div className="space-y-4 max-w-md">
            {[
              { icon: CheckCircle, text: 'Verificación con correo institucional' },
              { icon: CheckCircle, text: 'Sistema de calificaciones bidireccional' },
              { icon: CheckCircle, text: 'Pagos seguros con múltiples métodos' },
              { icon: CheckCircle, text: 'Chat grupal para coordinar viajes' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-(--primary-foreground)/90">
                <feature.icon className="w-5 h-5 text-(--primary-foreground)" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
