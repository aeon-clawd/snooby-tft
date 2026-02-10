"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTierColor } from '@/lib/tft-data';
import Link from 'next/link';

interface Comp {
  _id: string;
  name: string;
  description?: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  champions: any[];
  synergies: any[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CompsListPage() {
  const router = useRouter();
  const [comps, setComps] = useState<Comp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string | null>(null);
  
  const loadComps = async () => {
    try {
      const url = filterTier 
        ? `/api/comps?tier=${filterTier}`
        : '/api/comps';
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setComps(result.data);
      }
    } catch (error) {
      console.error('Failed to load comps:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadComps();
  }, [filterTier]);
  
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/comps/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Comp deleted successfully');
        loadComps();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete comp');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading comps...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-blue-300 hover:text-blue-200">
                ← Back to Admin
              </Link>
              <h1 className="text-2xl font-bold text-white">Team Compositions</h1>
            </div>
            <Link
              href="/admin/comps/new"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              + New Comp
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="mb-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Filter by Tier:</span>
            <button
              onClick={() => setFilterTier(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterTier === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {['S', 'A', 'B', 'C', 'D'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                  filterTier === tier
                    ? getTierColor(tier)
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
        
        {/* Lista de comps */}
        {comps.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-white mb-2">No comps yet</h2>
            <p className="text-blue-200 mb-6">
              Create your first team composition to get started
            </p>
            <Link
              href="/admin/comps/new"
              className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Create First Comp
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {comps.map((comp) => (
              <div
                key={comp._id}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`px-3 py-1 rounded-lg font-bold ${getTierColor(comp.tier)}`}>
                        {comp.tier}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {comp.name}
                      </h3>
                      {!comp.isActive && (
                        <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    {comp.description && (
                      <p className="text-blue-200 text-sm mb-3">
                        {comp.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                      <span>
                        🎭 {comp.champions.length} champions
                      </span>
                      <span>
                        ⚡ {comp.synergies.filter((s: any) => s.isActive).length} synergies
                      </span>
                      <span>
                        📅 {new Date(comp.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Sinergias preview */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {comp.synergies.filter((s: any) => s.isActive).slice(0, 5).map((synergy: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-900/50 border border-blue-600 text-blue-200 text-xs rounded"
                        >
                          {synergy.name} ({synergy.tier})
                        </span>
                      ))}
                      {comp.synergies.filter((s: any) => s.isActive).length > 5 && (
                        <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                          +{comp.synergies.filter((s: any) => s.isActive).length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/comps/${comp._id}/edit`}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(comp._id, comp.name)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Estadísticas */}
        {comps.length > 0 && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">{comps.length}</div>
                <div className="text-sm text-gray-400">Total Comps</div>
              </div>
              {['S', 'A', 'B', 'C', 'D'].map((tier) => {
                const count = comps.filter(c => c.tier === tier).length;
                return (
                  <div key={tier} className="bg-white/5 rounded-lg p-4 text-center">
                    <div className={`text-3xl font-bold ${getTierColor(tier)} inline-block px-2 rounded`}>
                      {count}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Tier {tier}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
