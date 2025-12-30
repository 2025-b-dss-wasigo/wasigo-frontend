# 🗺️ Integración de Google Maps

## Funcionalidades Implementadas

### 1. Seguimiento de Rutas en Tiempo Real
- **Rutas dinámicas**: Los conductores y pasajeros pueden ver la ruta en tiempo real
- **Páginas creadas**:
  - `/driver-route/[id]` para conductores
  - `/passenger-route/[id]` para pasajeros
- **Características**:
  - Cálculo automático de la ruta más rápida usando Directions API
  - Actualización de posición cada 3 segundos
  - Visualización de punto de inicio, destino y paradas intermedias
  - Optimización automática del orden de paradas

### 2. Autocompletado de Direcciones
- **Búsqueda inteligente**: Sugerencias de direcciones mientras escribes
- **Limitado a Pichincha, Ecuador**: Solo muestra resultados relevantes en la provincia
- **Integrado en**:
  - Formulario de creación de rutas (conductor)
  - Búsqueda de rutas (pasajero)
- **Muestra coordenadas**: Al seleccionar una dirección, se imprimen las coordenadas en consola

## 📋 Configuración

### 1. Obtener API Key de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - **Maps JavaScript API**
   - **Directions API**
   - **Places API**
   - **Geocoding API**
4. Ve a "Credenciales" y crea una API Key
5. (Recomendado) Restringe la API Key:
   - Por dominio para producción
   - Por IP para desarrollo

### 2. Configurar Variables de Entorno

Crea o edita el archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### 3. Reiniciar el Servidor de Desarrollo

```bash
npm run dev
```

## 🚀 Uso

### Ver Ruta en Tiempo Real

**Conductor:**
```
/route/123
```

**Pasajero:**
```
/route/123
```

Ambas páginas mostrarán:
- Mapa interactivo con la ruta trazada
- Marcador que se mueve cada 3 segundos
- Información del viaje (inicio, destino, paradas)
- Datos enviados a consola simulando updates al servidor

### Buscar Direcciones

Los campos de dirección ahora tienen autocompletado:

1. Escribe al menos 3 letras
2. Aparecerá un menú desplegable con sugerencias
3. Las sugerencias están limitadas a Pichincha, Ecuador
4. Al seleccionar, se imprimirán las coordenadas en consola

## 🔧 Componentes Creados

### `RouteTrackingMap.tsx`
Componente principal del mapa con tracking en tiempo real.

**Props:**
- `routeId`: ID de la ruta
- `userType`: "driver" | "passenger"

**Datos quemados (por ahora):**
```typescript
const MOCK_ROUTE_DATA = {
  origin: { lat: -0.1807, lng: -78.4678 }, // Quito Centro
  destination: { lat: -0.2902, lng: -78.5497 }, // Quitumbe
  waypoints: [
    { lat: -0.2108, lng: -78.4903 }, // El Recreo
    { lat: -0.2525, lng: -78.5233 }, // Villaflora
  ],
};
```

### `PlacesAutocomplete.tsx`
Componente de autocompletado de direcciones.

**Props:**
- `onPlaceSelect`: Callback cuando se selecciona un lugar
- `placeholder`: Texto placeholder
- `defaultValue`: Valor inicial

**Retorna:**
```typescript
{
  address: string;  // Dirección completa
  lat: number;      // Latitud
  lng: number;      // Longitud
}
```

## 📊 Funcionalidades de Tracking

### Actualización de Posición

Cada 3 segundos se envía la posición al servidor (simulado en consola):

```typescript
{
  lat: number,
  lng: number,
  timestamp: string,
  routeId: string
}
```

### Cálculo de Ruta Óptima

El componente usa `optimizeWaypoints: true` para calcular el orden más eficiente de las paradas.

## 🔐 Seguridad

⚠️ **IMPORTANTE**: 
- Nunca subas tu API Key al repositorio
- `.env.local` está en `.gitignore`
- En producción, restringe la API Key por dominio
- Considera usar un proxy backend para ocultar la API Key

## 🧪 Testing

Para probar las rutas:

1. Asegúrate de tener la API Key configurada
2. Ve a `/route/123` como conductor o pasajero
3. Abre la consola del navegador
4. Verás los logs de:
   - Ruta calculada
   - Actualizaciones de posición cada 3 segundos
   - Coordenadas al seleccionar direcciones

## 📝 Próximos Pasos

- [ ] Conectar con datos reales del backend
- [ ] Implementar WebSocket para updates en tiempo real
- [ ] Agregar múltiples marcadores (conductor + pasajeros)
- [ ] Mostrar tiempo estimado de llegada
- [ ] Notificaciones cuando el conductor se acerca
