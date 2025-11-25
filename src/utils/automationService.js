import { API_BASE_URL } from '../config';
import { fetchAPI } from './helpers';

/**
 * Start the automation service for booking
 * @param {Object} automationData - The automation request data
 * @param {string} automationData.destination - The destination name
 * @param {string} automationData.destinationId - The destination ID
 * @param {string} automationData.travelDates - The requested travel dates
 * @param {number} automationData.numberOfTravelers - Number of travelers
 * @param {string} automationData.email - User's email address
 * @returns {Promise<Object>} The API response
 */
export async function startAutomationService(automationData) {
  // Validate input data
  if (!automationData.destination || !automationData.destinationId || !automationData.travelDates || !automationData.email) {
    throw new Error('Missing required fields for automation service');
  }

  if (automationData.numberOfTravelers < 1) {
    throw new Error('Number of travelers must be at least 1');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(automationData.email)) {
    throw new Error('Invalid email address');
  }

  try {
    // Make actual API call to start automation service
    const response = await fetchAPI('/start-automation', {
      method: 'POST',
      body: JSON.stringify(automationData)
    });

    return response;
  } catch (error) {
    console.error('Error starting automation service:', error);
    throw new Error('Failed to start automation service. Please try again later.');
  }
}

/**
 * Alternative implementation using fetchAPI utility
 * This is the same as the main function but kept for compatibility
 */
export async function startAutomationAPI(automationData) {
  return await startAutomationService(automationData);
}