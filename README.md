# SnoobyTFT - Tierlist de Composiciones TFT

Web pública de tierlist de composiciones de Teamfight Tactics para **Snoodyboo**, streamer español especializado en TFT.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **Language:** TypeScript
- **Database:** MongoDB Atlas + Mongoose
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
│   ├── mongodb.ts         # Conexión a MongoDB
│   └── types/             # Definiciones TypeScript
├── models/
│   └── Comp.ts            # Modelo de composiciones
├── scripts/
│   └── seed-example.ts    # Seed de datos de ejemplo
└── public/
    ├── images/            # Imágenes estáticas
    └── fonts/             # Fuentes personalizadas
```

## 🛠️ Desarrollo Local

### Setup Inicial

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu MongoDB URI
```

**Para configuración de MongoDB Atlas:** Ver [DATABASE.md](./DATABASE.md)

### Comandos

```bash
# Modo desarrollo
npm run dev

# Probar conexión a base de datos
npm run db:test

# Poblar base de datos con ejemplos
npm run seed

# Build de producción
npm run build

# Iniciar en producción
npm start
```

## 🎯 Roadmap

- [x] Configuración inicial del proyecto
- [x] Estructura de carpetas
- [x] Schema de base de datos MongoDB
- [x] Modelos Mongoose + TypeScript
- [x] Conexión a MongoDB Atlas
- [ ] API Routes CRUD para composiciones
- [ ] Diseño del sistema de tierlist
- [ ] Componentes UI base
- [ ] Panel de administración
- [ ] Sistema de autenticación
- [ ] Integración con YouTube/Twitch

## 📚 Documentación

- **Setup de Base de Datos:** [DATABASE.md](./DATABASE.md)
- **Deployment:** [DEPLOY.md](./DEPLOY.md)
- **Notas Técnicas:** `/home/ubuntu/Obsidia-notas/Tickets/tk-iy81pckx6057.md`

## 📝 Licencia

Proyecto privado de Snoodyboo.
