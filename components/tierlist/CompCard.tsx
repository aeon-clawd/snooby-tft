'use client';

import { IComp } from '@/models/Comp';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Youtube } from 'lucide-react';

interface CompCardProps {
  comp: IComp;
}

/**
 * CompCard - Tarjeta visual de composición estilo Tacter
 * 
 * Features:
 * - Grid de campeones con iconos de Data Dragon
 * - Items core destacados
 * - Badges de sinergias
 * - Carry principal resaltado
 * - Links a guía/video
 */
export default function CompCard({ comp }: CompCardProps) {
  const carry = comp.champions.find(c => c.isCarry);
  
  // Data Dragon base URL (TFT Set 13 - actualizar según set activo)
  const DD_BASE = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/tft-champion';
  const DD_ITEM_BASE = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/tft-item';
  
  // Formatear nombre de campeón para Data Dragon (ej: "Warwick" -> "TFT13_Warwick.jpg")
  const getChampionIcon = (name: string) => {
    // Normalizar nombre: quitar espacios, capitalizar
    const normalized = name.replace(/\s+/g, '');
    return `${DD_BASE}/TFT13_${normalized}.TFT_Set13.jpg`;
  };
  
  const getItemIcon = (itemName: string) => {
    // Normalizar nombre de item (ej: "Bloodthirster" -> "TFT_Item_Bloodthirster.png")
    const normalized = itemName.replace(/\s+/g, '');
    return `${DD_ITEM_BASE}/TFT_Item_${normalized}.png`;
  };
  
  // Fallback si imagen falla
  const handleImageError = (e: any) => {
    e.target.src = '/placeholder-champion.png'; // Crear placeholder genérico
  };

  return (
    <div className="group relative bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all overflow-hidden shadow-lg hover:shadow-xl">
      {/* Header con nombre y tier */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-zinc-50 truncate">
              {comp.name}
            </h3>
            {comp.description && (
              <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                {comp.description}
              </p>
            )}
          </div>
          
          {/* External links */}
          <div className="flex gap-2 flex-shrink-0">
            {comp.videoUrl && (
              <a
                href={comp.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-red-600 hover:bg-red-500 transition-colors"
                title="Ver guía en YouTube"
              >
                <Youtube className="w-4 h-4 text-white" />
              </a>
            )}
            {comp.tacterUrl && (
              <a
                href={comp.tacterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors"
                title="Ver en Tacter.gg"
              >
                <ExternalLink className="w-4 h-4 text-zinc-300" />
              </a>
            )}
          </div>
        </div>
        
        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {comp.playstyle && (
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300">
              {comp.playstyle}
            </span>
          )}
          {comp.difficulty && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              comp.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
              comp.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
              'bg-red-900 text-red-300'
            }`}>
              {comp.difficulty}
            </span>
          )}
        </div>
      </div>
      
      {/* Champions grid */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {comp.champions
            .sort((a, b) => b.cost - a.cost) // Ordenar por coste (5-cost primero)
            .map((champion, idx) => (
              <div
                key={idx}
                className={`relative ${
                  champion.isCarry ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-900' : ''
                }`}
                title={`${champion.name} (${champion.cost}★)`}
              >
                {/* Champion icon */}
                <div className="relative w-14 h-14 rounded-md overflow-hidden bg-zinc-800">
                  <Image
                    src={getChampionIcon(champion.name)}
                    alt={champion.name}
                    fill
                    className="object-cover"
                    onError={handleImageError}
                  />
                  
                  {/* Cost badge */}
                  <div className={`absolute bottom-0 right-0 px-1.5 py-0.5 text-xs font-bold ${
                    champion.cost === 5 ? 'bg-yellow-500 text-black' :
                    champion.cost === 4 ? 'bg-purple-500 text-white' :
                    champion.cost === 3 ? 'bg-blue-500 text-white' :
                    champion.cost === 2 ? 'bg-green-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {champion.cost}
                  </div>
                  
                  {/* Stars indicator */}
                  {champion.stars && champion.stars > 1 && (
                    <div className="absolute top-0 left-0 right-0 bg-black/60 text-yellow-400 text-center text-xs py-0.5">
                      {'★'.repeat(champion.stars)}
                    </div>
                  )}
                  
                  {/* Carry indicator */}
                  {champion.isCarry && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full border border-yellow-600"></div>
                  )}
                </div>
                
                {/* Items (mostrar máximo 3) */}
                {champion.items.length > 0 && (
                  <div className="flex gap-0.5 mt-1 justify-center">
                    {champion.items.slice(0, 3).map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="w-4 h-4 rounded-sm overflow-hidden bg-zinc-700"
                        title={item}
                      >
                        <Image
                          src={getItemIcon(item)}
                          alt={item}
                          width={16}
                          height={16}
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
        
        {/* Synergies badges */}
        <div className="border-t border-zinc-800 pt-3">
          <div className="flex flex-wrap gap-2">
            {comp.synergies
              .filter(s => s.isActive !== false)
              .sort((a, b) => b.tier - a.tier) // Tier más alto primero
              .map((synergy, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700"
                >
                  <span className="text-yellow-400 font-bold">{synergy.tier}</span>
                  {synergy.name}
                </span>
              ))}
          </div>
        </div>
        
        {/* Carry highlight (si existe) */}
        {carry && (
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-xs text-zinc-400">
                Carry: <span className="text-zinc-200 font-medium">{carry.name}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
