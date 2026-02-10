"use client";

import { useState, useEffect } from 'react';
import { TFTSetData, SelectedChampion, TFTChampion } from '@/types/tft';
import { loadTFTData, calculateSynergies, findItem } from '@/lib/tft-data';
import ChampionSelector from './ChampionSelector';
import ItemSelector from './ItemSelector';
import SynergyDisplay from './SynergyDisplay';
import CompPreview from './CompPreview';
import { useRouter } from 'next/navigation';

interface CompBuilderProps {
  initialData?: any; // Datos de comp existente para editar
  mode: 'create' | 'edit';
  compId?: string;
}

export default function CompBuilder({ initialData, mode, compId }: CompBuilderProps) {
  const router = useRouter();
  
  // Estado del formulario
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [tier, setTier] = useState<'S' | 'A' | 'B' | 'C' | 'D'>(initialData?.tier || 'B');
  const [selectedChampions, setSelectedChampions] = useState<SelectedChampion[]>([]);
  const [augments, setAugments] = useState<string[]>(initialData?.augments || []);
  const [artifacts, setArtifacts] = useState<string[]>(initialData?.artifacts || []);
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [playstyle, setPlaystyle] = useState(initialData?.playstyle || '');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(initialData?.difficulty || 'Medium');
  
  // Datos de TFT
  const [tftData, setTftData] = useState<TFTSetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // UI state
  const [editingChampionId, setEditingChampionId] = useState<string | null>(null);
  const [currentAugmentInput, setCurrentAugmentInput] = useState('');
  const [currentArtifactInput, setCurrentArtifactInput] = useState('');
  
  // Cargar datos TFT
  useEffect(() => {
    loadTFTData()
      .then(data => {
        setTftData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load TFT data:', err);
        setLoading(false);
      });
  }, []);
  
  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData && tftData) {
      const loaded: SelectedChampion[] = initialData.champions.map((champ: any, idx: number) => {
        const foundChampion = tftData.champions.find(c => c.name === champ.name || c.apiName === champ.name);
        return {
          id: `${champ.name}-${idx}`,
          champion: foundChampion!,
          items: champ.items,
          stars: champ.stars || 2,
          isCarry: champ.isCarry || false,
        };
      }).filter((c: any) => c.champion); // Filtrar los que no se encontraron
      
      setSelectedChampions(loaded);
    }
  }, [initialData, tftData]);
  
  // Calcular sinergias automáticamente
  const synergies = tftData ? calculateSynergies(selectedChampions, tftData.traits) : [];
  
  // Handlers
  const handleSelectChampion = (champion: TFTChampion) => {
    const newChampion: SelectedChampion = {
      id: `${champion.apiName}-${Date.now()}`,
      champion,
      items: [],
      stars: 2,
      isCarry: false,
    };
    setSelectedChampions([...selectedChampions, newChampion]);
  };
  
  const handleRemoveChampion = (id: string) => {
    setSelectedChampions(selectedChampions.filter(c => c.id !== id));
  };
  
  const handleToggleItem = (championId: string, itemApiName: string) => {
    setSelectedChampions(selectedChampions.map(selected => {
      if (selected.id === championId) {
        const items = selected.items.includes(itemApiName)
          ? selected.items.filter(i => i !== itemApiName)
          : [...selected.items, itemApiName];
        return { ...selected, items };
      }
      return selected;
    }));
  };
  
  const handleToggleCarry = (championId: string) => {
    setSelectedChampions(selectedChampions.map(selected => {
      if (selected.id === championId) {
        return { ...selected, isCarry: !selected.isCarry };
      }
      return selected;
    }));
  };
  
  const handleChangeStars = (championId: string, stars: number) => {
    setSelectedChampions(selectedChampions.map(selected => {
      if (selected.id === championId) {
        return { ...selected, stars };
      }
      return selected;
    }));
  };
  
  const handleAddAugment = () => {
    if (currentAugmentInput.trim()) {
      setAugments([...augments, currentAugmentInput.trim()]);
      setCurrentAugmentInput('');
    }
  };
  
  const handleRemoveAugment = (index: number) => {
    setAugments(augments.filter((_, i) => i !== index));
  };
  
  const handleAddArtifact = () => {
    if (currentArtifactInput.trim()) {
      setArtifacts([...artifacts, currentArtifactInput.trim()]);
      setCurrentArtifactInput('');
    }
  };
  
  const handleRemoveArtifact = (index: number) => {
    setArtifacts(artifacts.filter((_, i) => i !== index));
  };
  
  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a comp name');
      return;
    }
    
    if (selectedChampions.length === 0) {
      alert('Please add at least one champion');
      return;
    }
    
    const activeSynergies = synergies.filter(s => s.activeTier > 0);
    
    if (activeSynergies.length === 0) {
      alert('Please add champions to create at least one active synergy');
      return;
    }
    
    setSaving(true);
    
    try {
      const compData = {
        name: name.trim(),
        description: description.trim(),
        tier,
        champions: selectedChampions.map(selected => ({
          name: selected.champion.name,
          cost: selected.champion.cost,
          items: selected.items,
          isCarry: selected.isCarry,
          stars: selected.stars,
        })),
        synergies: activeSynergies.map(({ trait, count, activeTier }) => ({
          name: trait.name,
          tier: activeTier,
          isActive: true,
        })),
        augments,
        artifacts,
        videoUrl: videoUrl.trim(),
        playstyle: playstyle.trim(),
        difficulty,
        positioning: [], // TODO: Implementar board positioning
        tftSet: 'Set 16',
        isActive: true,
      };
      
      const url = mode === 'create' ? '/api/comps' : `/api/comps/${compId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(mode === 'create' ? 'Comp created successfully!' : 'Comp updated successfully!');
        router.push('/admin/comps');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save comp');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading TFT data...</div>
      </div>
    );
  }
  
  if (!tftData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">Failed to load TFT data</div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel izquierdo - Builder */}
      <div className="lg:col-span-2 space-y-6">
        {/* Información básica */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Comp Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Invoker Reroll"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the comp..."
                rows={3}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tier *
                </label>
                <div className="flex gap-2">
                  {(['S', 'A', 'B', 'C', 'D'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTier(t)}
                      className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                        tier === t
                          ? t === 'S' ? 'bg-red-500 text-white' :
                            t === 'A' ? 'bg-orange-500 text-white' :
                            t === 'B' ? 'bg-yellow-500 text-black' :
                            t === 'C' ? 'bg-green-500 text-white' :
                            'bg-gray-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Playstyle
              </label>
              <input
                type="text"
                value={playstyle}
                onChange={(e) => setPlaystyle(e.target.value)}
                placeholder="e.g., Reroll, Fast 8, Slow Roll"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video URL (YouTube)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Selector de campeones */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <ChampionSelector
            champions={tftData.champions}
            onSelectChampion={handleSelectChampion}
            selectedChampionIds={selectedChampions.map(c => c.champion.apiName)}
          />
        </div>
        
        {/* Campeones seleccionados con items */}
        {selectedChampions.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">
              Selected Champions ({selectedChampions.length}/10)
            </h3>
            
            <div className="space-y-4">
              {selectedChampions.map((selected) => (
                <div
                  key={selected.id}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-bold">{selected.champion.name}</h4>
                      <p className="text-sm text-gray-400">
                        {selected.champion.cost}★ - {selected.champion.traits.join(', ')}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Stars selector */}
                      <div className="flex gap-1">
                        {[1, 2, 3].map((stars) => (
                          <button
                            key={stars}
                            onClick={() => handleChangeStars(selected.id, stars)}
                            className={`px-2 py-1 text-xs rounded ${
                              selected.stars === stars
                                ? 'bg-yellow-500 text-black'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {stars}★
                          </button>
                        ))}
                      </div>
                      
                      {/* Carry toggle */}
                      <button
                        onClick={() => handleToggleCarry(selected.id)}
                        className={`px-3 py-1 text-xs rounded font-medium ${
                          selected.isCarry
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Carry
                      </button>
                      
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveChampion(selected.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Item selector para este campeón */}
                  {editingChampionId === selected.id && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <ItemSelector
                        items={tftData.items}
                        selectedItems={selected.items}
                        onToggleItem={(itemApiName) => handleToggleItem(selected.id, itemApiName)}
                        maxItems={3}
                      />
                    </div>
                  )}
                  
                  <button
                    onClick={() => setEditingChampionId(editingChampionId === selected.id ? null : selected.id)}
                    className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    {editingChampionId === selected.id ? '▲ Hide Items' : '▼ Add Items'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Sinergias calculadas */}
        {synergies.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Synergies</h3>
            <SynergyDisplay synergies={synergies} />
          </div>
        )}
        
        {/* Augments */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Recommended Augments</h3>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentAugmentInput}
              onChange={(e) => setCurrentAugmentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddAugment()}
              placeholder="e.g., Cybernetic Implants"
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddAugment}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {augments.map((augment, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-1.5 border border-gray-700"
              >
                <span className="text-sm text-white">{augment}</span>
                <button
                  onClick={() => handleRemoveAugment(idx)}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Artifacts */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Recommended Artifacts</h3>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentArtifactInput}
              onChange={(e) => setCurrentArtifactInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddArtifact()}
              placeholder="e.g., Fishbones"
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddArtifact}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {artifacts.map((artifact, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-1.5 border border-gray-700"
              >
                <span className="text-sm text-white">{artifact}</span>
                <button
                  onClick={() => handleRemoveArtifact(idx)}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-bold text-lg transition-colors"
          >
            {saving ? 'Saving...' : mode === 'create' ? 'Create Comp' : 'Update Comp'}
          </button>
          
          <button
            onClick={() => router.push('/admin/comps')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
      
      {/* Panel derecho - Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <CompPreview
            name={name}
            tier={tier}
            champions={selectedChampions}
            allItems={tftData.items}
            synergies={synergies}
          />
        </div>
      </div>
    </div>
  );
}
