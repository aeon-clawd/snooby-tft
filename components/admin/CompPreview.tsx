"use client";

import { SelectedChampion, TFTItem } from '@/types/tft';
import { getAssetUrl, getCostColor, getTierColor } from '@/lib/tft-data';
import Image from 'next/image';

interface CompPreviewProps {
  name: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  champions: SelectedChampion[];
  allItems: TFTItem[];
  synergies: { trait: any; count: number; activeTier: number }[];
}

export default function CompPreview({ 
  name, 
  tier, 
  champions, 
  allItems,
  synergies 
}: CompPreviewProps) {
  const activeSynergies = synergies.filter(s => s.activeTier > 0);
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">
            {name || 'Untitled Comp'}
          </h3>
          <p className="text-sm text-gray-400">
            {champions.length} champions
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg font-bold text-xl ${getTierColor(tier)}`}>
          {tier}
        </div>
      </div>
      
      {/* Sinergias activas */}
      {activeSynergies.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">SYNERGIES</h4>
          <div className="flex flex-wrap gap-2">
            {activeSynergies.map(({ trait, count }) => (
              <div
                key={trait.apiName}
                className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1.5 border border-gray-600"
              >
                {trait.icon && (
                  <div className="relative w-5 h-5">
                    <Image
                      src={getAssetUrl(trait.icon)}
                      alt={trait.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <span className="text-sm font-medium text-white">
                  {trait.name}
                </span>
                <span className="text-xs text-gray-400">
                  ({count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Lista de campeones */}
      {champions.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-400">CHAMPIONS</h4>
          <div className="grid grid-cols-1 gap-2">
            {champions.map((selected) => {
              const champion = selected.champion;
              const championItems = allItems.filter(item => 
                selected.items.includes(item.apiName)
              );
              
              return (
                <div
                  key={selected.id}
                  className={`flex items-center gap-3 bg-gray-800/50 rounded-lg p-2 border-2 ${getCostColor(champion.cost)}`}
                >
                  {/* Icono del campeón */}
                  <div className="relative w-12 h-12 rounded bg-gray-900 flex-shrink-0">
                    {champion.icon && (
                      <Image
                        src={getAssetUrl(champion.icon)}
                        alt={champion.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    {/* Estrellas */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-yellow-400 text-xs font-bold text-center">
                      {'★'.repeat(selected.stars)}
                    </div>
                  </div>
                  
                  {/* Info del campeón */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {champion.name}
                      </span>
                      {selected.isCarry && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                          CARRY
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {champion.cost}★ - {champion.traits.join(', ')}
                    </div>
                  </div>
                  
                  {/* Items */}
                  <div className="flex gap-1">
                    {championItems.map((item) => (
                      <div
                        key={item.apiName}
                        className="relative w-8 h-8 rounded border border-yellow-600 bg-gray-900"
                        title={item.name}
                      >
                        <Image
                          src={getAssetUrl(item.icon)}
                          alt={item.name}
                          fill
                          className="object-cover p-0.5"
                          unoptimized
                        />
                      </div>
                    ))}
                    {/* Placeholders para items vacíos */}
                    {Array.from({ length: 3 - championItems.length }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="w-8 h-8 rounded border border-dashed border-gray-700 bg-gray-900/30"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-2">🎮</div>
          <p>Add champions to see preview</p>
        </div>
      )}
      
      {/* Total cost */}
      {champions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Total Gold Cost:</span>
            <span className="text-yellow-400 font-bold text-lg">
              {champions.reduce((sum, c) => sum + c.champion.cost, 0)}g
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
