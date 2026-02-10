/**
 * Mock data for development/demo purposes
 * This can be used when MongoDB is not available
 */

export const mockComps = [
  {
    _id: "mock-1",
    name: "Reroll Warwick",
    description: "Fast reroll comp focused on 3-star Warwick carry",
    champions: [
      { name: "Warwick", cost: 1, items: ["Bloodthirster", "TitansResolve", "Guardbreaker"], isCarry: true, stars: 3 },
      { name: "Vi", cost: 2, items: [], isCarry: false, stars: 2 },
      { name: "Ezreal", cost: 3, items: [], isCarry: false, stars: 2 },
      { name: "Jayce", cost: 4, items: [], isCarry: false, stars: 2 },
      { name: "Caitlyn", cost: 5, items: [], isCarry: false, stars: 1 }
    ],
    synergies: [
      { name: "Enforcer", tier: 4, isActive: true },
      { name: "Ambusher", tier: 3, isActive: true },
      { name: "Experiment", tier: 2, isActive: true }
    ],
    tier: "S",
    positioning: [],
    augments: ["Metabolic Accelerator", "Jeweled Lotus", "Thrill of the Hunt"],
    artifacts: ["Tactician's Crown", "Cursed Blade"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tacterUrl: "https://tacter.gg/tft/comps/warwick-reroll",
    tftSet: "Set 13",
    patch: "14.2",
    playstyle: "Reroll",
    difficulty: "Medium",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "mock-2",
    name: "Fast 8 Bruisers",
    description: "Level to 8 and stabilize with strong bruiser frontline",
    champions: [
      { name: "Viego", cost: 5, items: ["InfinityEdge", "LastWhisper", "Bloodthirster"], isCarry: true, stars: 2 },
      { name: "Sett", cost: 4, items: ["WarmogsArmor", "SunfireCape"], isCarry: false, stars: 2 },
      { name: "Vi", cost: 2, items: [], isCarry: false, stars: 2 },
      { name: "Warwick", cost: 1, items: [], isCarry: false, stars: 2 }
    ],
    synergies: [
      { name: "Bruiser", tier: 6, isActive: true },
      { name: "Conqueror", tier: 3, isActive: true },
      { name: "Enforcer", tier: 2, isActive: true }
    ],
    tier: "A",
    positioning: [],
    augments: ["Bruiser Crest", "Combat Training", "Second Wind"],
    artifacts: [],
    tftSet: "Set 13",
    patch: "14.2",
    playstyle: "Fast 8",
    difficulty: "Easy",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "mock-3",
    name: "Invoker Ryze",
    description: "Magic damage comp centered around Ryze with Invoker synergy",
    champions: [
      { name: "Ryze", cost: 4, items: ["ArchangelsStaff", "JeweledGauntlet", "Morellonomicon"], isCarry: true, stars: 2 },
      { name: "Ziggs", cost: 2, items: [], isCarry: false, stars: 2 },
      { name: "TwistedFate", cost: 3, items: [], isCarry: false, stars: 2 },
      { name: "Xerath", cost: 5, items: [], isCarry: false, stars: 1 }
    ],
    synergies: [
      { name: "Invoker", tier: 6, isActive: true },
      { name: "Scholar", tier: 4, isActive: true }
    ],
    tier: "B",
    positioning: [],
    augments: ["Invoker Crest", "Ascension", "Celestial Blessing"],
    artifacts: ["Spatula"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tftSet: "Set 13",
    patch: "14.1",
    playstyle: "Slow Roll",
    difficulty: "Hard",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "mock-4",
    name: "Sniper Caitlyn",
    description: "Long-range backline carry with Sniper synergy",
    champions: [
      { name: "Caitlyn", cost: 5, items: ["LastWhisper", "InfinityEdge", "GiantSlayer"], isCarry: true, stars: 2 },
      { name: "Jinx", cost: 4, items: [], isCarry: false, stars: 2 },
      { name: "Tristana", cost: 2, items: [], isCarry: false, stars: 2 },
      { name: "MissFortune", cost: 3, items: [], isCarry: false, stars: 2 }
    ],
    synergies: [
      { name: "Sniper", tier: 4, isActive: true },
      { name: "Enforcer", tier: 3, isActive: true }
    ],
    tier: "A",
    positioning: [],
    augments: ["Sniper's Focus", "Critical Condition", "Marksman Heart"],
    artifacts: [],
    tftSet: "Set 13",
    patch: "14.2",
    playstyle: "Fast 8",
    difficulty: "Medium",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "mock-5",
    name: "Quickdraw Samira",
    description: "High APM comp with Samira as primary carry",
    champions: [
      { name: "Samira", cost: 4, items: ["Bloodthirster", "LastWhisper", "TitansResolve"], isCarry: true, stars: 2 },
      { name: "Senna", cost: 3, items: [], isCarry: false, stars: 2 },
      { name: "Draven", cost: 2, items: [], isCarry: false, stars: 2 }
    ],
    synergies: [
      { name: "Quickdraw", tier: 5, isActive: true },
      { name: "Rebel", tier: 3, isActive: true }
    ],
    tier: "S",
    positioning: [],
    augments: ["Quickdraw Crest", "Featherweights", "Double Trouble"],
    artifacts: [],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tacterUrl: "https://tacter.gg/tft/comps/samira-quickdraw",
    tftSet: "Set 13",
    patch: "14.2",
    playstyle: "Reroll",
    difficulty: "Hard",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "mock-6",
    name: "Sentinel Ekko",
    description: "Ekko carry with Sentinel protection",
    champions: [
      { name: "Ekko", cost: 5, items: ["ArchangelsStaff", "Morellonomicon", "IonicSpark"], isCarry: true, stars: 2 },
      { name: "Blitzcrank", cost: 4, items: [], isCarry: false, stars: 2 },
      { name: "Camille", cost: 3, items: [], isCarry: false, stars: 2 }
    ],
    synergies: [
      { name: "Sentinel", tier: 4, isActive: true },
      { name: "Rebel", tier: 2, isActive: true }
    ],
    tier: "B",
    positioning: [],
    augments: ["Sentinel Emblem", "Prismatic Ticket", "Second Wind"],
    artifacts: [],
    tftSet: "Set 13",
    patch: "14.1",
    playstyle: "Fast 8",
    difficulty: "Medium",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "mock-7",
    name: "Dominator Sion",
    description: "Tank carry Sion with Dominator trait",
    champions: [
      { name: "Sion", cost: 4, items: ["Warmogs", "Gargoyle", "Redemption"], isCarry: true, stars: 2 },
      { name: "DrMundo", cost: 3, items: [], isCarry: false, stars: 2 },
      { name: "Urgot", cost: 5, items: [], isCarry: false, stars: 1 }
    ],
    synergies: [
      { name: "Dominator", tier: 3, isActive: true },
      { name: "Bruiser", tier: 4, isActive: true }
    ],
    tier: "C",
    positioning: [],
    augments: ["Stand United", "Cybernetic Implants", "True Twos"],
    artifacts: [],
    tftSet: "Set 13",
    patch: "14.2",
    playstyle: "Slow Roll",
    difficulty: "Easy",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
