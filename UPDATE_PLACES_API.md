# ⚠️ IMPORTANTE: Actualización Requerida de Google Maps API

## 🚨 Acción Requerida

Google Maps ha deprecado las APIs antiguas. Debes **habilitar la nueva Places API (New)** en tu proyecto de Google Cloud.

---

## 📋 Pasos para Habilitar la Nueva API

### 1. Ve a Google Cloud Console
Abre: https://console.cloud.google.com/

### 2. Selecciona tu Proyecto
Asegúrate de estar en el proyecto correcto donde configuraste la API Key.

### 3. Habilita Places API (New)
1. Ve a **"APIs & Services"** → **"Library"**
2. Busca: **"Places API (New)"**
3. Click en **"ENABLE"** / **"HABILITAR"**

### 4. Verifica que esté Habilitada
1. Ve a **"APIs & Services"** → **"Enabled APIs & services"**
2. Deberías ver: **"Places API (New)"** en la lista

---

## 🔧 APIs Requeridas (Actualizado)

Asegúrate de tener habilitadas:

- ✅ **Maps JavaScript API** - Para el mapa
- ✅ **Directions API** - Para calcular rutas
- ✅ **Places API (New)** ⭐ **NUEVA - REQUERIDA**
- ✅ **Geocoding API** - Para conversión de coordenadas

### ⚠️ APIs Antiguas (Ya no usar)
- ❌ ~~Places API~~ (Legacy) - No habilites esta

---

## 🔄 Cambios en el Código

He actualizado `PlacesAutocomplete.tsx` para usar:

### Antes (Deprecated):
```typescript
// ❌ APIs antiguas (Deprecadas desde marzo 2025)
google.maps.places.AutocompleteService
google.maps.places.PlacesService
bounds, location, radius
```

### Ahora (Nuevo):
```typescript
// ✅ Nuevas APIs (Recomendadas)
google.maps.places.AutocompleteSuggestion
google.maps.places.Place
locationBias (en lugar de bounds/location/radius)
```

---

## 🧪 Probar los Cambios

Después de habilitar la nueva API:

1. **Reinicia el servidor:**
   ```bash
   Ctrl+C
   npm run dev
   ```

2. **Prueba el autocompletado:**
   - Ve a: `http://localhost:3000/create-route`
   - Escribe: `san rafael`
   - Deberías ver sugerencias sin warnings

3. **Verifica la consola:**
   - No deberías ver más los mensajes de "legacy API"
   - Solo deberías ver los logs de coordenadas al seleccionar

---

## 🔍 Errores Comunes

### Error: "You're calling a legacy API"
**Solución:** Habilita **Places API (New)** en Google Cloud Console

### Error: "This API project is not authorized"
**Solución:** 
1. Verifica que Places API (New) esté habilitada
2. Espera 1-2 minutos para que se propague
3. Limpia caché del navegador (Ctrl+Shift+R)

### Warning: "deprecated bounds/location/radius"
**Solución:** Ya está corregido en el código. Usa `locationBias` ahora.

---

## 📊 Comparación de APIs

| Característica | API Antigua | API Nueva |
|---------------|-------------|-----------|
| Autocompletado | AutocompleteService | AutocompleteSuggestion |
| Detalles de Lugar | PlacesService | Place |
| Restricción Geográfica | bounds/location/radius | locationBias |
| Soporte | Solo bug fixes mayores | Actualizaciones completas |
| Nuevas Features | ❌ | ✅ |

---

## 📝 Documentación Oficial

- **Migration Guide:** https://developers.google.com/maps/documentation/javascript/places-migration-overview
- **Places API (New):** https://developers.google.com/maps/documentation/javascript/place-autocomplete
- **Legacy APIs:** https://developers.google.com/maps/legacy

---

## ✅ Checklist

- [ ] Abrir Google Cloud Console
- [ ] Ir a APIs & Services → Library
- [ ] Buscar "Places API (New)"
- [ ] Habilitar la API
- [ ] Esperar 1-2 minutos
- [ ] Reiniciar servidor (`npm run dev`)
- [ ] Probar autocompletado
- [ ] Verificar que no haya warnings en consola

---

## 🎯 Resultado Esperado

Después de habilitar la API, deberías poder:

- ✅ Usar el autocompletado sin warnings
- ✅ Ver sugerencias de lugares
- ✅ Seleccionar lugares y ver coordenadas
- ✅ Sin mensajes de "legacy API" en consola

---

## 💡 Nota Importante

La API antigua seguirá funcionando hasta que Google la descontinúe (con 12 meses de aviso previo), pero es **altamente recomendado** usar la nueva API desde ahora para:

- Recibir nuevas características
- Evitar problemas futuros
- Mejor rendimiento
- Soporte completo de Google

---

**¡Habilita la nueva API ahora y todo funcionará correctamente! 🚀**
