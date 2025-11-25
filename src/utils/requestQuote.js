import { API_BASE_URL } from '../config';
import { fetchAPI } from './api';

/**
 * Request a travel quote for a specific destination
 * @param {Object} quoteData - The quote request data
 * @param {string} quoteData.destination - The destination name
 * @param {string} quoteData.destinationId - The destination ID
 * @param {string} quoteData.travelDates - The requested travel dates
 * @param {number} quoteData.numberOfTravelers - Number of travelers
 * @param {string} quoteData.email - User's email address
 * @returns {Promise<Object>} The API response
 */
export async function requestQuote(quoteData) {
  // Validate input data
  if (!quoteData.destination || !quoteData.destinationId || !quoteData.travelDates || !quoteData.email) {
    throw new Error('Missing required fields for quote request');
  }

  if (quoteData.numberOfTravelers < 1) {
    throw new Error('Number of travelers must be at least 1');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(quoteData.email)) {
    throw new Error('Invalid email address');
  }

  try {
    // Make actual API call to request quote
    const response = await fetchAPI('/request-quote', {
      method: 'POST',
      body: JSON.stringify(quoteData)
    });
    
    return response;
  } catch (error) {
    console.error('Error requesting quote:', error);
    throw new Error('Failed to submit quote request. Please try again later.');
  }
}

/**
 * Alternative implementation using fetchAPI utility
 * This is the same as the main function but kept for compatibility
 */
export async function requestQuoteAPI(quoteData) {
  return await requestQuote(quoteData);
}