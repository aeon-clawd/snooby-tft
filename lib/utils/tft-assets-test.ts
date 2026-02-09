/**
 * Test script for TFT Assets helpers
 * Run with: npx tsx lib/utils/tft-assets-test.ts
 */

import {
  getChampionIcon,
  getTraitIcon,
  getChampionByName,
  getTraitByName,
  getAllChampions,
  getAllTraits,
  searchChampions,
} from './tft-assets-simple';

console.log('=== TFT Set 16 Assets Test ===\n');

// Test champion lookup
console.log('1. Champion Icon Tests:');
const testChampions = ['Tristana', 'Lulu', 'Teemo', 'Nautilus'];
testChampions.forEach((name) => {
  const squareIcon = getChampionIcon(name, true);
  const splashIcon = getChampionIcon(name, false);
  console.log(`  ${name}:`);
  console.log(`    Square: ${squareIcon}`);
  console.log(`    Splash: ${splashIcon}`);
});

// Test trait lookup
console.log('\n2. Trait Icon Tests:');
const testTraits = ['Yordle', 'Gunslinger', 'Poison Pals'];
testTraits.forEach((name) => {
  const icon = getTraitIcon(name);
  console.log(`  ${name}: ${icon}`);
});

// Test champion data
console.log('\n3. Champion Data Test:');
const tristana = getChampionByName('Tristana');
if (tristana) {
  console.log(`  Name: ${tristana.name}`);
  console.log(`  Cost: ${tristana.cost}`);
  console.log(`  Traits: ${tristana.traits.join(', ')}`);
  console.log(`  HP: ${tristana.stats.hp}`);
  console.log(`  Mana: ${tristana.stats.mana}`);
}

// Test trait data
console.log('\n4. Trait Data Test:');
const yordle = getTraitByName('Yordle');
if (yordle) {
  console.log(`  Name: ${yordle.name}`);
  console.log(`  Description: ${yordle.desc.substring(0, 100)}...`);
  console.log(`  Breakpoints: ${yordle.effects.map(e => e.minUnits).join(', ')}`);
}

// Test statistics
console.log('\n5. Statistics:');
console.log(`  Total champions: ${getAllChampions().length}`);
console.log(`  Total traits: ${getAllTraits().length}`);

// Test search
console.log('\n6. Search Test:');
const searchResults = searchChampions('te');
console.log(`  Search "te": ${searchResults.map(c => c.name).join(', ')}`);

console.log('\n=== Test Complete ===');
