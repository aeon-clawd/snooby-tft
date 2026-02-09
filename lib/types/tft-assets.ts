/**
 * Type definitions for TFT Set 16 assets
 */

export interface TFTChampion {
  apiName: string;
  name: string;
  cost: number;
  icon: string | null;
  squareIcon: string | null;
  traits: string[];
  stats: {
    hp: number;
    armor: number;
    magicResist: number;
    attackSpeed: number;
    damage: number | null;
    mana: number;
    initialMana: number;
  };
}

export interface TFTTrait {
  apiName: string;
  name: string;
  desc: string;
  icon: string;
  effects: Array<{
    minUnits: number;
    maxUnits: number;
    style: number;
    variables: Record<string, number>;
  }>;
}

export interface TFTItem {
  apiName: string;
  name: string;
  desc: string;
  icon: string;
  composition: string[];
  from: string | null;
  effects: Record<string, number>;
}

export interface TFTSet16Data {
  set16: {
    name: string;
    champions: TFTChampion[];
    traits: TFTTrait[];
  };
  setData: {
    number: number;
    name: string;
    champions: string[];
    traits: string[];
    items: string[];
  };
}
