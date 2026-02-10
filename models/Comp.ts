import mongoose, { Schema, Model, Document } from 'mongoose';

/**
 * SnoobyTFT - Comp Schema
 * 
 * Diseñado para flexibilidad y escalabilidad:
 * - Soporta múltiples sets de TFT (mediante metadata futura)
 * - Permite variantes de comps (positioning flexible)
 * - Indexado para búsquedas eficientes por tier, champions, synergies
 */

export interface IChampion {
  name: string;
  cost: number;
  items: string[];
  isCarry: boolean;
  stars?: number; // Opcional: 1, 2, 3 estrellas (default 2)
}

export interface ISynergy {
  name: string;
  tier: number; // Nivel de sinergia alcanzado (ej: 3, 6, 9 para Invoker)
  isActive?: boolean; // Opcional: si está activa o es placeholder
}

export interface IPosition {
  champion: string; // Nombre del campeón
  hex: string; // Formato "row-col" (ej: "0-3" para fila 0, columna 3)
  // Alternativa: {row: number, col: number} si prefieres objeto
}

// Interface para métodos de instancia
export interface ICompMethods {
  getEmbedVideoUrl(): string | null;
}

// Interface para métodos estáticos
export interface ICompModel extends Model<IComp, {}, ICompMethods> {
  findByTier(tier: string): Promise<IComp[]>;
  findByChampion(championName: string): Promise<IComp[]>;
  findBySynergy(synergyName: string): Promise<IComp[]>;
}

export interface IComp extends Document, ICompMethods {
  name: string;
  description?: string; // Descripción breve de la comp
  
  // Champions configuration
  champions: IChampion[];
  
  // Synergies achieved
  synergies: ISynergy[];
  
  // Tier ranking
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  
  // Board positioning
  positioning: IPosition[];
  
  // Game knowledge
  augments: string[]; // Aumentos recomendados
  artifacts: string[]; // Artefactos/Legendarios recomendados
  
  // External resources
  videoUrl?: string; // YouTube link
  tacterUrl?: string; // Tacter.gg guide link
  
  // Metadata (para futuras expansiones)
  tftSet?: string; // TFT Set (ej: "Set 13", "Set 14")
  patch?: string; // Patch version (ej: "14.1", "14.2")
  playstyle?: string; // Estilo de juego (ej: "Reroll", "Fast 8", "Slow Roll")
  difficulty?: 'Easy' | 'Medium' | 'Hard'; // Dificultad de ejecutar
  
  // Status
  isActive: boolean; // Si la comp está activa en el meta actual
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ChampionSchema = new Schema<IChampion>({
  name: { type: String, required: true },
  cost: { type: Number, required: true, min: 1, max: 5 },
  items: [{ type: String }],
  isCarry: { type: Boolean, default: false },
  stars: { type: Number, min: 1, max: 3, default: 2 }
}, { _id: false });

const SynergySchema = new Schema<ISynergy>({
  name: { type: String, required: true },
  tier: { type: Number, required: true, min: 1 },
  isActive: { type: Boolean, default: true }
}, { _id: false });

const PositionSchema = new Schema<IPosition>({
  champion: { type: String, required: true },
  hex: { type: String, required: true } // Formato "row-col"
}, { _id: false });

const CompSchema = new Schema<IComp>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 100
    },
    description: { 
      type: String, 
      maxlength: 500 
    },
    
    champions: {
      type: [ChampionSchema],
      required: true,
      validate: {
        validator: function(v: IChampion[]) {
          return v.length > 0 && v.length <= 10; // Min 1, max 10 champions
        },
        message: 'A comp must have between 1 and 10 champions'
      }
    },
    
    synergies: {
      type: [SynergySchema],
      required: true,
      validate: {
        validator: function(v: ISynergy[]) {
          return v.length > 0;
        },
        message: 'A comp must have at least one synergy'
      }
    },
    
    tier: {
      type: String,
      enum: ['S', 'A', 'B', 'C', 'D'],
      required: true,
      uppercase: true
    },
    
    positioning: {
      type: [PositionSchema],
      default: []
    },
    
    augments: {
      type: [String],
      default: []
    },
    
    artifacts: {
      type: [String],
      default: []
    },
    
    videoUrl: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(v);
        },
        message: 'Must be a valid YouTube URL'
      }
    },
    
    tacterUrl: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v) return true;
          return /^https?:\/\/(www\.)?tacter\.gg/.test(v);
        },
        message: 'Must be a valid Tacter.gg URL'
      }
    },
    
    // Metadata fields
    tftSet: { type: String, trim: true },
    patch: { type: String, trim: true },
    playstyle: { type: String, trim: true },
    difficulty: { 
      type: String, 
      enum: ['Easy', 'Medium', 'Hard'] 
    },
    
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
    collection: 'comps'
  }
);

// Índices para búsquedas eficientes
CompSchema.index({ tier: 1 }); // Buscar por tier
CompSchema.index({ 'champions.name': 1 }); // Buscar comps que contengan un campeón
CompSchema.index({ 'synergies.name': 1 }); // Buscar por sinergia
CompSchema.index({ isActive: 1, tier: 1 }); // Comps activas ordenadas por tier
CompSchema.index({ tftSet: 1, patch: 1 }); // Filtrar por set/patch
CompSchema.index({ createdAt: -1 }); // Ordenar por fecha (más recientes primero)

// Método de instancia: obtener URL del video de YouTube embedible
CompSchema.methods.getEmbedVideoUrl = function(): string | null {
  if (!this.videoUrl) return null;
  
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = this.videoUrl.match(youtubeRegex);
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  
  return null;
};

// Método estático: buscar comps por tier
CompSchema.statics.findByTier = function(tier: string) {
  return this.find({ tier: tier.toUpperCase(), isActive: true })
    .sort({ createdAt: -1 });
};

// Método estático: buscar comps que contengan un campeón
CompSchema.statics.findByChampion = function(championName: string) {
  return this.find({ 
    'champions.name': new RegExp(championName, 'i'),
    isActive: true 
  });
};

// Método estático: buscar comps por sinergia
CompSchema.statics.findBySynergy = function(synergyName: string) {
  return this.find({ 
    'synergies.name': new RegExp(synergyName, 'i'),
    isActive: true 
  });
};

// Prevenir modelo duplicado en hot reload (Next.js)
const Comp = (mongoose.models.Comp as ICompModel) || mongoose.model<IComp, ICompModel>('Comp', CompSchema);

export default Comp;
