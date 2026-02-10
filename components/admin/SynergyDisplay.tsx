"use client";

import { TFTTrait } from '@/types/tft';
import { getAssetUrl, getSynergyStyleColor } from '@/lib/tft-data';
import Image from 'next/image';

interface SynergyDisplayProps {
  synergies: {
    trait: TFTTrait;
    count: number;
    activeTier: number;
  }[];
}

export default function SynergyDisplay({ synergies }: SynergyDisplayProps) {
  if (synergies.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Add champions to see synergies
      </div>
    );
  }
  
  // Separar sinergias activas de inactivas
  const activeSynergies = synergies.filter(s => s.activeTier > 0);
  const inactiveSynergies = synergies.filter(s => s.activeTier === 0);
  
  return (
    <div className="space-y-4">
      {/* Sinergias Activas */}
      {activeSynergies.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-green-400">Active Synergies</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {activeSynergies.map(({ trait, count, activeTier }) => {
              const activeEffect = trait.effects[activeTier - 1];
              const styleColor = getSynergyStyleColor(activeEffect?.style || 1);
              
              return (
                <div
                  key={trait.apiName}
                  className={`relative bg-gray-800 rounded-lg p-2 border-2 ${styleColor}`}
                  title={trait.desc}
                >
                  <div className="flex items-center gap-2">
                    {/* Icono de la sinergia */}
                    <div className="relative w-8 h-8 rounded bg-gray-900 flex-shrink-0">
                      {trait.icon && (
                        <Image
                          src={getAssetUrl(trait.icon)}
                          alt={trait.name}
                          fill
                          className="object-cover p-0.5"
                          unoptimized
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {trait.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {count} / {activeEffect?.maxUnits || '?'}
                      </div>
                    </div>
                    
                    {/* Badge del tier activo */}
                    <div className={`px-2 py-0.5 rounded text-xs font-bold ${styleColor}`}>
                      {count}
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ 
                        width: `${(count / (activeEffect?.maxUnits || count)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Sinergias Inactivas */}
      {inactiveSynergies.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-500">Inactive Synergies</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {inactiveSynergies.map(({ trait, count }) => {
              const minRequired = trait.effects[0]?.minUnits || 2;
              
              return (
                <div
                  key={trait.apiName}
                  className="relative bg-gray-900/50 rounded-lg p-2 border border-gray-700 opacity-60"
                  title={`${trait.name} - Need ${minRequired} units (have ${count})`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="relative w-6 h-6 rounded bg-gray-800 flex-shrink-0">
                      {trait.icon && (
                        <Image
                          src={getAssetUrl(trait.icon)}
                          alt={trait.name}
                          fill
                          className="object-cover p-0.5"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {count}/{minRequired}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
