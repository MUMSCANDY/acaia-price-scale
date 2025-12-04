// MUMS Candy Scale - Dynamic Humor Messages by Price Tier

export type PriceTier = 'tiny' | 'nice' | 'hype' | 'legendary';

export const getPriceTier = (price: number): PriceTier => {
  if (price < 200) return 'tiny';
  if (price < 500) return 'nice';
  if (price < 900) return 'hype';
  return 'legendary';
};

export const humorMessages: Record<PriceTier, string[]> = {
  tiny: [
    "A little more joy won't hurt.",
    "Go on… you deserve it.",
    "Tiny treat today? Your future self says add more.",
    "This candy bucket has commitment issues.",
    "Room for one more? Always.",
    "Your bucket looks lonely.",
    "Just the tip of the iceberg.",
    "Starting small? We respect that. But also…",
    "The bucket whispers: more.",
    "Baby steps are still steps.",
  ],
  nice: [
    "Nice mix. Strong choices.",
    "Your candy personality is showing.",
    "This is becoming delicious.",
    "Solid selection incoming.",
    "Now we're talking.",
    "The bucket approves.",
    "Balanced. Refined. Sweet.",
    "You know what you're doing.",
    "A person of taste, clearly.",
    "The perfect afternoon pick.",
  ],
  hype: [
    "Elite candy energy.",
    "This bucket is flexing.",
    "You're building a masterpiece.",
    "Strong game. Very strong.",
    "Main character energy detected.",
    "This mix has ambition.",
    "Legend status: approaching.",
    "The bucket is impressed.",
    "We see greatness forming.",
    "You've unlocked something special.",
  ],
  legendary: [
    "Full candy royalty.",
    "This is not a mix. This is an experience.",
    "Your dentist loves you already.",
    "Respect. This is art.",
    "We bow to you.",
    "Hall of Fame material.",
    "This bucket has never been happier.",
    "Absolute legend. Chef's kiss.",
    "The candy gods smile upon you.",
    "This mix will be remembered.",
  ],
};

export const getRandomMessage = (tier: PriceTier): string => {
  const messages = humorMessages[tier];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Mascot expressions based on tier
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
