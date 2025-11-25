/**
 * Startup script to run verification of PackYourBags Professional UI/UX Implementation
 */

import { verifyImplementation, generateImplementationReport } from './verifyImplementation';

// Run verification when the script is executed
if (typeof window !== 'undefined') {
  // Browser environment
  window.addEventListener('load', async () => {
    try {
      const report = await generateImplementationReport();
      console.log(report);
    } catch (error) {
      console.error('Error running verification:', error);
    }
  });
} else {
  // Node.js environment
  (async () => {
    try {
      const report = await generateImplementationReport();
      console.log(report);
    } catch (error) {
      console.error('Error running verification:', error);
    }
  })();
}