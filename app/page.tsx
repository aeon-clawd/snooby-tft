'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { IComp } from '@/models/Comp';
import TierSection from '@/components/tierlist/TierSection';
import TierlistFilters, { FilterState } from '@/components/tierlist/TierlistFilters';
import YouTubeSection from '@/components/youtube/YouTubeSection';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * SnoobyTFT - Página principal de Tierlist de Comps
 * 
 * Features:
 * - Fetch de comps desde API
 * - Organización por tier (S/A/B/C/D)
 * - Filtros interactivos (tier, sinergia, carry, búsqueda)
 * - Diseño responsive mobile-first
 * - Estilo gaming/oscuro
 */
export default function Home() {
  const [comps, setComps] = useState<IComp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    tiers: new Set(['S', 'A', 'B', 'C', 'D']),
    synergy: '',
    carry: '',
    search: ''
  });

  // Fetch comps from API
  useEffect(() => {
    async function fetchComps() {
      try {
        setLoading(true);
        const response = await fetch('/api/comps?isActive=true');
        
        if (!response.ok) {
          throw new Error('Error al cargar las composiciones');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setComps(data.data);
        } else {
          throw new Error(data.error || 'Error desconocido');
        }
      } catch (err: any) {
        console.error('Error fetching comps:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchComps();
  }, []);

  // Extract unique synergies and carries for filters
  const { availableSynergies, availableCarries } = useMemo(() => {
    const synergies = new Set<string>();
    const carries = new Set<string>();

    comps.forEach(comp => {
      comp.synergies.forEach(s => {
        if (s.isActive !== false) {
          synergies.add(s.name);
        }
      });
      
      const carry = comp.champions.find(c => c.isCarry);
      if (carry) {
        carries.add(carry.name);
      }
    });

    return {
      availableSynergies: Array.from(synergies),
      availableCarries: Array.from(carries)
    };
  }, [comps]);

  // Filter comps based on current filters
  const filteredComps = useMemo(() => {
    return comps.filter(comp => {
      // Filter by tier
      if (!filters.tiers.has(comp.tier)) {
        return false;
      }

      // Filter by synergy
      if (filters.synergy) {
        const hasSynergy = comp.synergies.some(
          s => s.name === filters.synergy && s.isActive !== false
        );
        if (!hasSynergy) return false;
      }

      // Filter by carry
      if (filters.carry) {
        const carry = comp.champions.find(c => c.isCarry);
        if (!carry || carry.name !== filters.carry) {
          return false;
        }
      }

      // Filter by search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = comp.name.toLowerCase().includes(searchLower);
        const matchesChampion = comp.champions.some(c =>
          c.name.toLowerCase().includes(searchLower)
        );
        const matchesSynergy = comp.synergies.some(s =>
          s.name.toLowerCase().includes(searchLower)
        );
        
        if (!matchesName && !matchesChampion && !matchesSynergy) {
          return false;
        }
      }

      return true;
    });
  }, [comps, filters]);

  // Group filtered comps by tier
  const compsByTier = useMemo(() => {
    const groups: Record<string, IComp[]> = {
      S: [],
      A: [],
      B: [],
      C: [],
      D: []
    };

    filteredComps.forEach(comp => {
      groups[comp.tier].push(comp);
    });

    return groups;
  }, [filteredComps]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
          <p className="text-zinc-400 text-lg">Cargando composiciones...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-900 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-red-500">Error</h2>
          </div>
          <p className="text-zinc-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Empty state (no comps in DB)
  if (comps.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-zinc-200 mb-3">
            No hay composiciones disponibles
          </h2>
          <p className="text-zinc-400 mb-6">
            La base de datos está vacía. Ejecuta el script de seed para agregar comps de ejemplo.
          </p>
          <code className="block bg-zinc-800 text-yellow-400 px-4 py-2 rounded text-sm">
            npm run seed
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-b border-zinc-700 shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
            SnoobyTFT
          </h1>
          <p className="text-zinc-400 text-lg">
            Tierlist de composiciones TFT · Set 13
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <TierlistFilters
          onFilterChange={handleFilterChange}
          availableSynergies={availableSynergies}
          availableCarries={availableCarries}
        />

        {/* Results count */}
        <div className="mb-6">
          <p className="text-zinc-400 text-sm">
            Mostrando <span className="text-yellow-400 font-bold">{filteredComps.length}</span> de {comps.length} composiciones
          </p>
        </div>

        {/* Tierlist sections */}
        {filteredComps.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
            <p className="text-zinc-400 text-lg">
              No se encontraron composiciones con los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {(['S', 'A', 'B', 'C', 'D'] as const).map((tier) => (
              <TierSection
                key={tier}
                tier={tier}
                comps={compsByTier[tier]}
              />
            ))}
          </div>
        )}

        {/* YouTube Section */}
        <div className="mt-12">
          <YouTubeSection maxVideos={6} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
          <p>SnoobyTFT · Tierlist de comps para TFT Set 13</p>
          <p className="mt-2">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </footer>
    </div>
  );
}
