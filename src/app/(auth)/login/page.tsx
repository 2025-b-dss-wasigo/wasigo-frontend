'use client'

import Link from "next/link";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('¡Bienvenido a WasiGo!');
        redirect('/dashboard');
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
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-(--primary-foreground)/20 backdrop-blur-sm flex items-center justify-center">
              <Car className="w-10 h-10 text-(--primary-foreground)" />
            </div>
            <h1 className="text-4xl font-bold text-(--primary-foreground)">WasiGo</h1>
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold text-(--primary-foreground) mb-4 leading-tight">
            Viaja seguro con tu<br />comunidad universitaria
          </h2>

          <p className="text-lg text-(--primary-foreground)/80 mb-8 max-w-md">
            Comparte viajes con otros estudiantes de la EPN. Ahorra dinero, reduce tu huella de carbono y conoce gente nueva.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-md">
            <div className="text-center p-4 bg-(--primary-foreground)/10 backdrop-blur-sm rounded-xl">
              <p className="text-3xl font-bold text-(--primary-foreground)">500+</p>
              <p className="text-sm text-(--primary-foreground)/70">Usuarios</p>
            </div>
            <div className="text-center p-4 bg-(--primary-foreground)/10 backdrop-blur-sm rounded-xl">
              <p className="text-3xl font-bold text-(--primary-foreground)">1.2k</p>
              <p className="text-sm text-(--primary-foreground)/70">Viajes</p>
            </div>
            <div className="text-center p-4 bg-(--primary-foreground)/10 backdrop-blur-sm rounded-xl">
              <p className="text-3xl font-bold text-(--primary-foreground)">4.8</p>
              <p className="text-sm text-(--primary-foreground)/70">Calificación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-(--background)">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-(--primary) flex items-center justify-center">
              <Car className="w-7 h-7 text-(--primary-foreground)" />
            </div>
            <h1 className="text-2xl font-bold text-(--foreground)">WasiGo</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-(--foreground) mb-2">Iniciar Sesión</h2>
            <p className="text-(--muted-foreground)">Ingresa a tu cuenta universitaria</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-(--destructive)/10 border border-(--destructive)/20 rounded-lg text-(--destructive) text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
                onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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

          <div className="mt-6 text-center">
            <p className="text-(--muted-foreground)">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-(--primary) font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
