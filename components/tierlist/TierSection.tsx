'use client';

import { IComp } from '@/models/Comp';
import CompCard from './CompCard';

interface TierSectionProps {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  comps: IComp[];
}

const tierConfig = {
  S: {
    label: 'S-Tier',
    description: 'Meta dominante',
    bgColor: 'bg-gradient-to-r from-yellow-600 to-yellow-500',
    textColor: 'text-black',
    borderColor: 'border-yellow-500'
  },
  A: {
    label: 'A-Tier',
    description: 'Muy fuerte',
    bgColor: 'bg-gradient-to-r from-green-600 to-green-500',
    textColor: 'text-white',
    borderColor: 'border-green-500'
  },
  B: {
    label: 'B-Tier',
    description: 'Viable',
    bgColor: 'bg-gradient-to-r from-blue-600 to-blue-500',
    textColor: 'text-white',
    borderColor: 'border-blue-500'
  },
  C: {
    label: 'C-Tier',
    description: 'Situacional',
    bgColor: 'bg-gradient-to-r from-purple-600 to-purple-500',
    textColor: 'text-white',
    borderColor: 'border-purple-500'
  },
  D: {
    label: 'D-Tier',
    description: 'No recomendada',
    bgColor: 'bg-gradient-to-r from-gray-600 to-gray-500',
    textColor: 'text-white',
    borderColor: 'border-gray-500'
  }
};

/**
 * TierSection - Sección visual para agrupar comps por tier
 * 
 * Separadores estilo tier list con gradientes y badges
 */
export default function TierSection({ tier, comps }: TierSectionProps) {
  const config = tierConfig[tier];
  
  if (comps.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      {/* Tier header */}
      <div className={`flex items-center gap-4 mb-4 pb-2 border-b-2 ${config.borderColor}`}>
        <div className={`${config.bgColor} ${config.textColor} px-4 py-2 rounded-lg font-bold text-xl shadow-lg`}>
          {config.label}
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-400 text-sm">{config.description}</span>
          <span className="text-zinc-500 text-xs">{comps.length} {comps.length === 1 ? 'comp' : 'comps'}</span>
        </div>
      </div>
      
      {/* Comps grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comps.map((comp) => (
          <CompCard key={comp._id.toString()} comp={comp} />
        ))}
      </div>
    </section>
  );
}
