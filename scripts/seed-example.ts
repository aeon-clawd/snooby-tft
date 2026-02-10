/**
 * Seed script to populate database with example TFT compositions
 * Run with: npx tsx scripts/seed-example.ts
 */

import dbConnect from '../lib/mongodb';
import Comp from '../models/Comp';

const exampleComps = [
  {
    name: "Reroll Warwick",
    description: "Fast reroll comp focused on 3-star Warwick carry",
    champions: [
      { name: "Warwick", cost: 1, items: ["Bloodthirster", "Titan's Resolve", "Guardbreaker"], isCarry: true, stars: 3 },
      { name: "Vi", cost: 2, items: [], isCarry: false, stars: 2 },
      { name: "Ezreal", cost: 3, items: [], isCarry: false, stars: 2 },
      { name: "Jayce", cost: 4, items: [], isCarry: false, stars: 2 },
      { name: "Caitlyn", cost: 5, items: [], isCarry: false, stars: 1 }
    ],
    synergies: [
      { name: "Enforcer", tier: 4 },
      { name: "Ambusher", tier: 3 },
      { name: "Experiment", tier: 2 }
    ],
    tier: "S",
    positioning: [
      { champion: "Warwick", hex: "3-1" },
      { champion: "Vi", hex: "3-3" },
      { champion: "Ezreal", hex: "2-2" },
      { champion: "Jayce", hex: "2-4" },
      { champion: "Caitlyn", hex: "1-3" }
    ],
    augments: [
      "Metabolic Accelerator",
      "Jeweled Lotus",
      "Thrill of the Hunt"
    ],
    artifacts: [
      "Tactician's Crown",
      "Cursed Blade"
    ],
    videoUrl: "https://www.youtube.com/watch?v=example1",
    tacterUrl: "https://tacter.gg/tft/comps/warwick-reroll",
    tftSet: "Set 13",
    patch: "14.2",
    playstyle: "Reroll",
    difficulty: "Medium",
    isActive: true
  },
  {
    name: "Fast 8 Bruisers",
    description: "Level to 8 and stabilize with strong bruiser frontline",
    champions: [
      { name: "Viego", cost: 5, items: ["Infinity Edge", "Last Whisper", "Bloodthirster"], isCarry: true, stars: 2 },
      { name: "Sett", cost: 4, items: ["Warmog's Armor", "Sunfire Cape"], isCarry: false, stars: 2 },
      { name: "Vi", cost: 2, items: [], isCarry: false, stars: 2 },
      { name: "Warwick", cost: 1, items: [], isCarry: false, stars: 2 }
    ],
    synergies: [
      { name: "Bruiser", tier: 6 },
      { name: "Conqueror", tier: 3 },
      { name: "Enforcer", tier: 2 }
    ],
    tier: "A",
    positioning: [
      { champion: "Viego", hex: "3-5" },
      { champion: "Sett", hex: "3-2" },
      { champion: "Vi", hex: "2-3" },
      { champion: "Warwick", hex: "3-1" }
    ],
    augments: [
      "Bruiser Crest",
      "Combat Training",
      "Second Wind"
    ],
    artifacts: [],
    tftSet: "Set 13",
    patch: "14.2",
    playstyle: "Fast 8",
    difficulty: "Easy",
    isActive: true
  },
  {
    name: "Invoker Ryze",
    description: "Magic damage comp centered around Ryze with Invoker synergy",
    champions: [
      { name: "Ryze", cost: 4, items: ["Archangel's Staff", "Jeweled Gauntlet", "Morellonomicon"], isCarry: true, stars: 2 },
      { name: "Ziggs", cost: 2, items: [], isCarry: false, stars: 2 },
      { name: "Twisted Fate", cost: 3, items: [], isCarry: false, stars: 2 },
      { name: "Xerath", cost: 5, items: [], isCarry: false, stars: 1 }
    ],
    synergies: [
      { name: "Invoker", tier: 6 },
      { name: "Scholar", tier: 4 }
    ],
    tier: "B",
    positioning: [
      { champion: "Ryze", hex: "2-4" },
      { champion: "Ziggs", hex: "1-2" },
      { champion: "Twisted Fate", hex: "1-5" },
      { champion: "Xerath", hex: "0-3" }
    ],
    augments: [
      "Invoker Crest",
      "Ascension",
      "Celestial Blessing"
    ],
    artifacts: [
      "Spatula (for Invoker emblem)"
    ],
    videoUrl: "https://www.youtube.com/watch?v=example3",
    tftSet: "Set 13",
    patch: "14.1",
    playstyle: "Slow Roll",
    difficulty: "Hard",
    isActive: false // Old patch, not meta anymore
  }
];

async function seed() {
  try {
    console.log('🌱 Starting seed...');
    
    // Connect to database
    await dbConnect();
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data (optional - comment out to keep existing data)
    await Comp.deleteMany({});
    console.log('🗑️  Cleared existing comps');
    
    // Insert example comps
    const result = await Comp.insertMany(exampleComps);
    console.log(`✅ Inserted ${result.length} example compositions`);
    
    // Display inserted comps
    console.log('\n📋 Inserted compositions:');
    result.forEach((comp, index) => {
      console.log(`${index + 1}. ${comp.name} (Tier ${comp.tier}) - ${comp.champions.length} champions`);
    });
    
    // Test queries
    console.log('\n🔍 Testing queries...');
    
    const sTierComps = await Comp.findByTier('S');
    console.log(`S-Tier comps: ${sTierComps.length}`);
    
    const warwickComps = await Comp.findByChampion('Warwick');
    console.log(`Comps with Warwick: ${warwickComps.length}`);
    
    const invokerComps = await Comp.findBySynergy('Invoker');
    console.log(`Comps with Invoker synergy: ${invokerComps.length}`);
    
    console.log('\n✨ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
