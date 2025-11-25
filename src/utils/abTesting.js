/**
 * A/B Testing utilities for PackYourBags
 * 
 * This module provides functions to implement A/B testing according to the professional design requirements:
 * - A/B test old vs. new hero for 1 week
 * - Expect +18% CTA click-through
 */

// Function to get a random variant for A/B testing
export const getABTestVariant = (testName, variants = ['A', 'B']) => {
  // Check if user already has a variant assigned
  const storedVariant = localStorage.getItem(`ab_test_${testName}`);
  if (storedVariant && variants.includes(storedVariant)) {
    return storedVariant;
  }
  
  // Assign a new variant randomly
  const randomIndex = Math.floor(Math.random() * variants.length);
  const variant = variants[randomIndex];
  
  // Store the variant for consistency
  localStorage.setItem(`ab_test_${testName}`, variant);
  
  // Store assignment time for expiration
  localStorage.setItem(`ab_test_${testName}_assigned`, Date.now());
  
  return variant;
};

// Function to check if A/B test has expired (1 week = 604800000 ms)
export const isABTestExpired = (testName) => {
  const assignedTime = localStorage.getItem(`ab_test_${testName}_assigned`);
  if (!assignedTime) return true;
  
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return (Date.now() - parseInt(assignedTime)) > oneWeek;
};

// Function to reset A/B test assignment
export const resetABTest = (testName) => {
  localStorage.removeItem(`ab_test_${testName}`);
  localStorage.removeItem(`ab_test_${testName}_assigned`);
};

// Function to track A/B test events
export const trackABTestEvent = (testName, variant, eventName, value = 1) => {
  // In a real implementation, this would send data to analytics
  console.log(`AB Test Event: ${testName} - Variant ${variant} - ${eventName}: ${value}`);
  
  // Store event data in localStorage for later analysis
  const eventData = JSON.parse(localStorage.getItem(`ab_test_${testName}_events`) || '{}');
  if (!eventData[variant]) {
    eventData[variant] = {};
  }
  if (!eventData[variant][eventName]) {
    eventData[variant][eventName] = 0;
  }
  eventData[variant][eventName] += value;
  
  localStorage.setItem(`ab_test_${testName}_events`, JSON.stringify(eventData));
};

// Function to get A/B test results
export const getABTestResults = (testName) => {
  const eventData = JSON.parse(localStorage.getItem(`ab_test_${testName}_events`) || '{}');
  return eventData;
};

// Function to calculate conversion rate
export const calculateConversionRate = (testName, variant, conversionEvent, totalEvent) => {
  const results = getABTestResults(testName);
  if (!results[variant]) return 0;
  
  const conversions = results[variant][conversionEvent] || 0;
  const total = results[variant][totalEvent] || 1; // Avoid division by zero
  
  return (conversions / total) * 100;
};

export default {
  getABTestVariant,
  isABTestExpired,
  resetABTest,
  trackABTestEvent,
  getABTestResults,
  calculateConversionRate
};