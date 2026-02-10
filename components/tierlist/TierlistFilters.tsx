'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface TierlistFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  availableSynergies: string[];
  availableCarries: string[];
}

export interface FilterState {
  tiers: Set<string>;
  synergy: string;
  carry: string;
  search: string;
}

/**
 * TierlistFilters - Filtros interactivos para la tierlist
 * 
 * Features:
 * - Filtro por tier (múltiple)
 * - Filtro por sinergia
 * - Filtro por carry
 * - Búsqueda por nombre
 */
export default function TierlistFilters({
  onFilterChange,
  availableSynergies,
  availableCarries
}: TierlistFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    tiers: new Set(['S', 'A', 'B', 'C', 'D']),
    synergy: '',
    carry: '',
    search: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Notificar cambios al padre
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const toggleTier = (tier: string) => {
    setFilters(prev => {
      const newTiers = new Set(prev.tiers);
      if (newTiers.has(tier)) {
        newTiers.delete(tier);
      } else {
        newTiers.add(tier);
      }
      return { ...prev, tiers: newTiers };
    });
  };

  const resetFilters = () => {
    setFilters({
      tiers: new Set(['S', 'A', 'B', 'C', 'D']),
      synergy: '',
      carry: '',
      search: ''
    });
  };

  const hasActiveFilters = 
    filters.tiers.size !== 5 || 
    filters.synergy !== '' || 
    filters.carry !== '' || 
    filters.search !== '';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6 shadow-lg">
      {/* Mobile toggle + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar comp por nombre..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        
        {/* Toggle filters button (mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Filters section */}
      <div className={`space-y-4 ${showFilters ? 'block' : 'hidden'} sm:block`}>
        {/* Tier filters */}
        <div>
          <label className="text-sm font-medium text-zinc-400 mb-2 block">
            Tiers
          </label>
          <div className="flex flex-wrap gap-2">
            {['S', 'A', 'B', 'C', 'D'].map((tier) => (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                className={`px-4 py-2 rounded-md font-bold transition-all ${
                  filters.tiers.has(tier)
                    ? tier === 'S' ? 'bg-yellow-500 text-black' :
                      tier === 'A' ? 'bg-green-500 text-white' :
                      tier === 'B' ? 'bg-blue-500 text-white' :
                      tier === 'C' ? 'bg-purple-500 text-white' :
                      'bg-gray-500 text-white'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Synergy + Carry filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Synergy filter */}
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-2 block">
              Sinergia
            </label>
            <select
              value={filters.synergy}
              onChange={(e) => setFilters(prev => ({ ...prev, synergy: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Todas las sinergias</option>
              {availableSynergies.sort().map((synergy) => (
                <option key={synergy} value={synergy}>
                  {synergy}
                </option>
              ))}
            </select>
          </div>

          {/* Carry filter */}
          <div>
            <label className="text-sm font-medium text-zinc-400 mb-2 block">
              Carry
            </label>
            <select
              value={filters.carry}
              onChange={(e) => setFilters(prev => ({ ...prev, carry: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Todos los carries</option>
              {availableCarries.sort().map((carry) => (
                <option key={carry} value={carry}>
                  {carry}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-300 hover:bg-zinc-700 transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
