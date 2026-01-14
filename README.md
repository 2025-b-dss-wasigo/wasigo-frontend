# Wasigo Frontend

Plataforma frontend para Wasigo - Sistema de gestión de rutas compartidas y pagos de conductores.

## 🎯 Descripción del Proyecto

Wasigo es una aplicación web desarrollada con **Next.js 15** que facilita la gestión de rutas compartidas, solicitudes de conductores y administración de pagos. El proyecto implementa un sistema integral con autenticación, integración con PayPal, y paneles administrativos para la gestión de conductores y transacciones.

## 🚀 Características Principales

### 👤 Módulo de Conductor
- **Dashboard de Ganancias**: Visualización en tiempo real del balance disponible, ingresos mensuales y viajes completados
- **Historial de Transacciones**: Desglose detallado de ingresos y retiros con filtrado por estado
- **Sistema de Retiros**: Modal interactivo para solicitar retiros con:
  - Generación automática de Idempotency-Key
  - Integración con PayPal
  - Validación en tiempo real
- **Gestión de Rutas**: Visualización de rutas activas y finalizadas con detalles de asientos
- **Perfil de Conductor**: Información personal, email de PayPal y documentos

### 👨‍💼 Módulo Administrador
- **Dashboard Principal**: 
  - Vista previa de solicitudes pendientes de conductores
  - Resumen de pagos pendientes y completados
  - Botones de acceso rápido a gestión completa
- **Gestión de Solicitudes**: 
  - Filtrado por estado (Pendiente, Aprobado, Rechazado)
  - Modal de detalle con validación de documentos
  - Aprobación/Rechazo de solicitudes
  - Skeleton loader optimizado
- **Gestión de Transacciones de Pago**:
  - Tres pestañas: Por Aprobar, Pendientes, Completadas
  - Ejecución de pagos a través de PayPal
  - Historial completo de transacciones
  - Loader de pantalla completa durante procesamiento

### 🔐 Sistema de Autenticación
- Login y registro de usuarios
- Autenticación con JWT
- Recuperación de contraseña
- Refresh token automático

### 📱 Características Técnicas
- **Server Actions**: Todas las acciones utilizan `revalidate = 0` para datos en tiempo real
- **API Real**: Integración completa con backend sin datos mock
- **Componentes Reutilizables**: Librería de componentes UI con Radix UI y Tailwind CSS
- **Validaciones**: Esquemas Zod para validación de datos
- **Toast Notifications**: Sistema de notificaciones con Sonner
- **Dark Mode**: Soporte completo para modo oscuro con CSS variables
- **Responsive Design**: Diseño totalmente responsivo

## 📁 Estructura del Proyecto

```
src/
├── actions/              # Server Actions para API calls
│   ├── admin/           # Acciones administrativas
│   ├── auth/            # Autenticación
│   ├── drivers/         # Acciones de conductores
│   ├── passenger/       # Acciones de pasajeros
│   ├── payouts/         # Gestión de pagos
│   ├── routes/          # Gestión de rutas
│   └── vehicles/        # Gestión de vehículos
├── app/                 # Next.js App Router
│   ├── (auth)/         # Rutas de autenticación
│   ├── (user)/         # Rutas protegidas
│   │   ├── admin/      # Panel administrativo
│   │   ├── driver/     # Panel de conductor
│   │   └── passenger/  # Panel de pasajero
│   └── api/            # API routes
├── components/          # Componentes React
│   ├── admin/          # Componentes administrativos
│   ├── driver/         # Componentes de conductor
│   ├── passenger/      # Componentes de pasajero
│   ├── common/         # Componentes compartidos
│   ├── ui/             # Componentes base UI
│   └── providers/      # Context providers
├── hooks/              # Custom React hooks
├── interfaces/         # Tipos TypeScript
├── lib/                # Utilidades
└── store/              # Zustand stores
```

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + CSS Variables
- **Componentes**: Radix UI
- **Estado**: Zustand
- **Validación**: Zod
- **Notificaciones**: Sonner
- **Mapas**: Mapbox GL
- **Pagos**: PayPal
- **Iconos**: Lucide React

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+
- npm o yarn

### Instalación

1. Clonar el repositorio
```bash
git clone <url-repositorio>
cd wasigo-frontend
```

2. Instalar dependencias
```bash
npm install
```

3. Crear archivo `.env.local`
```env
NEXT_PUBLIC_API_URL=<url-backend>
NEXT_PUBLIC_MAPBOX_TOKEN=<token-mapbox>
# ... otras variables de entorno
```

4. Ejecutar en desarrollo
```bash
npm run dev
```

5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## 📚 Comandos Disponibles

```bash
# Desarrollo
npm run dev           # Inicia servidor en http://localhost:3000

# Build
npm run build         # Compilar para producción

# Producción
npm run start         # Inicia servidor de producción

# Linting
npm run lint          # Ejecutar ESLint
```

## 🔄 Flujos Principales

### Solicitud de Conductor
1. Usuario completa formulario de solicitud
2. Carga de documentos requeridos
3. Admin revisa solicitud en panel de gestión
4. Admin aprueba/rechaza con comentarios
5. Conductor notificado del resultado

### Retirada de Fondos
1. Conductor solicita retiro desde dashboard
2. Sistema genera Idempotency-Key único
3. Solicitud se envía a backend
4. Admin aprueba pago en panel de transacciones
5. PayPal procesa transferencia
6. Conductor recibe notificación

### Creación de Ruta
1. Conductor crea ruta con puntos de inicio/fin
2. Define asientos disponibles y tarifa
3. Sistema mapea ruta en tiempo real
4. Pasajeros pueden buscar y reservar
5. Conductor finaliza ruta después de completar viajes

## 🔒 Seguridad

- Autenticación JWT con refresh tokens
- CORS configurado en backend
- Validación de entrada en cliente y servidor
- Headers de seguridad (Snyk security scanning)
- Manejo seguro de datos sensibles

## 📊 Estado del Proyecto

- ✅ Autenticación y autorización
- ✅ Dashboard de conductor con ganancias
- ✅ Sistema de retiros con PayPal
- ✅ Gestión de solicitudes de conductores
- ✅ Admin dashboard con transacciones
- ✅ Integración API real (sin mock data)
- ✅ Responsive design
- 🔄 Optimizaciones de rendimiento en progreso

## 🤝 Contribución

Para contribuir al proyecto:

1. Crear rama feature (`git checkout -b feature/AmazingFeature`)
2. Commit cambios (`git commit -m 'Add AmazingFeature'`)
3. Push a rama (`git push origin feature/AmazingFeature`)
4. Abrir Pull Request

## 📝 Licencia

Este proyecto es privado. Contactar con el equipo de desarrollo para más información.

## 👥 Equipo de Desarrollo

Desarrollado por el equipo de Wasigo en 2025-2026.

## 📞 Contacto y Soporte

Para soporte técnico o reportar issues, contactar al equipo de desarrollo.
