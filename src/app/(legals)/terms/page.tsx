import { Car, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: 'Términos y Condiciones',
  description: 'Revisa nuestros términos y condiciones',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-(--background)">
      {/* Header */}
      <header className="gradient-hero text-white py-12 relative overflow-hidden">
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

        <div className="container mx-auto px-6 relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center mb-8 hover:opacity-80 transition-opacity w-fit">
            <Image
              src="/logo.webp"
              alt="WasiGo"
              width={40}
              height={40}
              className="w-20 h-15"
            />
            <span className="text-xl font-bold">WasiGo</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Términos y Condiciones</h1>
          <p className="text-white/80 text-lg animate-slide-up">Última actualización: Enero 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <section className="mb-10 animate-fade-in">
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">1. Aceptación de los Términos</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              Al acceder y utilizar la plataforma WasiGo, aceptas estar sujeto a estos Términos y Condiciones.
              Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
              WasiGo es una plataforma de carpooling universitario que conecta estudiantes conductores con pasajeros.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">2. Descripción del Servicio</h2>
            <p className="text-(--muted-foreground) leading-relaxed mb-4">
              WasiGo proporciona una plataforma tecnológica que permite:
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4">
              <li>A los conductores publicar rutas disponibles para compartir viajes</li>
              <li>A los pasajeros buscar y reservar lugares en rutas publicadas</li>
              <li>Comunicación entre usuarios a través de un sistema de chat</li>
              <li>Gestión de pagos y contribuciones de gastos de viaje</li>
              <li>Sistema de calificaciones y reseñas entre usuarios</li>
            </ul>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">3. Registro y Cuenta de Usuario</h2>
            <p className="text-(--muted-foreground) leading-relaxed mb-4">
              Para utilizar WasiGo, debes:
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4">
              <li>Ser estudiante universitario activo con correo institucional válido</li>
              <li>Tener al menos 18 años de edad</li>
              <li>Proporcionar información veraz y actualizada</li>
              <li>Mantener la confidencialidad de tu cuenta y contraseña</li>
              <li>Notificar inmediatamente cualquier uso no autorizado de tu cuenta</li>
            </ul>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">4. Requisitos para Conductores</h2>
            <p className="text-(--muted-foreground) leading-relaxed mb-4">
              Los conductores deben cumplir con los siguientes requisitos:
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4">
              <li>Poseer licencia de conducir vigente</li>
              <li>Contar con seguro vehicular activo</li>
              <li>El vehículo debe estar en condiciones óptimas de funcionamiento</li>
              <li>Pasar el proceso de verificación de documentos</li>
              <li>Mantener una calificación mínima de 3.5 estrellas</li>
            </ul>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">5. Conducta del Usuario</h2>
            <p className="text-(--muted-foreground) leading-relaxed mb-4">
              Todos los usuarios se comprometen a:
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4">
              <li>Tratar a otros usuarios con respeto y cortesía</li>
              <li>No discriminar por raza, género, religión u orientación sexual</li>
              <li>No utilizar la plataforma para actividades ilegales</li>
              <li>Cumplir con los horarios acordados para los viajes</li>
              <li>Reportar cualquier comportamiento inapropiado</li>
            </ul>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">6. Pagos y Tarifas</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              WasiGo facilita el intercambio de contribuciones para gastos de viaje entre usuarios.
              Las tarifas son establecidas por los conductores y representan una contribución a los gastos
              del viaje (combustible, peajes, mantenimiento). WasiGo puede cobrar una comisión por el
              servicio de intermediación. Los pagos se procesan de forma segura a través de nuestra plataforma.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">7. Cancelaciones</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              Las cancelaciones deben realizarse con al menos 2 horas de anticipación.
              Cancelaciones tardías o frecuentes pueden resultar en penalizaciones o suspensión de la cuenta.
              Los reembolsos se procesarán según la política de cancelación vigente al momento de la reserva.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">8. Limitación de Responsabilidad</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              WasiGo actúa únicamente como intermediario tecnológico. No somos responsables por:
              accidentes durante los viajes, objetos perdidos o dañados, disputas entre usuarios,
              o cualquier daño directo o indirecto derivado del uso del servicio.
              Cada conductor es responsable de su vehículo y de la seguridad de sus pasajeros.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">9. Modificaciones</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              WasiGo se reserva el derecho de modificar estos términos en cualquier momento.
              Los cambios serán notificados a través de la plataforma y entrarán en vigor
              inmediatamente después de su publicación. El uso continuado del servicio
              constituye la aceptación de los términos modificados.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">10. Contacto</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              Para cualquier consulta sobre estos Términos y Condiciones, puedes contactarnos a través de:
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4 mt-4">
              <li>Email: soporte@wasigo.com</li>
              <li>A través de la sección de tickets en la aplicación</li>
            </ul>
          </section>
        </div>

        {/* Back button */}
        <div className="mt-12 pt-8 border-t border-(--border)">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-(--muted)/50 py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-(--muted-foreground) text-sm">
            © 2026 WasiGo. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
