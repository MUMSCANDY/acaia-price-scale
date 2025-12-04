// MUMS FUTUREPLAY - Pixel-Modern Humor Engine
// Short, smart, slightly cheeky, Gen-Z premium tone

export type PriceTier = 'tiny' | 'nice' | 'hype' | 'legendary';

export const getPriceTier = (price: number): PriceTier => {
  if (price < 200) return 'tiny';
  if (price < 500) return 'nice';
  if (price < 900) return 'hype';
  return 'legendary';
};

export const humorMessages: Record<PriceTier, string[]> = {
  tiny: [
    "Just getting started.",
    "Room for more.",
    "The bucket awaits.",
    "A taste of things to come.",
    "Warm-up round.",
    "Light but promising.",
    "The journey begins.",
    "Appetizer energy.",
  ],
  nice: [
    "Solid choices.",
    "This is becoming something.",
    "Now we're talking.",
    "Main character vibes.",
    "Good taste confirmed.",
    "The plot thickens.",
    "Sweet momentum.",
    "Getting somewhere.",
  ],
  hype: [
    "Elite candy energy.",
    "This mix goes hard.",
    "Peak munch behavior.",
    "Too good to share.",
    "Masterclass in progress.",
    "Big scoop energy.",
    "The flex is real.",
    "Certified premium.",
  ],
  legendary: [
    "A legendary scoop.",
    "Hall of fame material.",
    "Absolutely iconic.",
    "Pure greatness.",
    "This is art.",
    "Maximum achieved.",
    "The ultimate mix.",
    "Respect earned.",
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
    case 'nice': return 'happy';
    case 'hype': return 'excited';
    case 'legendary': return 'heartEyes';
  }
};

// Fill percentage for bucket based on tier
export const getTierFillPercent = (tier: PriceTier): number => {
  switch (tier) {
    case 'tiny': return 25;
    case 'nice': return 50;
    case 'hype': return 80;
    case 'legendary': return 100;
  }
};
