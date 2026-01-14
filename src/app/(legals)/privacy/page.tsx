import { Car, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: 'Política de Privacidad',
  description: 'Revisa nuestra política de privacidad.',
};

export default function PrivacyPolicyPage() {
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

          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-10 h-10 text-white/80" />
            <h1 className="text-4xl md:text-5xl font-bold animate-fade-in">Política de Privacidad</h1>
          </div>
          <p className="text-white/80 text-lg animate-slide-up">Última actualización: Enero 2026</p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <section className="mb-10 animate-fade-in">
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">1. Introducción</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              En WasiGo, nos comprometemos a proteger tu privacidad. Esta Política de Privacidad
              explica cómo recopilamos, usamos, divulgamos y protegemos tu información personal
              cuando utilizas nuestra plataforma de carpooling universitario.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">2. Información que Recopilamos</h2>
            <p className="text-(--muted-foreground) leading-relaxed mb-4">
              Recopilamos los siguientes tipos de información:
            </p>

            <h3 className="text-xl font-semibold text-(--foreground) mb-3">2.1 Información de Registro</h3>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4 mb-4">
              <li>Nombre completo y alias</li>
              <li>Correo electrónico institucional</li>
              <li>Número de teléfono</li>
              <li>Fotografía de perfil</li>
              <li>Universidad y carrera</li>
            </ul>

            <h3 className="text-xl font-semibold text-(--foreground) mb-3">2.2 Información de Conductores</h3>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4 mb-4">
              <li>Licencia de conducir</li>
              <li>Información del vehículo (marca, modelo, placa)</li>
              <li>Documentos de seguro vehicular</li>
            </ul>

            <h3 className="text-xl font-semibold text-(--foreground) mb-3">2.3 Información de Uso</h3>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4">
              <li>Historial de viajes</li>
              <li>Ubicaciones de origen y destino</li>
              <li>Calificaciones y reseñas</li>
              <li>Mensajes en el chat</li>
              <li>Transacciones de pago</li>
            </ul>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">3. Uso de la Información</h2>
            <p className="text-(--muted-foreground) leading-relaxed mb-4">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4">
              <li>Facilitar la conexión entre conductores y pasajeros</li>
              <li>Verificar la identidad de los usuarios</li>
              <li>Procesar pagos y transacciones</li>
              <li>Mejorar la seguridad de la plataforma</li>
              <li>Enviar notificaciones sobre viajes y actualizaciones</li>
              <li>Resolver disputas y proporcionar soporte al cliente</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">4. Compartir Información</h2>
            <p className="text-(--muted-foreground) leading-relaxed mb-4">
              Podemos compartir tu información en las siguientes circunstancias:
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4">
              <li><strong>Con otros usuarios:</strong> Tu alias, foto de perfil y calificación son visibles para otros usuarios.
                Los nombres reales solo se comparten con usuarios confirmados en un viaje.</li>
              <li><strong>Con proveedores de servicios:</strong> Trabajamos con terceros para procesar pagos,
                enviar notificaciones y analizar el uso de la plataforma.</li>
              <li><strong>Por requerimiento legal:</strong> Cuando sea necesario cumplir con la ley,
                procesos legales o solicitudes gubernamentales.</li>
              <li><strong>Para proteger derechos:</strong> Cuando sea necesario para proteger los derechos,
                propiedad o seguridad de WasiGo, nuestros usuarios u otros.</li>
            </ul>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">5. Seguridad de los Datos</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información,
              incluyendo encriptación de datos, acceso restringido, monitoreo de seguridad y copias de
              seguridad regulares. Sin embargo, ningún método de transmisión por Internet es 100% seguro,
              por lo que no podemos garantizar seguridad absoluta.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">6. Retención de Datos</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              Conservamos tu información personal mientras tu cuenta esté activa o según sea necesario
              para proporcionarte servicios. Después de eliminar tu cuenta, conservaremos cierta información
              durante un período limitado para cumplir con obligaciones legales, resolver disputas y
              hacer cumplir nuestros acuerdos.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">7. Tus Derechos</h2>
            <p className="text-(--muted-foreground) leading-relaxed mb-4">
              Tienes los siguientes derechos sobre tu información personal:
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4">
              <li><strong>Acceso:</strong> Solicitar una copia de tu información personal</li>
              <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de tu información</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado</li>
              <li><strong>Oposición:</strong> Oponerte al procesamiento de tu información para ciertos fines</li>
            </ul>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">8. Cookies y Tecnologías Similares</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia, recordar tus
              preferencias, analizar el uso de la plataforma y personalizar el contenido.
              Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar
              algunas funcionalidades de la plataforma.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">9. Menores de Edad</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              WasiGo está destinado a usuarios mayores de 18 años. No recopilamos intencionalmente
              información de menores de edad. Si descubrimos que hemos recopilado información de
              un menor, tomaremos medidas para eliminarla.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">10. Cambios a esta Política</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre
              cambios significativos a través de la plataforma o por correo electrónico.
              Te recomendamos revisar esta política regularmente.
            </p>
          </section>

          <section className="mb-10 animate-fade-in" style={{ animationDelay: '1s' }}>
            <h2 className="text-2xl font-bold text-(--foreground) mb-4">11. Contacto</h2>
            <p className="text-(--muted-foreground) leading-relaxed">
              Si tienes preguntas sobre esta Política de Privacidad o sobre cómo manejamos tu
              información, contáctanos:
            </p>
            <ul className="list-disc list-inside text-(--muted-foreground) space-y-2 ml-4 mt-4">
              <li>Email: privacidad@wasigo.com</li>
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
