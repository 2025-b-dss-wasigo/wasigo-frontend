'use client'

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Label } from '@/components';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { LoginCredentials } from '@/interfaces';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials: LoginCredentials = { email, password };
      const success = await login(credentials.email, credentials.password);

      if (success) {
        toast.success('¡Bienvenido a WasiGo!');
        router.push('/dashboard');
      } else {
        setError('Credenciales incorrectas. Intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link href="/recuperar" className="text-sm text-(--primary) hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        {!loading && <ArrowRight className="w-5 h-5" />}
      </Button>
    </form>
  );
}
