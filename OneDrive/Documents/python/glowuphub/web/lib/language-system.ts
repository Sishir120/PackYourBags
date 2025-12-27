/**
 * GlowUp Hub Anti-Insecurity Language System
 * 
 * This module ensures all user-facing copy uses supportive, 
 * nervous-system-safe language that builds confidence rather than shame.
 */

// Words that should NEVER appear in user-facing content
export const BANNED_WORDS = [
    'fix',
    'flaw',
    'flawed',
    'perfect',
    'perfection',
    'defect',
    'problem',
    'issue',
    'wrong',
    'ugly',
    'bad',
    'broken',
    'damaged',
    'failure',
    'failed',
    'lacking',
    'lacking',
    'imperfect',
    'correct',
    'correction'
] as const;

// Affirming replacements for common negative patterns
export const AFFIRMING_REPLACEMENTS: Record<string, string> = {
    'fix': 'support',
    'flaw': 'unique quality',
    'perfect': 'balanced',
    'defect': 'area of focus',
    'problem': 'opportunity',
    'issue': 'area of attention',
    'wrong': 'different',
    'broken': 'evolving',
    'failure': 'learning moment',
    'correct': 'align',
};

// Identity reinforcement phrases used throughout the app
export const IDENTITY_PHRASES = [
    "I keep promises to myself.",
    "My consistency is my confidence.",
    "Small routines, lasting radiance.",
    "I honor my body with gentle care.",
    "Every day I choose myself.",
    "My glow comes from within.",
    "I am worthy of this time.",
    "Self-care is self-respect.",
    "I trust my journey.",
    "Beauty is self-trust made visible.",
] as const;

// Compassionate recovery messages for missed days
export const RECOVERY_MESSAGES = [
    "Rest is part of the practice. Your practice is always here when you return.",
    "Life flows differently some days. Pick up where you left off, with grace.",
    "Missing a day doesn't break your journey. It's just a pause in the rhythm.",
    "Your body knew what it needed. Now, gently return when ready.",
    "Every moment is a fresh start. Welcome back.",
] as const;

// Streak messaging - reframed as "Promises Kept"
export const STREAK_LABELS = {
    singular: "Promise Kept",
    plural: "Promises Kept",
    description: "Days you showed up for yourself through consistency",
} as const;

// Completion celebration messages
export const COMPLETION_MESSAGES = [
    "Promise kept. You showed up for yourself today. ✨",
    "Daily routine complete. Your glow is building. 🌸",
    "Another day of honoring yourself. Beautiful. 💫",
    "You kept your word to yourself. That's powerful. 🌿",
    "Complete. Your consistency is your confidence. 🌙",
] as const;

// Category descriptions with supportive framing
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    FaceBalance: "Gentle practices for facial harmony and lymphatic flow",
    Movement: "Posture-opening and strength that builds presence",
    SkinPractice: "Consistent care practices for natural radiance",
    Nourishment: "Hydration and anti-bloat support for inner glow",
    Mindfulness: "Breath and reflection for nervous system calm",
};

// Helper function to validate text against banned words
export function containsBannedWords(text: string): boolean {
    const lowerText = text.toLowerCase();
    return BANNED_WORDS.some(word => lowerText.includes(word));
}

// Helper function to get a random identity phrase
export function getRandomIdentityPhrase(): string {
    return IDENTITY_PHRASES[Math.floor(Math.random() * IDENTITY_PHRASES.length)];
}

// Helper function to get a random recovery message
export function getRandomRecoveryMessage(): string {
    return RECOVERY_MESSAGES[Math.floor(Math.random() * RECOVERY_MESSAGES.length)];
}

// Helper function to get a random completion message
export function getRandomCompletionMessage(): string {
    return COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];
}
