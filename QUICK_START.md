# 🚀 INICIO RÁPIDO - Pruebas en 3 Pasos

## ⚡ Paso 1: Iniciar el Servidor (30 segundos)

```bash
npm run dev
```

Espera a que veas:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

## 🧪 Paso 2: Probar Autocompletado (2 minutos)

### Opción A: Como Conductor

1. Abre: `http://localhost:3000/create-route`
2. Escribe en **"Punto de Origen"**: `san rafael`
3. **Verás:** Menú desplegable con opciones de Google Maps
4. Selecciona cualquier opción
5. **Abre la consola (F12)** y verás:
   ```javascript
   Lugar seleccionado: {
     direccion: "San Rafael, Quito, Ecuador",
     coordenadas: { lat: -0.1807, lng: -78.4678 }
   }
   ```

### Opción B: Como Pasajero

1. Abre: `http://localhost:3000/routes`
2. Escribe en **"¿A dónde vas?"**: `politecnica`
3. Selecciona "Escuela Politécnica Nacional"
4. **Abre la consola (F12)** y verás las coordenadas

**Lugares para probar:**
- `san rafael`
- `politecnica nacional`
- `cumbaya`
- `valle de los chillos`
- `quitumbe`

---

## 🗺️ Paso 3: Probar Mapa en Tiempo Real (3 minutos)

### Forma Más Rápida:

Abre directamente:
- **Conductor:** `http://localhost:3000/driver-route/demo-123`
- **Pasajero:** `http://localhost:3000/passenger-route/demo-123`

O usa los botones:
1. Ve a `http://localhost:3000/home` (conductor)
2. Haz clic en **"🗺️ Ver Ruta Demo"**

### Qué Observar:

1. **Mapa interactivo** con ruta trazada
2. **Punto móvil** (azul para conductor, verde para pasajero)
3. **Panel de prueba** (esquina inferior derecha) con:
   - Datos de la ruta mock
   - Instrucciones rápidas
   - Últimos logs

4. **Consola del navegador (F12)**:
   - Cada 3 segundos verás:
   ```javascript
   Enviando posición al servidor: {
     lat: -0.1850,
     lng: -78.4700,
     timestamp: "2025-12-29T...",
     routeId: "demo-123"
   }
   ```

5. **Observa el punto moverse** automáticamente por la ruta

---

## ✅ Checklist Rápido

- [ ] Autocompletado funciona y muestra opciones
- [ ] Coordenadas aparecen en consola al seleccionar
- [ ] Mapa carga y muestra la ruta
- [ ] Punto se mueve cada 3 segundos
- [ ] Logs aparecen en consola
- [ ] Panel de debug es visible

---

## 🎯 Datos Mock Usados

```javascript
Origen: Quito Centro (-0.1807, -78.4678)
Destino: Quitumbe (-0.2902, -78.5497)
Parada 1: El Recreo (-0.2108, -78.4903)
Parada 2: Villaflora (-0.2525, -78.5233)
```

---

## 🔧 Si algo no funciona:

1. **Verifica la API Key** en `.env.local`
2. **Reinicia el servidor:** Ctrl+C y luego `npm run dev`
3. **Limpia caché:** Cierra y abre el navegador
4. **Revisa la consola** para ver errores de API

---

## 📖 Documentación Completa

Lee [TESTING_GUIDE.md](TESTING_GUIDE.md) para instrucciones detalladas.

---

**¡Listo! En menos de 5 minutos puedes ver todo funcionando 🎉**
