"use client";

import { useState } from 'react';
import { TFTChampion } from '@/types/tft';
import { getPlayableChampions, getChampionsByCost, getAssetUrl, getCostColor } from '@/lib/tft-data';
import Image from 'next/image';

interface ChampionSelectorProps {
  champions: TFTChampion[];
  onSelectChampion: (champion: TFTChampion) => void;
  selectedChampionIds: string[];
}

export default function ChampionSelector({ 
  champions, 
  onSelectChampion,
  selectedChampionIds 
}: ChampionSelectorProps) {
  const [selectedCost, setSelectedCost] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const playableChampions = getPlayableChampions(champions);
  
  // Filtrar por coste si está seleccionado
  let filteredChampions = selectedCost 
    ? getChampionsByCost(champions, selectedCost)
    : playableChampions;
  
  // Filtrar por búsqueda
  if (searchQuery) {
    filteredChampions = filteredChampions.filter(champ => 
      champ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      champ.traits.some(trait => trait.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  // Ordenar por coste y nombre
  filteredChampions.sort((a, b) => {
    if (a.cost !== b.cost) return a.cost - b.cost;
    return a.name.localeCompare(b.name);
  });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-bold text-white">Select Champions</h3>
        <input
          type="text"
          placeholder="Search champions or traits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Filtro por coste */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedCost(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCost === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </button>
        {[1, 2, 3, 4, 5].map((cost) => (
          <button
            key={cost}
            onClick={() => setSelectedCost(cost)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCost === cost
                ? getCostColor(cost)
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {cost}★
          </button>
        ))}
      </div>
      
      {/* Grid de campeones */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-96 overflow-y-auto p-2 bg-gray-800/50 rounded-lg">
        {filteredChampions.map((champion) => {
          const isSelected = selectedChampionIds.includes(champion.apiName);
          
          return (
            <button
              key={champion.apiName}
              onClick={() => onSelectChampion(champion)}
              disabled={isSelected}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'opacity-40 cursor-not-allowed border-gray-600'
                  : 'hover:scale-105 hover:shadow-lg cursor-pointer ' + getCostColor(champion.cost)
              }`}
              title={`${champion.name} (${champion.cost}★) - ${champion.traits.join(', ')}`}
            >
              <div className="relative w-full h-full bg-gray-900">
                {champion.icon && (
                  <Image
                    src={getAssetUrl(champion.icon)}
                    alt={champion.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              
              {/* Indicador de coste */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs font-bold text-center py-0.5">
                {champion.cost}★
              </div>
              
              {/* Indicador de seleccionado */}
              {isSelected && (
                <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {filteredChampions.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No champions found
        </div>
      )}
    </div>
  );
}
