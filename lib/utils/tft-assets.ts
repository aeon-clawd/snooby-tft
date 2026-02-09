/**
 * TFT Set 16 Asset Helpers
 * 
 * This module provides utilities to map champion, trait, and item names
 * to their corresponding icon URLs from Community Dragon.
 * 
 * Data Source: Community Dragon (https://raw.communitydragon.org)
 * Assets are served from: https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/
 */

import type { TFTChampion, TFTTrait, TFTItem, TFTSet16Data } from '@/lib/types/tft-assets';

// Import JSON data (will be loaded at runtime)
let set16Data: TFTSet16Data | null = null;

// Load data lazily
async function loadSet16Data(): Promise<TFTSet16Data> {
  if (set16Data) return set16Data;
  
  // In Node.js or server components
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    const dataPath = path.join(process.cwd(), 'public/tft-data/set16-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    set16Data = JSON.parse(rawData) as TFTSet16Data;
  } else {
    // In browser
    const response = await fetch('/tft-data/set16-data.json');
    set16Data = await response.json() as TFTSet16Data;
  }
  
  return set16Data;
}

// Synchronous access (assumes data is already loaded)
function getSet16Data(): TFTSet16Data {
  if (!set16Data) {
    throw new Error('Set 16 data not loaded. Call loadSet16Data() first or use async functions.');
  }
  return set16Data;
}

const CDRAGON_BASE_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default';

/**
 * Convert a Community Dragon asset path to a full URL
 * @param assetPath Path from JSON (e.g., "ASSETS/UX/TraitIcons/...")
 * @returns Full URL to the asset
 */
export function assetPathToUrl(assetPath: string): string {
  if (!assetPath) return '';
  
  // Remove leading slash and "ASSETS/" prefix
  let cleanPath = assetPath.replace(/^\/lol-game-data\/assets\//, '');
  cleanPath = cleanPath.replace(/^ASSETS\//, '');
  
  // Remove .tex extension and add .png
  cleanPath = cleanPath.replace(/\.tex$/, '.png').replace(/\.TFT_Set\d+\.tex$/, '.png');
  
  // Lowercase the entire path
  cleanPath = cleanPath.toLowerCase();
  
  return `${CDRAGON_BASE_URL}/${cleanPath}`;
}

/**
 * Get champion data by name (case-insensitive)
 */
export function getChampionByName(name: string): TFTChampion | undefined {
  const data = getSet16Data();
  return data.set16.champions.find(
    (champ) => champ.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get champion icon URL by name
 * @param name Champion name (e.g., "Tristana")
 * @param square If true, returns square icon; otherwise returns full splash
 * @returns URL to champion icon or empty string if not found
 */
export function getChampionIcon(name: string, square = true): string {
  const champion = getChampionByName(name);
  if (!champion) return '';
  
  const iconPath = square ? champion.squareIcon : champion.icon;
  if (!iconPath) return '';
  
  return assetPathToUrl(iconPath);
}

/**
 * Get trait data by name (case-insensitive)
 */
export function getTraitByName(name: string): TFTTrait | undefined {
  const data = getSet16Data();
  return data.set16.traits.find(
    (trait) => trait.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get trait icon URL by name
 * @param name Trait name (e.g., "Yordle", "Poison Pals")
 * @returns URL to trait icon or empty string if not found
 */
export function getTraitIcon(name: string): string {
  const trait = getTraitByName(name);
  if (!trait || !trait.icon) return '';
  
  return assetPathToUrl(trait.icon);
}

/**
 * Get all champions for a specific cost tier
 */
export function getChampionsByCost(cost: number): TFTChampion[] {
  const data = getSet16Data();
  return data.set16.champions.filter((champ) => champ.cost === cost);
}

/**
 * Get all champions with a specific trait
 */
export function getChampionsByTrait(traitName: string): TFTChampion[] {
  const data = getSet16Data();
  return data.set16.champions.filter((champ) =>
    champ.traits.some((trait) => trait.toLowerCase() === traitName.toLowerCase())
  );
}

/**
 * Get all available traits
 */
export function getAllTraits(): TFTTrait[] {
  const data = getSet16Data();
  return data.set16.traits;
}

/**
 * Get all available champions (excluding special items like Tome of Traits)
 */
export function getAllChampions(): TFTChampion[] {
  const data = getSet16Data();
  return data.set16.champions.filter((champ) => champ.cost >= 1 && champ.cost <= 5);
}

/**
 * Search champions by name (partial match, case-insensitive)
 */
export function searchChampions(query: string): TFTChampion[] {
  const lowerQuery = query.toLowerCase();
  return getAllChampions().filter((champ) =>
    champ.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Search traits by name (partial match, case-insensitive)
 */
export function searchTraits(query: string): TFTTrait[] {
  const lowerQuery = query.toLowerCase();
  return getAllTraits().filter((trait) =>
    trait.name.toLowerCase().includes(lowerQuery)
  );
}

// Export the load function for initialization
export { loadSet16Data };
