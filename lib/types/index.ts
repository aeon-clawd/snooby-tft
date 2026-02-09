/**
 * Core type definitions for SnoobyTFT
 */

export interface TFTComp {
  id: string;
  name: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  traits: string[];
  units: string[];
  items: string[];
  description?: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamerData {
  name: string;
  twitchChannel?: string;
  youtubeChannel?: string;
  avatar?: string;
}

export type TierRank = 'S' | 'A' | 'B' | 'C' | 'D';
