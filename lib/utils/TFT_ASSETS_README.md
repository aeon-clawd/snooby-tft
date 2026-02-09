# TFT Set 16 Assets - Guía de Uso

Este módulo proporciona helpers para acceder a iconos de campeones, traits e items del Set 16 de TFT usando Community Dragon API.

## Instalación

No requiere instalación adicional. Los datos están en `/public/tft-data/set16-data.json`.

## Uso Básico

```typescript
import {
  getChampionIcon,
  getTraitIcon,
  getChampionByName,
  getAllChampions,
  getAllTraits
} from '@/lib/utils/tft-assets-simple';
```

## Funciones Principales

### Iconos de Campeones

```typescript
// Obtener icono cuadrado (para UI compacta)
const tristanaSquare = getChampionIcon('Tristana', true);
// → https://raw.communitydragon.org/.../tft16_tristana_splash_tile_0.tft_set16.png

// Obtener splash art completo
const tristanaSplash = getChampionIcon('Tristana', false);
// → https://raw.communitydragon.org/.../tft16_tristana_splash_centered_0.tft_set16.png
```

### Datos de Campeones

```typescript
const tristana = getChampionByName('Tristana');
console.log(tristana.cost);      // 2
console.log(tristana.traits);    // ['Yordle', 'Gunslinger']
console.log(tristana.stats.hp);  // 550
console.log(tristana.stats.mana); // 50
```

### Iconos de Traits

```typescript
const yordleIcon = getTraitIcon('Yordle');
// → https://raw.communitydragon.org/.../trait_icon_16_yordle.tft_set16.png
```

### Búsqueda y Filtrado

```typescript
// Buscar campeones por costo
const oneCostUnits = getChampionsByCost(1);
// → [Lulu, Rumble, ...]

// Buscar campeones por trait
const yordles = getChampionsByTrait('Yordle');
// → [Lulu, Tristana, Teemo, Rumble, ...]

// Búsqueda parcial de nombres
const teChamps = searchChampions('te');
// → [Teemo, Twisted Fate]

// Búsqueda parcial de traits
const gunTraits = searchTraits('gun');
// → [Gunslinger]
```

### Listados Completos

```typescript
// Todos los campeones (costo 1-5)
const allChamps = getAllChampions();
// → 105 campeones

// Todos los traits
const allTraits = getAllTraits();
// → 53 traits
```

## Ejemplos de Componentes

### Icono de Campeón

```tsx
function ChampionIcon({ name }: { name: string }) {
  const icon = getChampionIcon(name, true);
  const data = getChampionByName(name);
  
  if (!icon || !data) return null;
  
  return (
    <div className="relative">
      <img 
        src={icon} 
        alt={name}
        className="w-12 h-12 rounded-md border-2"
        style={{ borderColor: getCostColor(data.cost) }}
      />
      <div className="absolute bottom-0 right-0 bg-black/80 text-white text-xs px-1 rounded">
        {data.cost}
      </div>
    </div>
  );
}
```

### Lista de Traits

```tsx
function TraitsList({ traits }: { traits: string[] }) {
  return (
    <div className="flex gap-2">
      {traits.map(traitName => {
        const icon = getTraitIcon(traitName);
        return (
          <div key={traitName} className="flex items-center gap-1">
            <img src={icon} alt={traitName} className="w-6 h-6" />
            <span className="text-sm">{traitName}</span>
          </div>
        );
      })}
    </div>
  );
}
```

### Card de Comp con Iconos

```tsx
import { getChampionIcon, getTraitIcon } from '@/lib/utils/tft-assets-simple';

function CompCard({ comp }: { comp: TFTComp }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold text-lg">{comp.name}</h3>
      
      {/* Traits */}
      <div className="flex gap-2 my-2">
        {comp.traits.map(trait => (
          <img 
            key={trait}
            src={getTraitIcon(trait)} 
            alt={trait}
            className="w-8 h-8"
            title={trait}
          />
        ))}
      </div>
      
      {/* Champions */}
      <div className="grid grid-cols-4 gap-2">
        {comp.units.map(unit => (
          <img 
            key={unit}
            src={getChampionIcon(unit, true)} 
            alt={unit}
            className="w-full aspect-square rounded"
          />
        ))}
      </div>
    </div>
  );
}
```

## Colores por Costo

Helper sugerido para colorear bordes según el costo:

```typescript
function getCostColor(cost: number): string {
  const colors = {
    1: '#808080', // Gray
    2: '#1eff00', // Green
    3: '#0070ff', // Blue
    4: '#d238d2', // Purple
    5: '#ffb900', // Gold
  };
  return colors[cost] || '#808080';
}
```

## Testing

```bash
# Ejecutar tests
npx tsx lib/utils/tft-assets-test.ts
```

## Actualizar Datos

Para actualizar los datos cuando haya un nuevo patch:

```bash
cd /home/ubuntu/clawd/projects/snooby-tft
curl -s "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json" \
  | jq '{set16: .sets["16"], setData: (.setData | map(select(.number == 16)) | .[0])}' \
  > public/tft-data/set16-data.json
```

## Notas Importantes

1. **Server-side only**: Este módulo usa `fs` de Node.js, solo funciona en server components o API routes
2. **URLs externas**: Los iconos se cargan desde Community Dragon CDN, no están en el proyecto
3. **Caché**: Next.js cachea automáticamente las imágenes externas
4. **Case-insensitive**: Todas las búsquedas son case-insensitive

## Fuentes

- Community Dragon: https://raw.communitydragon.org/
- Documentación: https://github.com/CommunityDragon/Docs
- Set 16 actual: 105 campeones, 53 traits
