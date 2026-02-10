// TFT Set 16 Data Types

export interface TFTChampionAbility {
  desc: string;
  icon: string;
  name: string;
  variables: {
    name: string;
    value: number[];
  }[];
}

export interface TFTChampionStats {
  armor: number;
  attackSpeed: number;
  critChance: number | null;
  critMultiplier: number;
  damage: number | null;
  hp: number;
  initialMana: number;
  magicResist: number;
  mana: number;
  range: number;
}

export interface TFTChampion {
  ability: TFTChampionAbility;
  apiName: string;
  characterName: string;
  cost: number;
  icon: string | null;
  name: string;
  role: string | null;
  squareIcon: string | null;
  stats: TFTChampionStats;
  tileIcon: string;
  traits: string[];
}

export interface TFTItem {
  apiName: string;
  desc: string;
  effects: Record<string, number>;
  from: string[] | null;
  icon: string;
  name: string;
  unique?: boolean;
}

export interface TFTTrait {
  apiName: string;
  desc: string;
  effects: {
    maxUnits: number;
    minUnits: number;
    style: number;
    variables: Record<string, number>;
  }[];
  icon: string;
  name: string;
}

export interface TFTSetData {
  champions: TFTChampion[];
  items: TFTItem[];
  traits: TFTTrait[];
  setNumber: number;
}

// UI Types for the Comp Builder

export interface SelectedChampion {
  id: string; // Unique ID para React keys
  champion: TFTChampion;
  items: string[]; // Array de apiNames de items (max 3)
  stars: number; // 1, 2, or 3
  isCarry: boolean;
  position?: {
    row: number;
    col: number;
  };
}

export interface ActiveSynergy {
  trait: TFTTrait;
  activeUnits: number; // Número de unidades con este trait
  activeTier: number; // Tier activo (0 si no alcanza mínimo)
}

export interface CompFormData {
  name: string;
  description: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  champions: SelectedChampion[];
  synergies: ActiveSynergy[];
  augments: string[];
  artifacts: string[];
  videoUrl: string;
  tacterUrl: string;
  playstyle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}
