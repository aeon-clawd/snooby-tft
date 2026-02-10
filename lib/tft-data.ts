import { TFTSetData, TFTChampion, TFTItem, TFTTrait } from '@/types/tft';

// Cache de datos TFT
let tftDataCache: TFTSetData | null = null;

/**
 * Carga y parsea los datos de TFT Set 16
 */
export async function loadTFTData(): Promise<TFTSetData> {
  if (tftDataCache) {
    return tftDataCache;
  }

  try {
    const response = await fetch('/tft-data/set16-data.json');
    if (!response.ok) {
      throw new Error('Failed to load TFT data');
    }
    
    const data = await response.json();
    
    tftDataCache = {
      champions: data.set16?.champions || [],
      items: data.set16?.items || [],
      traits: data.set16?.traits || [],
      setNumber: 16
    };
    
    return tftDataCache;
  } catch (error) {
    console.error('Error loading TFT data:', error);
    throw error;
  }
}

/**
 * Filtra campeones jugables (excluye items especiales como Tome of Traits)
 */
export function getPlayableChampions(champions: TFTChampion[]): TFTChampion[] {
  return champions.filter(champ => 
    champ.cost >= 1 && 
    champ.cost <= 5 && 
    champ.traits.length > 0 &&
    !champ.apiName.includes('ArmoryKey') &&
    !champ.apiName.includes('EmblemArmory')
  );
}

/**
 * Obtiene campeones por coste
 */
export function getChampionsByCost(champions: TFTChampion[], cost: number): TFTChampion[] {
  return getPlayableChampions(champions).filter(champ => champ.cost === cost);
}

/**
 * Busca un campeón por nombre o apiName
 */
export function findChampion(champions: TFTChampion[], nameOrApi: string): TFTChampion | undefined {
  return champions.find(champ => 
    champ.name === nameOrApi || 
    champ.apiName === nameOrApi ||
    champ.characterName === nameOrApi
  );
}

/**
 * Obtiene items básicos (componentes)
 */
export function getBasicItems(items: TFTItem[]): TFTItem[] {
  return items.filter(item => !item.from || item.from.length === 0);
}

/**
 * Obtiene items combinados
 */
export function getCombinedItems(items: TFTItem[]): TFTItem[] {
  return items.filter(item => item.from && item.from.length > 0);
}

/**
 * Busca un item por nombre o apiName
 */
export function findItem(items: TFTItem[], nameOrApi: string): TFTItem | undefined {
  return items.find(item => 
    item.name === nameOrApi || 
    item.apiName === nameOrApi
  );
}

/**
 * Busca un trait por nombre o apiName
 */
export function findTrait(traits: TFTTrait[], nameOrApi: string): TFTTrait | undefined {
  return traits.find(trait => 
    trait.name === nameOrApi || 
    trait.apiName === nameOrApi
  );
}

/**
 * Calcula las sinergias activas basándose en los campeones seleccionados
 */
export function calculateSynergies(
  selectedChampions: { champion: TFTChampion; stars?: number }[],
  allTraits: TFTTrait[]
): { trait: TFTTrait; count: number; activeTier: number }[] {
  // Contar traits
  const traitCounts = new Map<string, number>();
  
  selectedChampions.forEach(({ champion }) => {
    champion.traits.forEach(traitApiName => {
      traitCounts.set(traitApiName, (traitCounts.get(traitApiName) || 0) + 1);
    });
  });
  
  // Calcular tier activo para cada trait
  const synergies = Array.from(traitCounts.entries()).map(([traitApiName, count]) => {
    const trait = findTrait(allTraits, traitApiName);
    if (!trait) {
      return null;
    }
    
    // Encontrar el tier más alto alcanzado
    let activeTier = 0;
    for (let i = trait.effects.length - 1; i >= 0; i--) {
      if (count >= trait.effects[i].minUnits) {
        activeTier = i + 1;
        break;
      }
    }
    
    return {
      trait,
      count,
      activeTier
    };
  }).filter(Boolean) as { trait: TFTTrait; count: number; activeTier: number }[];
  
  // Ordenar por tier activo (descendente) y luego por count (descendente)
  return synergies.sort((a, b) => {
    if (b.activeTier !== a.activeTier) {
      return b.activeTier - a.activeTier;
    }
    return b.count - a.count;
  });
}

/**
 * Convierte path de asset de CDragon a URL pública
 */
export function getAssetUrl(assetPath: string | null): string {
  if (!assetPath) {
    return '/images/placeholder-champion.png';
  }
  
  // CDragon base URL
  const baseUrl = 'https://raw.communitydragon.org/latest/game/';
  
  // Normalizar path
  const normalizedPath = assetPath
    .toLowerCase()
    .replace(/\.tex$/, '.png')
    .replace(/^assets\//, '');
  
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Obtiene el color de estilo para un tier de sinergia
 */
export function getSynergyStyleColor(style: number): string {
  // Basado en los estilos de TFT:
  // 1 = Bronze, 2 = Silver, 3 = Gold, 4 = Chromatic
  const colors: Record<number, string> = {
    1: 'text-orange-600 border-orange-600', // Bronze
    2: 'text-gray-400 border-gray-400',     // Silver
    3: 'text-yellow-400 border-yellow-400', // Gold
    4: 'text-purple-400 border-purple-400', // Chromatic
  };
  
  return colors[style] || 'text-gray-500 border-gray-500';
}

/**
 * Obtiene el color para el coste de un campeón
 */
export function getCostColor(cost: number): string {
  const colors: Record<number, string> = {
    1: 'border-gray-500 bg-gray-900',
    2: 'border-green-500 bg-green-950',
    3: 'border-blue-500 bg-blue-950',
    4: 'border-purple-500 bg-purple-950',
    5: 'border-yellow-500 bg-yellow-950',
  };
  
  return colors[cost] || 'border-gray-500 bg-gray-900';
}

/**
 * Obtiene el color para el tier de una comp
 */
export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    S: 'bg-red-500 text-white',
    A: 'bg-orange-500 text-white',
    B: 'bg-yellow-500 text-black',
    C: 'bg-green-500 text-white',
    D: 'bg-gray-500 text-white',
  };
  
  return colors[tier] || 'bg-gray-500 text-white';
}
