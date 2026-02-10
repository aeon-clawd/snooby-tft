# 🧪 Testing Guide - SnoobyTFT Comp Builder

## 🚀 Quick Start

### 1. Start Development Server
```bash
cd /home/ubuntu/clawd/projects/snooby-tft
npm run dev
```

El servidor estará disponible en: http://localhost:3000

### 2. Login
- Ir a: http://localhost:3000/login
- Usar cuenta autorizada (Google OAuth o credenciales)
- Email permitido: `brotons22@gmail.com`

### 3. Acceder al Admin Panel
- Una vez autenticado, ir a: http://localhost:3000/admin
- Click en "Manage Comps"

---

## 🎯 Features a Testear

### ✅ CRUD Básico

#### Crear una Comp
1. Click en "+ New Comp"
2. Llenar información básica:
   - Nombre: "Test Comp - Invoker Reroll"
   - Descripción: "Comp para testear el builder"
   - Tier: S
   - Dificultad: Medium
   - Playstyle: "Reroll"

3. Seleccionar campeones:
   - Filtrar por coste 1★
   - Seleccionar 3-4 campeones de 1 coste
   - Filtrar por coste 2★
   - Seleccionar 2-3 campeones de 2 coste

4. Configurar campeones:
   - Click en "▼ Add Items" en uno de los campeones
   - Seleccionar 2-3 items
   - Cambiar estrellas a 3★
   - Activar "Carry"

5. Verificar preview:
   - Comprobar que el preview se actualiza en tiempo real
   - Ver sinergias calculadas automáticamente
   - Ver coste total en oro

6. Agregar metadata:
   - Agregar aumentos: "Cybernetic Implants", "Combat Training"
   - Agregar artefactos: "Fishbones"
   - Video URL: `https://youtube.com/watch?v=dQw4w9WgXcQ`

7. Click "Create Comp"

#### Verificar Lista
1. Deberías ver la comp recién creada en la lista
2. Verificar que muestra:
   - Tier (S con color rojo)
   - Nombre
   - Número de campeones y sinergias
   - Preview de sinergias
   - Fecha de creación

#### Editar Comp
1. Click "Edit" en la comp creada
2. Modificar:
   - Cambiar nombre a "Test Comp - EDITED"
   - Cambiar tier a A
   - Agregar un campeón más
   - Remover un item de un campeón
3. Click "Update Comp"
4. Verificar que los cambios se guardaron

#### Eliminar Comp
1. Click "Delete" en la comp de test
2. Confirmar eliminación
3. Verificar que desapareció de la lista

---

### ✅ Champion Selector

#### Filtros
- [ ] Filtrar por coste 1★ → Solo muestra campeones de 1 coste
- [ ] Filtrar por coste 5★ → Solo muestra campeones de 5 coste
- [ ] Click "All" → Muestra todos los campeones

#### Búsqueda
- [ ] Buscar "Ahri" → Encuentra a Ahri
- [ ] Buscar "Invoker" → Encuentra campeones con trait Invoker
- [ ] Búsqueda vacía → Muestra todos

#### Selección
- [ ] Click en un campeón → Se agrega a la lista
- [ ] Campeón seleccionado queda opaco con checkmark
- [ ] Tooltip muestra información del campeón

---

### ✅ Item Selector

#### Selección de Items
- [ ] Expandir un campeón con "▼ Add Items"
- [ ] Seleccionar 1 item → Aparece con badge "1"
- [ ] Seleccionar 2do item → Aparece con badge "2"
- [ ] Seleccionar 3er item → Aparece con badge "3"
- [ ] Intentar seleccionar 4to item → Mensaje "Maximum 3 items reached"
- [ ] Click en item seleccionado → Se deselecciona

#### Búsqueda de Items
- [ ] Buscar "Sword" → Encuentra items con "sword" en el nombre
- [ ] Búsqueda vacía → Muestra todos los items

---

### ✅ Synergy System

#### Cálculo Automático
1. Agregar 3 campeones con trait "Invoker"
   - [ ] Debe aparecer "Invoker" en "Active Synergies"
   - [ ] Debe mostrar el tier alcanzado
   - [ ] Barra de progreso debe reflejar 3/X unidades

2. Agregar 1 campeón con trait "Watcher"
   - [ ] "Watcher" debe aparecer en "Inactive Synergies"
   - [ ] Debe mostrar cuántas unidades faltan

3. Remover un campeón Invoker
   - [ ] El tier de Invoker debe bajar
   - [ ] Si baja de mínimo, debe pasar a Inactive

---

### ✅ Preview en Tiempo Real

#### Actualización Instantánea
- [ ] Cambiar nombre → Preview actualiza título
- [ ] Cambiar tier → Preview actualiza badge de tier
- [ ] Agregar campeón → Aparece en preview inmediatamente
- [ ] Agregar item a campeón → Item aparece en preview
- [ ] Cambiar estrellas → Preview muestra las estrellas correctas
- [ ] Activar "Carry" → Badge "CARRY" aparece en preview
- [ ] Remover campeón → Desaparece del preview

#### Cálculo de Costes
- [ ] Agregar varios campeones
- [ ] Verificar que "Total Gold Cost" suma correctamente
- [ ] Ejemplo: 3 campeones de 1★ + 2 de 2★ = 7g

---

### ✅ Validaciones

#### Formulario
- [ ] Intentar guardar sin nombre → Error "Please enter a comp name"
- [ ] Intentar guardar sin campeones → Error "Please add at least one champion"
- [ ] Intentar guardar sin sinergias activas → Error "Please add champions to create at least one active synergy"

#### Límites
- [ ] Máximo 10 campeones (según modelo Comp)
- [ ] Máximo 3 items por campeón

---

### ✅ Filtros en Lista

#### Filtro por Tier
1. Crear comps de diferentes tiers (S, A, B)
2. Click en filtro "S" → Solo muestra comps tier S
3. Click en filtro "A" → Solo muestra comps tier A
4. Click en "All" → Muestra todas

#### Estadísticas
- [ ] Verificar que "Total Comps" cuenta correctamente
- [ ] Verificar que contador por tier (S, A, B, C, D) es correcto

---

### ✅ Autenticación

#### Protección de Routes
1. Cerrar sesión
2. Intentar acceder a `/admin/comps`
   - [ ] Debe redirigir a `/login`
3. Intentar hacer POST a `/api/comps` sin auth
   - [ ] Debe retornar 401 Unauthorized

#### Sesión Activa
- [ ] Después de login, permanecer en admin sin redirección
- [ ] Botón "Sign Out" funciona correctamente

---

## 🐛 Casos Edge a Verificar

### Performance
- [ ] Cargar 50+ campeones en el selector → Scroll fluido
- [ ] Agregar/remover 10 campeones rápidamente → Sin lag
- [ ] Preview actualiza sin retrasos

### UI/UX
- [ ] Grid de campeones responsive en móvil
- [ ] Preview lateral en desktop, inferior en móvil
- [ ] Tooltips no salen de pantalla
- [ ] Colores de tier claramente distinguibles

### Data Integrity
- [ ] Guardar comp → Recargar página → Datos persisten
- [ ] Editar comp → Cancelar → No se guardan cambios
- [ ] Eliminar comp → Refrescar → Comp ya no existe

---

## 📊 Resultados Esperados

### Build
```bash
npm run build
```
- ✅ Build exitoso sin errores TypeScript
- ✅ Sin warnings críticos
- ✅ Todas las rutas estáticas/dinámicas compiladas

### API Endpoints
- ✅ GET `/api/comps` → 200 con array de comps
- ✅ POST `/api/comps` → 201 con comp creada (requiere auth)
- ✅ GET `/api/comps/[id]` → 200 con comp específica
- ✅ PUT `/api/comps/[id]` → 200 con comp actualizada (requiere auth)
- ✅ DELETE `/api/comps/[id]` → 200 confirmación (requiere auth)

### MongoDB
- [ ] Conexión exitosa a MongoDB
- [ ] Colección "comps" creada
- [ ] Documentos guardados con schema correcto
- [ ] Índices aplicados correctamente

---

## 🎬 Demo Flow Completo

1. **Login** → Dashboard admin
2. **Click "Manage Comps"** → Lista vacía o con comps existentes
3. **Click "+ New Comp"** → Builder vacío
4. **Llenar información básica** → Nombre, tier, metadata
5. **Seleccionar 5-7 campeones** → Filtrar por coste, buscar por nombre
6. **Configurar campeones** → Agregar items, estrellas, marcar carry
7. **Ver preview actualizado** → Sinergias calculadas, coste total
8. **Agregar aumentos y artefactos** → Add/remove dinámico
9. **Guardar comp** → Redirección a lista
10. **Editar comp guardada** → Modificar campos
11. **Verificar estadísticas** → Contadores por tier
12. **Eliminar comp de prueba** → Limpiar

---

## 📝 Checklist de Reporte

Si encuentras bugs, reportar con:
- [ ] Paso a paso para reproducir
- [ ] Comportamiento esperado vs actual
- [ ] Screenshots (si aplica)
- [ ] Mensajes de error en consola
- [ ] Navegador y versión

---

## ✅ Estado Actual

Todas las features están implementadas y el build compila sin errores. Sistema listo para testing end-to-end.

**Próximo paso**: Testing manual completo y ajustes según feedback.
