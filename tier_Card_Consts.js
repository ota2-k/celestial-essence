// Celestial Essence - Game Constants

// Tier Cards Configuration
const TIER_CARDS = [
  // Tier 1 (Initial/初級)
  { id: 1, tier: 1, cost: { light: 1 }, points: 1, bonus: 'aqua', name: '光の欠片' },
  { id: 2, tier: 1, cost: { aqua: 1 }, points: 1, bonus: 'wind', name: '水の呼び声' },
  { id: 3, tier: 1, cost: { wind: 1 }, points: 1, bonus: 'fire', name: '風の導き' },
  { id: 4, tier: 1, cost: { fire: 1 }, points: 1, bonus: 'dark', name: '炎の煌き' },
  { id: 5, tier: 1, cost: { dark: 1 }, points: 1, bonus: 'light', name: '闇の息吹' },
  { id: 6, tier: 1, cost: { light: 1, aqua: 1 }, points: 1, bonus: 'wind', name: '光と水の融合' },
  { id: 7, tier: 1, cost: { aqua: 1, wind: 1 }, points: 1, bonus: 'fire', name: '水と風の調和' },
  { id: 8, tier: 1, cost: { wind: 1, fire: 1 }, points: 1, bonus: 'dark', name: '風と炎の共鳴' },
  { id: 9, tier: 1, cost: { fire: 1, dark: 1 }, points: 1, bonus: 'light', name: '炎と闇の交差' },
  { id: 10, tier: 1, cost: { dark: 1, light: 1 }, points: 1, bonus: 'aqua', name: '闇と光の統合' },

  // Tier 2 (Middle/中級)
  { id: 11, tier: 2, cost: { light: 2, aqua: 1 }, points: 3, bonus: 'wind', name: '光の波動' },
  { id: 12, tier: 2, cost: { aqua: 2, wind: 1 }, points: 3, bonus: 'fire', name: '水の秘密' },
  { id: 13, tier: 2, cost: { wind: 2, fire: 1 }, points: 3, bonus: 'dark', name: '風の力' },
  { id: 14, tier: 2, cost: { fire: 2, dark: 1 }, points: 3, bonus: 'light', name: '炎の奥義' },
  { id: 15, tier: 2, cost: { dark: 2, light: 1 }, points: 3, bonus: 'aqua', name: '闇の知恵' },
  { id: 16, tier: 2, cost: { light: 2, wind: 1 }, points: 3, bonus: 'fire', name: '光と風の奇跡' },
  { id: 17, tier: 2, cost: { aqua: 2, fire: 1 }, points: 3, bonus: 'dark', name: '水と炎の邂逅' },
  { id: 18, tier: 2, cost: { wind: 2, dark: 1 }, points: 3, bonus: 'light', name: '風と闇の融合' },
  { id: 19, tier: 2, cost: { fire: 2, light: 1 }, points: 3, bonus: 'aqua', name: '炎と光の結合' },
  { id: 20, tier: 2, cost: { dark: 2, aqua: 1 }, points: 3, bonus: 'wind', name: '闇と水の共存' },

  // Tier 3 (Advanced/上級)
  { id: 21, tier: 3, cost: { light: 3, aqua: 2 }, points: 6, bonus: 'wind', name: '至高の光' },
  { id: 22, tier: 3, cost: { aqua: 3, wind: 2 }, points: 6, bonus: 'fire', name: '至高の水' },
  { id: 23, tier: 3, cost: { wind: 3, fire: 2 }, points: 6, bonus: 'dark', name: '至高の風' },
  { id: 24, tier: 3, cost: { fire: 3, dark: 2 }, points: 6, bonus: 'light', name: '至高の炎' },
  { id: 25, tier: 3, cost: { dark: 3, light: 2 }, points: 6, bonus: 'aqua', name: '至高の闇' },
  { id: 26, tier: 3, cost: { light: 3, wind: 2 }, points: 6, bonus: 'fire', name: '至高の創造' },
  { id: 27, tier: 3, cost: { aqua: 3, fire: 2 }, points: 6, bonus: 'dark', name: '至高の変化' },
  { id: 28, tier: 3, cost: { wind: 3, dark: 2 }, points: 6, bonus: 'light', name: '至高の循環' },
  { id: 29, tier: 3, cost: { fire: 3, light: 2 }, points: 6, bonus: 'aqua', name: '至高の輝き' },
  { id: 30, tier: 3, cost: { dark: 3, aqua: 2 }, points: 6, bonus: 'wind', name: '至高の調和' }
];

// Element Icons Configuration
const ELEMENT_ICONS = {
  light: '🕯️',
  aqua: '💧',
  wind: '🌪️',
  fire: '🔥',
  dark: '⚫',
  aether: '⭐'
};

// Game Configuration
const GAME_CONFIG = {
  initialPoolSize: 5,
  targetScore: 15,
  maxReservedCards: 2,
  minPoolToTakePair: 4,
  minDistinctElementsToTake: 3
};
