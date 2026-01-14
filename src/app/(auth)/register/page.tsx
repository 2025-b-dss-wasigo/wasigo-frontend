import { Car, CheckCircle } from 'lucide-react';
import { RegisterForm } from '@/components';

export const metadata = {
  title: 'Registro',
  description: 'Crea tu cuenta.',
};

export default function RegisterPage() {
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

          <RegisterForm />
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
