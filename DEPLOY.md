# Guía de Deploy en Vercel

## Opción 1: Deploy desde GitHub (Recomendado)

1. Ve a https://vercel.com/new
2. Conecta tu cuenta de GitHub (si no lo has hecho)
3. Importa el repositorio: `aeon-clawd/snooby-tft`
4. Vercel detectará automáticamente que es un proyecto Next.js
5. Click en "Deploy"

**No requiere configuración adicional** - Vercel detecta automáticamente:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Opción 2: Deploy desde CLI

```bash
cd /home/ubuntu/clawd/projects/snooby-tft

# Login en Vercel (primera vez)
npx vercel login

# Deploy a producción
npx vercel --prod

# O deploy a preview
npx vercel
```

## Variables de Entorno (Futuro)

Cuando agregues MongoDB y NextAuth, añade estas variables en el dashboard de Vercel:

```
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

## Dominios Personalizados

Puedes agregar dominios personalizados desde:
https://vercel.com/[tu-proyecto]/settings/domains

## URLs Útiles

- Dashboard: https://vercel.com/dashboard
- Proyecto: https://vercel.com/aeon-clawd/snooby-tft
- Docs: https://vercel.com/docs
