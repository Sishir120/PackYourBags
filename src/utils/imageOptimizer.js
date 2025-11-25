/**
 * Image optimization utilities for PackYourBags
 * 
 * This module provides functions to optimize images according to the professional design requirements:
 * - WebP format with 800px width
 * - < 90kB file size
 * - Lazy loading with decoding="async"
 * - Blur-up 20px placeholder (LQIP)
 * - SVG scrim mask for branded look
 */

// Function to generate SVG scrim mask
export const generateScrimMask = () => {
  return `
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="scrimMask">
          <rect width="100%" height="100%" fill="white"/>
          <path d="M0,600 C200,500 400,550 600,500 C700,480 750,450 800,400 L800,600 Z" fill="black"/>
        </mask>
      </defs>
      <rect width="100%" height="100%" mask="url(#scrimMask)" fill="rgba(0,0,0,0.25)"/>
    </svg>
  `;
};

// Function to generate blur-up placeholder (LQIP)
export const generateLQIP = (imageUrl) => {
  // In a real implementation, this would generate a 20px blurred version
  // For now, we'll return a simple placeholder
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E`;
};

// Function to optimize image for web
export const optimizeImage = (imageUrl, width = 800) => {
  // In a real implementation, this would use a service like Cloudinary or Sharp
  // For now, we'll return the image URL with optimization parameters
  if (imageUrl.includes('unsplash.com')) {
    return `${imageUrl}&w=${width}&q=80&fm=webp`;
  }
  return imageUrl;
};

// Function to create image attributes for optimized loading
export const getImageAttributes = (imageUrl) => {
  return {
    src: optimizeImage(imageUrl),
    loading: 'lazy',
    decoding: 'async',
    placeholder: generateLQIP(imageUrl),
  };
};

export default {
  generateScrimMask,
  generateLQIP,
  optimizeImage,
  getImageAttributes
};