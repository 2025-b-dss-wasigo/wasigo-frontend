'use client'

import React, { useState } from 'react';
import { authRegister } from '@/actions';
import { Button, Input, Label, Checkbox, FullScreenLoader } from '@/components';
import { User, Phone, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isCelularValid, validateApellido, validateCelular, validateEmail, validateNombre, validatePassword } from '../../lib';

interface RegisterFormData {
  nombre: string;
  apellido: string;
  celular: string;
  email: string;
  password: string;
  confirmPassword: string;
  aceptaTerminos: boolean;
}

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false,
  });

  const handleChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStep1Submit = () => {
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nombreError = validateNombre(formData.nombre);
    if (nombreError) {
      setError(`Nombre: ${nombreError}`);
      toast.error(`Nombre: ${nombreError}`);
      return;
    }

    const apellidoError = validateApellido(formData.apellido);
    if (apellidoError) {
      setError(`Apellido: ${apellidoError}`);
      toast.error(`Apellido: ${apellidoError}`);
      return;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(`Email: ${emailError}`);
      toast.error(`Email: ${emailError}`);
      return;
    }

    const celularError = validateCelular(formData.celular);
    if (celularError) {
      setError(`Celular: ${celularError}`);
      toast.error(`Celular: ${celularError}`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(`Contraseña: ${passwordError}`);
      toast.error(`Contraseña: ${passwordError}`);
      return;
    }

    if (!formData.aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones');
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    const response = await authRegister({
      nombre: formData.nombre,
      apellido: formData.apellido,
      celular: formData.celular,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    setLoading(false);

    if (response.success) {
      const successMsg = '¡Cuenta creada exitosamente!';
      setSuccessMessage(successMsg);
      toast.success(successMsg);
      router.push('/login');
      return;
    }

    setError(response.message!);
    let errorMessage = 'Error al registrarse';
    toast.error(errorMessage);
    return;

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nombre', e.target.value)}
            icon={<User className="w-5 h-5" />}
            required
          />
          {formData.nombre && validateNombre(formData.nombre) && (
            <p className="text-xs text-(--destructive)">{validateNombre(formData.nombre)}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            placeholder="Mendoza"
            value={formData.apellido}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('apellido', e.target.value)}
            required
          />
          {formData.apellido && validateApellido(formData.apellido) && (
            <p className="text-xs text-(--destructive)">{validateApellido(formData.apellido)}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="celular">Celular</Label>
        <Input
          id="celular"
          placeholder="0991234567"
          value={formData.celular}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/\D/g, '');
            handleChange('celular', value.slice(0, 10));
          }}
          icon={<Phone className="w-5 h-5" />}
          required
        />
        <p className="text-xs text-(--muted-foreground)">Formato: 09XXXXXXXX (10 dígitos)</p>
        {formData.celular && isCelularValid(formData.celular) && (
          <p className="text-xs text-(--success)">✓ Formato válido</p>
        )}
        {formData.celular && !isCelularValid(formData.celular) && (
          <p className="text-xs text-(--destructive)">✗ Debe ser 09 + 8 dígitos</p>
        )}
      </div>

      <Button
        type="button"
        variant="hero"
        size="lg"
        className="w-full"
        onClick={handleStep1Submit}
        disabled={
          !formData.nombre ||
          !formData.apellido ||
          !formData.celular ||
          validateNombre(formData.nombre) !== null ||
          validateApellido(formData.apellido) !== null ||
          !isCelularValid(formData.celular)
        }
      >
        Continuar
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );

  const renderStep2 = () => {
    const passwordError = validatePassword(formData.password);
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    return (
      <div className="space-y-5 animate-fade-in">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-(--destructive)/10 border border-(--destructive)/20 rounded-lg text-(--destructive) text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Correo Institucional</Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@epn.edu.ec"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
            icon={<Mail className="w-5 h-5" />}
            required
          />
          <p className="text-xs text-(--muted-foreground)">Debe ser @epn.edu.ec</p>
          {formData.email && !formData.email.endsWith('@epn.edu.ec') && (
            <p className="text-xs text-(--destructive)">✗ Solo correos @epn.edu.ec</p>
          )}
          {formData.email && formData.email.endsWith('@epn.edu.ec') && (
            <p className="text-xs text-(--success)">✓ Email válido</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
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
          {formData.password && (
            <div className="space-y-1 text-xs">
              <p className={!/[a-z]/.test(formData.password) ? 'text-(--muted-foreground)' : 'text-(--success)'}>
                ✓ Al menos una letra minúscula
              </p>
              <p className={!/[A-Z]/.test(formData.password) ? 'text-(--muted-foreground)' : 'text-(--success)'}>
                ✓ Al menos una letra mayúscula
              </p>
              <p className={!/\d/.test(formData.password) ? 'text-(--muted-foreground)' : 'text-(--success)'}>
                ✓ Al menos un número
              </p>
              <p className={!/[^A-Za-z\d]/.test(formData.password) ? 'text-(--muted-foreground)' : 'text-(--success)'}>
                ✓ Al menos un carácter especial (!@#$%^&*)
              </p>
              <p className={formData.password.length < 7 ? 'text-(--muted-foreground)' : 'text-(--success)'}>
                ✓ Mínimo 7 caracteres
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('confirmPassword', e.target.value)}
            icon={<Lock className="w-5 h-5" />}
            required
          />
          {formData.password && formData.confirmPassword && (
            <p className={passwordsMatch ? 'text-xs text-(--success)' : 'text-xs text-(--destructive)'}>
              {passwordsMatch ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="terminos"
            checked={formData.aceptaTerminos}
            onCheckedChange={(checked: boolean) => handleChange('aceptaTerminos', checked)}
          />
          <label htmlFor="terminos" className="text-sm text-(--muted-foreground) cursor-pointer">
            Acepto los{' '}
            <Link href="/terms" className="text-(--primary) hover:underline">Términos y Condiciones</Link>
            {' '}y la{' '}
            <Link href="/privacy" className="text-(--primary) hover:underline">Política de Privacidad</Link>
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setStep(1)}
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5" />
            Atrás
          </Button>
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="flex-1"
            disabled={loading || !formData.email || !formData.password || !formData.aceptaTerminos || passwordError !== null || !passwordsMatch}
          >
            {loading ? 'Crear Cuenta' : 'Crear Cuenta'}
          </Button>
        </div>
      </div>
    );
  };



  return (
    <>
      <FullScreenLoader isOpen={loading} message="Registrando..." />
      {successMessage ? (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-(--success)/10 flex items-center justify-center">
            <Mail className="w-10 h-10 text-(--success)" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-(--foreground) mb-2">¡Registro Exitoso!</h3>
            <p className="text-(--muted-foreground)">{successMessage}</p>
          </div>
        </div>
      ) : (
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

          <form onSubmit={step === 2 ? handleStep2Submit : (e) => e.preventDefault()}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
          </form>

          <div className="mt-6 text-center">
            <p className="text-(--muted-foreground)">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-(--primary) font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </>
      )}
    </>
  );
}
