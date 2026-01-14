import { Car, MapPinOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating circles decoration */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-32 right-20 w-48 h-48 bg-white/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Car className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">WasiGo</span>
        </div>

        {/* Error icon */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <MapPinOff className="w-16 h-16 text-white/80" />
          </div>
        </div>

        {/* Error text */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-8xl font-bold text-white mb-4 tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold text-white/90 mb-4">Página no encontrada</h2>
          <p className="text-white/70 mb-8 text-lg leading-relaxed">
            Lo sentimos, la ruta que buscas no existe o fue removida.
            Puede que el enlace esté roto o la página haya sido movida.
          </p>
        </div>

        {/* Action button */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button
            asChild
            size="lg"
            className="bg-white text-(--primary) hover:bg-white/90 shadow-elevated gap-2 px-8"
          >
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        {/* Additional help text */}
        <p className="mt-8 text-white/50 text-sm animate-fade-in" style={{ animationDelay: '0.5s' }}>
          ¿Necesitas ayuda? Contacta a nuestro equipo de soporte
        </p>
      </div>
    </div>
  );
};

export default NotFound;
