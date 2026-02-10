"use client";

import { useState } from 'react';
import { TFTItem } from '@/types/tft';
import { getCombinedItems, getAssetUrl } from '@/lib/tft-data';
import Image from 'next/image';

interface ItemSelectorProps {
  items: TFTItem[];
  selectedItems: string[];
  onToggleItem: (itemApiName: string) => void;
  maxItems?: number;
}

export default function ItemSelector({ 
  items, 
  selectedItems, 
  onToggleItem,
  maxItems = 3 
}: ItemSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Solo items combinados (no componentes básicos)
  const combinedItems = getCombinedItems(items);
  
  // Filtrar por búsqueda
  let filteredItems = searchQuery
    ? combinedItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : combinedItems;
  
  // Ordenar alfabéticamente
  filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  
  const canSelectMore = selectedItems.length < maxItems;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h4 className="text-sm font-bold text-white">
          Items ({selectedItems.length}/{maxItems})
        </h4>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      {/* Grid de items */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-800/50 rounded">
        {filteredItems.map((item) => {
          const isSelected = selectedItems.includes(item.apiName);
          const canSelect = canSelectMore || isSelected;
          
          return (
            <button
              key={item.apiName}
              onClick={() => canSelect && onToggleItem(item.apiName)}
              disabled={!canSelect}
              className={`relative aspect-square rounded border-2 transition-all ${
                isSelected
                  ? 'border-yellow-400 bg-yellow-900/30 shadow-lg shadow-yellow-500/50'
                  : canSelect
                  ? 'border-gray-600 hover:border-blue-400 hover:scale-105'
                  : 'border-gray-700 opacity-40 cursor-not-allowed'
              }`}
              title={`${item.name}\n${item.desc}`}
            >
              <div className="relative w-full h-full bg-gray-900 rounded">
                {item.icon && (
                  <Image
                    src={getAssetUrl(item.icon)}
                    alt={item.name}
                    fill
                    className="object-cover p-1"
                    unoptimized
                  />
                )}
              </div>
              
              {/* Indicador de selección */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                  {selectedItems.indexOf(item.apiName) + 1}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {!canSelectMore && (
        <p className="text-xs text-yellow-400">
          Maximum {maxItems} items reached
        </p>
      )}
      
      {filteredItems.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-4">
          No items found
        </div>
      )}
    </div>
  );
}
