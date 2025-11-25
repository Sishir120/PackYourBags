/**
 * Brand voice consistency utilities for PackYourBags
 * 
 * This module provides functions to ensure brand voice consistency according to the professional design requirements:
 * - Swap every "Al" typo to "AI"
 * - Replace Latin filler ("lorem ipsum") with on-brand helper text
 */

// Function to correct common typos
export const correctTypos = (text) => {
  if (!text) return text;
  
  return text
    // Replace common "Al" typos with "AI"
    .replace(/\bAl\b/g, 'AI')
    .replace(/\bAL\b/g, 'AI')
    .replace(/\bal\b/g, 'AI')
    // Fix common capitalization issues
    .replace(/\b(Ai|ai)\b/g, 'AI');
};

// Function to replace lorem ipsum with branded placeholder text
export const replaceLoremIpsum = (text) => {
  if (!text) return text;
  
  const brandedPlaceholders = [
    "Discover your next dream destination with our AI-powered travel companion.",
    "Let our intelligent travel assistant craft the perfect itinerary for your unique adventure.",
    "Experience the world like never before with personalized travel recommendations.",
    "No destinations yet – spin the wheel and we'll build your first itinerary.",
    "Your journey begins with a single spin. Let destiny choose your next adventure!",
    "Explore unique experiences around the world with personalized AI recommendations.",
    "Join thousands of happy travelers who discovered their perfect destinations with PackYourBags.",
    "From hidden gems to iconic landmarks, we'll help you find the experiences that matter most."
  ];
  
  // Replace common lorem ipsum variations
  const loremPatterns = [
    /lorem ipsum dolor sit amet/gi,
    /lorem ipsum/gi,
    /ipsum dolor/gi,
    /dolor sit amet/gi
  ];
  
  let result = text;
  loremPatterns.forEach(pattern => {
    result = result.replace(pattern, () => {
      const randomIndex = Math.floor(Math.random() * brandedPlaceholders.length);
      return brandedPlaceholders[randomIndex];
    });
  });
  
  return result;
};

// Function to ensure consistent brand voice
export const ensureBrandVoice = (text) => {
  if (!text) return text;
  
  return replaceLoremIpsum(correctTypos(text));
};

// Function to check for brand voice violations
export const checkBrandVoiceViolations = (text) => {
  const violations = [];
  
  if (!text) return violations;
  
  // Check for "Al" typos
  const alTypos = text.match(/\b(Al|AL|al)\b/g);
  if (alTypos) {
    violations.push({
      type: 'typo',
      message: 'Found potential "Al" typos that should be "AI"',
      matches: alTypos
    });
  }
  
  // Check for lorem ipsum
  const loremMatches = text.match(/lorem ipsum|ipsum dolor/gi);
  if (loremMatches) {
    violations.push({
      type: 'placeholder',
      message: 'Found lorem ipsum placeholder text',
      matches: loremMatches
    });
  }
  
  return violations;
};

export default {
  correctTypos,
  replaceLoremIpsum,
  ensureBrandVoice,
  checkBrandVoiceViolations
};