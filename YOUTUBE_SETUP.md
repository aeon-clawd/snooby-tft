# YouTube Data API v3 - Setup Guide

Esta guía explica cómo configurar YouTube Data API v3 para mostrar los últimos vídeos de los canales de Snoodyboo.

## 📋 Requisitos

- Cuenta de Google
- Proyecto en Google Cloud Console
- 5 minutos de tiempo

## 🔧 Pasos para obtener la API Key

### 1. Crear/Seleccionar Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombra el proyecto (ej: "SnoobyTFT")

### 2. Habilitar YouTube Data API v3

1. En el menú lateral, ve a **APIs & Services → Library**
2. Busca "YouTube Data API v3"
3. Click en "YouTube Data API v3"
4. Click en **ENABLE** (Habilitar)

### 3. Crear API Key

1. Ve a **APIs & Services → Credentials**
2. Click en **+ CREATE CREDENTIALS** (arriba)
3. Selecciona **API key**
4. Se creará tu API key → **COPIA LA KEY**

### 4. (Recomendado) Restringir la API Key

Para seguridad, restringe el uso de tu API key:

1. En la página de credentials, click en el **lápiz de editar** junto a tu API key
2. En **Application restrictions**:
   - Selecciona "HTTP referrers (web sites)"
   - Añade:
     - `http://localhost:3000/*` (desarrollo)
     - `https://tu-dominio-vercel.vercel.app/*` (producción)
3. En **API restrictions**:
   - Selecciona "Restrict key"
   - Marca solo **YouTube Data API v3**
4. Click **SAVE**

### 5. Configurar en el Proyecto

Añade la API key a tu archivo `.env.local`:

```bash
YOUTUBE_API_KEY=AIzaSy...tu-api-key-aqui
```

## 📊 Quota Limits

YouTube Data API tiene límites diarios:

- **Quota por día:** 10,000 unidades (gratis)
- **Costo por request:**
  - List channels: 1 unidad
  - List playlist items: 1 unidad
  - **Total por fetch:** ~2 unidades × 2 canales = 4 unidades

### Estimación de Uso

Con el sistema de cache de 1 hora:

- **Requests por día:** ~24 (1 cada hora)
- **Quota consumida:** ~96 unidades/día
- **Margen disponible:** 9,904 unidades/día restantes

✅ El sistema de cache mantiene el uso **muy por debajo** del límite diario.

## 🔍 Testing

### Test 1: API Key Funcional

```bash
curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCjnVNV3MjGqeyE63AB9-mWA&key=TU_API_KEY"
```

Deberías recibir un JSON con información del canal TFTconSnoody.

### Test 2: En el Proyecto

```bash
cd /home/ubuntu/clawd/projects/snooby-tft
npm run dev
```

Visita `http://localhost:3000` y verifica que los vídeos se cargan correctamente.

### Test 3: API Route

```bash
curl http://localhost:3000/api/youtube
```

Deberías ver un JSON con los últimos vídeos.

## 🚨 Troubleshooting

### Error: API key not valid

- Verifica que la API key esté correctamente copiada en `.env.local`
- Asegúrate de que YouTube Data API v3 está habilitada
- Revisa las restricciones de la API key

### Error: Daily quota exceeded

- El cache está fallando → revisa logs
- Demasiados requests → aumenta el cache TTL en `/app/api/youtube/route.ts`

### No se cargan vídeos

1. Abre DevTools → Console
2. Busca errores de fetch
3. Verifica que `/api/youtube` devuelve datos válidos
4. Revisa que los Channel IDs en `lib/youtube.ts` son correctos

## 🔄 Cache System

El sistema implementa cache en memoria:

- **TTL:** 1 hora (configurable en `app/api/youtube/route.ts`)
- **Fallback:** Si la API falla, devuelve datos cacheados
- **Force refresh:** `GET /api/youtube?fresh=true`
- **Clear cache:** `DELETE /api/youtube`

### Modificar cache TTL

En `app/api/youtube/route.ts`:

```typescript
// Cache TTL: 1 hora (3600 segundos)
const CACHE_TTL = 60 * 60 * 1000;

// Cambiar a 2 horas:
const CACHE_TTL = 2 * 60 * 60 * 1000;
```

## 📚 Recursos

- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [API Console](https://console.cloud.google.com/apis/dashboard)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)

## 🎯 Canales Configurados

- **TFT con Snoody** - UCjnVNV3MjGqeyE63AB9-mWA
- **SnoodyBoo TFT** - UCtfm2KT4Xjz9SRXl3csWTMQ

Los vídeos se mezclan de ambos canales y se ordenan por fecha de publicación.
