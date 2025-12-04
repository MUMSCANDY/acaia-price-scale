// MUMS FUTUREPLAY - Pixel-Modern Humor Engine
// Short, smart, slightly cheeky, Gen-Z premium tone

export type PriceTier = 'tiny' | 'nice' | 'nicePlus' | 'hype' | 'legendary';

export const getPriceTier = (price: number): PriceTier => {
  if (price < 150) return 'tiny';
  if (price < 250) return 'nice';
  if (price < 500) return 'nicePlus';
  if (price < 900) return 'hype';
  return 'legendary';
};

export const humorMessages: Record<PriceTier, string[]> = {
  tiny: [
    "Just getting warmed up!",
    "A cute little start!",
    "Still room to level up!",
    "Warm-up mix!",
    "Light but promising!",
    "Appetizer mode!",
    "Treat yourself a bit more!",
  ],
  nice: [
    "You're getting warmed up!",
    "Sweet progress!",
    "We're entering candy mode!",
    "Keep it coming!",
    "Room for more!",
  ],
  nicePlus: [
    "Good taste confirmed!",
    "This mix is becoming something!",
    "Sweet momentum unlocked!",
    "You've got the touch!",
  ],
  hype: [
    "Elite candy energy!",
    "This mix goes hard!",
    "Peak munch behavior!",
    "Too good to share!",
    "Masterclass unlocked!",
    "Big scoop energy!",
    "This is a flex!",
    "Certified premium!",
  ],
  legendary: [
    "A legendary scoop!",
    "Hall of fame behavior!",
    "Absolutely iconic!",
    "Pure greatness!",
    "This is art now.",
    "Maxed out!",
    "The ultimate mix!",
    "Respect earned!",
  ],
};

export const getRandomMessage = (tier: PriceTier): string => {
  const messages = humorMessages[tier];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Mascot expressions based on tier (kept for compatibility)
export type MascotExpression = 'sad' | 'neutral' | 'happy' | 'excited' | 'heartEyes';

export const getTierExpression = (tier: PriceTier): MascotExpression => {
  switch (tier) {
    case 'tiny': return 'sad';
    case 'nice': return 'neutral';
    case 'nicePlus': return 'happy';
    case 'hype': return 'excited';
    case 'legendary': return 'heartEyes';
  }
};

// Fill percentage for bucket based on tier
export const getTierFillPercent = (tier: PriceTier): number => {
  switch (tier) {
    case 'tiny': return 20;
    case 'nice': return 40;
    case 'nicePlus': return 60;
    case 'hype': return 80;
    case 'legendary': return 100;
  }
};
