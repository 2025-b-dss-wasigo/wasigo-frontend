# 🎨 Personalizar Datos de Prueba

## 📍 Cambiar Ubicaciones del Mapa

Para cambiar las ubicaciones de la ruta mock, edita estos archivos:

### 1. RouteTrackingMap.tsx

**Archivo:** `src/components/maps/RouteTrackingMap.tsx`

**Líneas 9-17:**
```typescript
const MOCK_ROUTE_DATA = {
  origin: { lat: -0.1807, lng: -78.4678 },      // Inicio
  destination: { lat: -0.2902, lng: -78.5497 }, // Destino
  waypoints: [
    { lat: -0.2108, lng: -78.4903 }, // Parada 1
    { lat: -0.2525, lng: -78.5233 }, // Parada 2
  ],
};
```

### 2. Páginas de Ruta

**Conductor:** `src/app/(driver)/driver-route/[id]/page.tsx`
**Pasajero:** `src/app/(passenger)/passenger-route/[id]/page.tsx`

**Líneas 10-18 en ambos:**
```typescript
const MOCK_ROUTE_DATA = {
  origin: { lat: -0.1807, lng: -78.4678 },
  destination: { lat: -0.2902, lng: -78.5497 },
  waypoints: [
    { lat: -0.2108, lng: -78.4903 },
    { lat: -0.2525, lng: -78.5233 },
  ],
};
```

---

## 🗺️ Coordenadas de Lugares Comunes en Quito

Copia y pega estas coordenadas para probar diferentes rutas:

```typescript
// Universidades
const EPN = { lat: -0.2108, lng: -78.4903 };
const UCE = { lat: -0.1894, lng: -78.4795 };
const PUCE = { lat: -0.1750, lng: -78.4900 };
const USFQ = { lat: -0.1898, lng: -78.4386 };

// Zonas Populares
const Centro_Historico = { lat: -0.2200, lng: -78.5122 };
const La_Mariscal = { lat: -0.1965, lng: -78.4862 };
const La_Carolina = { lat: -0.1807, lng: -78.4834 };
const El_Recreo = { lat: -0.2108, lng: -78.4903 };
const Quitumbe = { lat: -0.2902, lng: -78.5497 };

// Valle de los Chillos
const San_Rafael = { lat: -0.3130, lng: -78.4380 };
const Sangolqui = { lat: -0.3090, lng: -78.4485 };
const Valle_Chillos = { lat: -0.3076, lng: -78.4394 };

// Cumbayá y Tumbaco
const Cumbaya = { lat: -0.2065, lng: -78.4275 };
const Tumbaco = { lat: -0.2123, lng: -78.3994 };

// Norte de Quito
const El_Condado = { lat: -0.1130, lng: -78.4900 };
const Carapungo = { lat: -0.0970, lng: -78.4456 };
```

---

## 🎯 Ejemplos de Rutas Personalizadas

### Ejemplo 1: Universidad a Casa (Valle de los Chillos)

```typescript
const MOCK_ROUTE_DATA = {
  origin: { lat: -0.2108, lng: -78.4903 },      // EPN
  destination: { lat: -0.3130, lng: -78.4380 }, // San Rafael
  waypoints: [
    { lat: -0.2525, lng: -78.5233 }, // Villaflora
    { lat: -0.2902, lng: -78.5497 }, // Quitumbe
  ],
};
```

### Ejemplo 2: Cumbayá a Centro Histórico

```typescript
const MOCK_ROUTE_DATA = {
  origin: { lat: -0.2065, lng: -78.4275 },      // Cumbayá
  destination: { lat: -0.2200, lng: -78.5122 }, // Centro Histórico
  waypoints: [
    { lat: -0.1807, lng: -78.4834 }, // La Carolina
    { lat: -0.1965, lng: -78.4862 }, // La Mariscal
  ],
};
```

### Ejemplo 3: Norte a Sur de Quito

```typescript
const MOCK_ROUTE_DATA = {
  origin: { lat: -0.1130, lng: -78.4900 },      // El Condado
  destination: { lat: -0.2902, lng: -78.5497 }, // Quitumbe
  waypoints: [
    { lat: -0.1807, lng: -78.4834 }, // La Carolina
    { lat: -0.2108, lng: -78.4903 }, // El Recreo
  ],
};
```

---

## ⏱️ Cambiar Velocidad de Actualización

En `RouteTrackingMap.tsx`, línea 101:

```typescript
// Actual: Actualiza cada 3 segundos
intervalRef.current = setInterval(() => {
  // ... código
}, 3000); // ← Cambia este número (en milisegundos)

// Más rápido (1.5 segundos):
}, 1500);

// Más lento (5 segundos):
}, 5000);
```

---

## 🎨 Cambiar Color del Punto Móvil

En `RouteTrackingMap.tsx`, líneas 154-161:

```typescript
icon={{
  path: google.maps.SymbolPath.CIRCLE,
  scale: 8,
  fillColor: userType === "driver" ? "#3B82F6" : "#10B981", // ← Aquí
  fillOpacity: 1,
  strokeColor: "#fff",
  strokeWeight: 2,
}}
```

**Colores sugeridos:**
```typescript
// Conductor
"#3B82F6" // Azul (actual)
"#EF4444" // Rojo
"#F59E0B" // Naranja

// Pasajero
"#10B981" // Verde (actual)
"#8B5CF6" // Morado
"#EC4899" // Rosa
```

---

## 🚄 Cambiar Velocidad de Movimiento

En `RouteTrackingMap.tsx`, línea 104:

```typescript
const next = prev + 5; // ← Cambia este número

// Más lento (más suave):
const next = prev + 1;

// Más rápido:
const next = prev + 10;
```

---

## 📝 Agregar Más Paradas

Simplemente agrega más objetos al array `waypoints`:

```typescript
const MOCK_ROUTE_DATA = {
  origin: { lat: -0.1807, lng: -78.4678 },
  destination: { lat: -0.2902, lng: -78.5497 },
  waypoints: [
    { lat: -0.2108, lng: -78.4903 }, // Parada 1
    { lat: -0.2525, lng: -78.5233 }, // Parada 2
    { lat: -0.2700, lng: -78.5350 }, // Parada 3 (nueva)
    { lat: -0.2800, lng: -78.5400 }, // Parada 4 (nueva)
  ],
};
```

---

## 🔍 Encontrar Coordenadas de Cualquier Lugar

### Método 1: Google Maps
1. Abre [Google Maps](https://maps.google.com)
2. Busca el lugar
3. Click derecho → "¿Qué hay aquí?"
4. Copia las coordenadas

### Método 2: Usar el Autocompletado
1. Ve a `/create-route`
2. Escribe el lugar
3. Selecciona de la lista
4. Abre la consola (F12)
5. Copia las coordenadas del log

---

## 🎓 Ejemplo Completo: Ruta ESPE → Mall del Sur

```typescript
// En RouteTrackingMap.tsx, línea 9:
const MOCK_ROUTE_DATA = {
  origin: { lat: -0.3180, lng: -78.5625 },      // Universidad ESPE
  destination: { lat: -0.2902, lng: -78.5497 }, // Mall del Sur
  waypoints: [
    { lat: -0.3090, lng: -78.4485 }, // Sangolquí Centro
    { lat: -0.2902, lng: -78.5200 }, // Entrada a Quito
  ],
};
```

---

## 💡 Tips

1. **Coordenadas negativas:** En Ecuador, latitud y longitud son negativas
2. **Formato:** Siempre `{ lat: numero, lng: numero }`
3. **Precisión:** 4 decimales es suficiente (Ej: -0.1807)
4. **Orden:** Waypoints se visitan en el orden del array
5. **Límites:** Google Maps soporta hasta 25 waypoints

---

## 🔄 Aplicar Cambios

Después de editar:
1. Guarda el archivo (Ctrl+S)
2. El navegador recargará automáticamente
3. Refresca la página si no se actualiza

---

**¿Más ayuda?** Lee [TESTING_GUIDE.md](TESTING_GUIDE.md) para más detalles.
