# 🧪 Guía de Pruebas - Google Maps Integration

## 🎯 Funcionalidades Implementadas para Probar

### 1️⃣ Autocompletado de Direcciones (Places API)
### 2️⃣ Visualización de Mapa en Tiempo Real
### 3️⃣ Impresión de Coordenadas en Consola

---

## 📍 Paso 1: Probar Autocompletado - Crear Ruta (Conductor)

### Ruta: `/create-route`

**Acceso rápido:**
1. Navega a `http://localhost:3000/home` (como conductor)
2. Haz clic en el botón **"Crear Nueva Ruta"**

**Qué probar:**
1. En el campo **"Punto de Origen"**:
   - Escribe: `san rafael`
   - Deberías ver un menú desplegable con opciones de Google Maps
   - Todas las opciones estarán limitadas a Pichincha, Ecuador
   
2. Selecciona una opción del menú:
   - **Verás en la consola** las coordenadas exactas (lat, lng) del lugar seleccionado
   - Ejemplo de output en consola:
   ```javascript
   Lugar seleccionado: {
     direccion: "San Rafael, Quito, Ecuador",
     coordenadas: { lat: -0.1807, lng: -78.4678 }
   }
   ```

3. Repite lo mismo en el campo **"Punto de Destino"**:
   - Escribe: `politecnica`
   - Selecciona "Escuela Politécnica Nacional"
   - Verás las coordenadas en consola

**Lugares de prueba sugeridos:**
- `san rafael`
- `valle de los chillos`
- `politecnica nacional`
- `cumbaya`
- `la carolina`
- `quitumbe`

---

## 🔍 Paso 2: Probar Autocompletado - Buscar Ruta (Pasajero)

### Ruta: `/routes`

**Acceso rápido:**
1. Navega a `http://localhost:3000/dashboard` (como pasajero)
2. Haz clic en **"Ver todas"** en la sección de rutas

**Qué probar:**
1. En el campo de búsqueda **"¿A dónde vas?"**:
   - Escribe: `tumbaco`
   - Aparecerá el menú desplegable con sugerencias
   
2. Al seleccionar una opción:
   - **Verás en la consola** las coordenadas del destino
   - El campo se llenará con la dirección completa

**Lugares de prueba sugeridos:**
- `tumbaco`
- `conocoto`
- `sangolqui`
- `centro historico`
- `la mariscal`

---

## 🗺️ Paso 3: Ver Mapa en Tiempo Real

### Opción A: Desde el Dashboard del Conductor

**Ruta: `/home` → Botón "🗺️ Ver Ruta Demo"**

1. Ve a `http://localhost:3000/home`
2. Haz clic en el nuevo botón azul **"🗺️ Ver Ruta Demo"**
3. Serás redirigido a `/driver-route/demo-123`

### Opción B: Desde el Dashboard del Pasajero

**Ruta: `/dashboard` → Botón "🗺️ Ver en Mapa"**

1. Ve a `http://localhost:3000/dashboard`
2. En la sección "Tu Próximo Viaje"
3. Haz clic en **"🗺️ Ver en Mapa"**

### Opción C: Directo

**Conductor:** `http://localhost:3000/driver-route/demo-123`
**Pasajero:** `http://localhost:3000/passenger-route/demo-123`

---

## 🎬 Qué Verás en el Mapa en Tiempo Real

### Visualización:
1. **Mapa interactivo de Google Maps** centrado en Quito
2. **Ruta trazada en azul** desde el inicio hasta el destino
3. **Paradas intermedias** marcadas en la ruta
4. **Punto móvil** (círculo coloreado) que representa el vehículo

### Datos de Prueba Quemados:
```javascript
Origen: Quito Centro (-0.1807, -78.4678)
Destino: Quitumbe (-0.2902, -78.5497)
Parada 1: El Recreo (-0.2108, -78.4903)
Parada 2: Villaflora (-0.2525, -78.5233)
```

### Comportamiento en Tiempo Real:
- El punto se mueve **cada 3 segundos**
- **Abre la consola del navegador** (F12)
- Verás logs como:
```javascript
Ruta calculada: {
  distancia: 15234,  // metros
  duracion: 1800,    // segundos
  inicio: { lat: -0.1807, lng: -78.4678 },
  fin: { lat: -0.2902, lng: -78.5497 },
  paradas: [...]
}

Enviando posición al servidor: {
  lat: -0.1850,
  lng: -78.4700,
  timestamp: "2025-12-29T...",
  routeId: "demo-123"
}
```

---

## ✅ Checklist de Pruebas

### Autocompletado de Direcciones
- [ ] El menú aparece al escribir 3+ caracteres
- [ ] Las sugerencias son de lugares en Pichincha, Ecuador
- [ ] Al seleccionar, se imprimen coordenadas en consola
- [ ] Funciona en formulario de crear ruta (conductor)
- [ ] Funciona en búsqueda de rutas (pasajero)

### Mapa en Tiempo Real
- [ ] El mapa carga correctamente
- [ ] Se muestra la ruta completa trazada
- [ ] El punto móvil aparece en el inicio
- [ ] El punto se mueve cada 3 segundos
- [ ] Los logs aparecen en la consola cada 3 segundos
- [ ] Se muestran las paradas intermedias
- [ ] La ruta se optimiza automáticamente

### Impresión de Coordenadas
- [ ] Coordenadas se imprimen al seleccionar origen
- [ ] Coordenadas se imprimen al seleccionar destino
- [ ] Coordenadas incluyen lat y lng
- [ ] El formato es legible en consola

---

## 🔧 Troubleshooting

### El menú de autocompletado no aparece
**Solución:**
- Verifica que `.env.local` tenga la API Key
- Reinicia el servidor de desarrollo (`npm run dev`)
- Abre la consola para ver errores de API

### El mapa no carga
**Solución:**
- Verifica la API Key en `.env.local`
- Asegúrate de haber habilitado:
  - Maps JavaScript API
  - Directions API
  - Places API
- Revisa la consola del navegador para errores

### No veo logs en la consola
**Solución:**
- Abre DevTools (F12)
- Ve a la pestaña "Console"
- Asegúrate de que los filtros no oculten los logs

---

## 🎨 Colores del Punto Móvil

- **Conductor (azul):** `#3B82F6`
- **Pasajero (verde):** `#10B981`

---

## 📸 Capturas de Pantalla Esperadas

### 1. Autocompletado:
```
┌─────────────────────────────┐
│ Punto de Origen             │
│ san rafael█                 │
├─────────────────────────────┤
│ San Rafael, Quito           │
│ San Rafael, Valle Chillos   │
│ San Rafael Plaza            │
└─────────────────────────────┘
```

### 2. Consola - Coordenadas:
```javascript
Lugar seleccionado: {
  direccion: "San Rafael, Quito, Ecuador"
  coordenadas: {lat: -0.180700, lng: -78.467800}
}
```

### 3. Consola - Tracking en Tiempo Real:
```javascript
Enviando posición al servidor: {
  lat: -0.1850
  lng: -78.4700
  timestamp: "2025-12-29T15:30:00.000Z"
  routeId: "demo-123"
}
```

---

## 🚀 Flujo de Prueba Completo (5 minutos)

1. **[1 min]** Crear ruta: Probar autocompletado en origen y destino
2. **[1 min]** Buscar ruta: Probar autocompletado en búsqueda
3. **[3 min]** Ver mapa: Observar tracking en tiempo real durante 3 ciclos

---

## 📝 Notas Importantes

- El tracking es **simulado** - avanza automáticamente por la ruta
- En producción, las coordenadas vendrán del GPS del conductor
- Los datos son **mock** - cambiarlos en `RouteTrackingMap.tsx` línea 19-26
- El intervalo de 3 segundos es configurable en línea 101

**¡Disfruta probando! 🎉**
