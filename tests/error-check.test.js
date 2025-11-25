// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Error Checking', () => {
  test('Check for console errors on homepage', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('Console error:', msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log('Page error:', error.message);
    });

    // Listen for request failures
    page.on('requestfailed', request => {
      console.log('Request failed:', request.url(), request.failure()?.errorText);
    });

    // Navigate to homepage
    await page.goto('http://localhost:3008');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for errors
    expect(errors).toHaveLength(0);
  });

  test('Check for network errors on key pages', async ({ page }) => {
    const failedRequests = [];
    
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        error: request.failure()?.errorText
      });
      console.log('Request failed:', request.url(), request.failure()?.errorText);
    });

    // Test homepage
    await page.goto('http://localhost:3008');
    await page.waitForLoadState('networkidle');

    // Test destinations page
    await page.goto('http://localhost:3007/destinations');
    await page.waitForLoadState('networkidle');

    // Test blog page
    await page.goto('http://localhost:3007/blog');
    await page.waitForLoadState('networkidle');

    // Check for failed requests
    expect(failedRequests).toHaveLength(0);
  });
});