# SnoobyTFT - Tierlist de Composiciones TFT

Web pública de tierlist de composiciones de Teamfight Tactics para **Snoodyboo**, streamer español especializado en TFT.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **Language:** TypeScript
- **Database:** MongoDB Atlas (próximamente)
- **Auth:** NextAuth (próximamente)
- **Deployment:** Vercel

## 📁 Estructura del Proyecto

```
snooby-tft/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página home
│   └── globals.css        # Estilos globales
├── components/
│   ├── ui/                # Componentes reutilizables
│   ├── layout/            # Header, Footer, Sidebar
│   ├── tierlist/          # Componentes de tierlist
│   └── admin/             # Panel de administración
├── lib/
│   ├── utils/             # Utilidades (cn, etc.)
│   ├── api/               # Lógica de API
│   ├── db/                # Conexión a DB
│   └── types/             # Definiciones TypeScript
└── public/
    ├── images/            # Imágenes estáticas
    └── fonts/             # Fuentes personalizadas
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start
```

## 🎯 Roadmap

- [x] Configuración inicial del proyecto
- [x] Estructura de carpetas
- [ ] Diseño del sistema de tierlist
- [ ] Componentes UI base
- [ ] Integración con MongoDB Atlas
- [ ] Panel de administración
- [ ] Sistema de autenticación
- [ ] Integración con YouTube/Twitch

## 📝 Licencia

Proyecto privado de Snoodyboo.
