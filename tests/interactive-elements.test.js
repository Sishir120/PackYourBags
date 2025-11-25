// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Interactive Elements Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3007');
  });

  // Header Tests
  test('Header navigation elements', async ({ page }) => {
    // Logo button
    const logoButton = page.locator('button:has-text("PackYourBags")');
    await expect(logoButton).toBeVisible();
    await logoButton.click();
    // Add assertions for navigation behavior

    // Destinations button
    const destinationsButton = page.getByRole('button', { name: 'Destinations' });
    await expect(destinationsButton).toBeVisible();
    await destinationsButton.click();
    await expect(page).toHaveURL(/.*destinations/);

    // Reset to home for next tests
    await page.goto('http://localhost:3007');

    // Discover button
    const discoverButton = page.getByRole('button', { name: 'Discover' });
    await expect(discoverButton).toBeVisible();
    await discoverButton.click();
    // Should scroll to roulette section

    // Reset to home for next tests
    await page.goto('http://localhost:3007');

    // Deals button
    const dealsButton = page.getByRole('button', { name: 'Deals' });
    await expect(dealsButton).toBeVisible();
    await dealsButton.click();
    await expect(page).toHaveURL(/.*price-tracker/);

    // Reset to home for next tests
    await page.goto('http://localhost:3007');

    // Blog button
    const blogButton = page.getByRole('button', { name: 'Blog' });
    await expect(blogButton).toBeVisible();
    await blogButton.click();
    await expect(page).toHaveURL(/.*blog/);

    // Reset to home for next tests
    await page.goto('http://localhost:3007');

    // AI Assistant button
    const aiAssistantButton = page.getByRole('button', { name: 'AI Assistant' });
    await expect(aiAssistantButton).toBeVisible();
    await aiAssistantButton.click();
    // Should open AI chat modal

    // Theme toggle
    const themeToggle = page.locator('button[aria-label="Modern travel theme"]');
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    // Verify theme change

    // Favorites button
    const favoritesButton = page.locator('button[aria-label="Favorites"]');
    await expect(favoritesButton).toBeVisible();
    await favoritesButton.click();
    // Should either navigate to favorites or open sign-in modal

    // User menu (if logged in)
    // Sign in button (if not logged in)
    const signInButton = page.getByRole('button', { name: 'Save My Plan' });
    await expect(signInButton).toBeVisible();
    // Mobile menu toggle
    const mobileMenuButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await expect(mobileMenuButton).toBeVisible();
  });

  // Hero Section Tests
  test('Hero section interactive elements', async ({ page }) => {
    // Search input
    const searchInput = page.locator('input[placeholder*="e.g. \'cheap beaches in January\'"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Tokyo');
    await expect(searchInput).toHaveValue('Tokyo');

    // Search button
    const searchButton = page.getByRole('button', { name: 'Search' });
    await expect(searchButton).toBeVisible();
    await searchButton.click();
    await expect(page).toHaveURL(/.*destinations/);

    // Reset to home
    await page.goto('http://localhost:3007');

    // Spin to Discover button
    const spinButton = page.getByRole('button', { name: 'Spin to Discover' });
    await expect(spinButton).toBeVisible();
    // Find the roulette section first
    const rouletteSection = page.locator('#roulette');
    if (await rouletteSection.isVisible()) {
      await spinButton.click();
      // Verify spin animation starts
    }

    // Find Travel Deals button
    const dealsButton = page.getByRole('button', { name: 'Find Travel Deals' });
    await expect(dealsButton).toBeVisible();
    await dealsButton.click();
    await expect(page).toHaveURL(/.*price-tracker/);
  });

  // Roulette Section Tests
  test('Roulette section interactive elements', async ({ page }) => {
    // Navigate to roulette section
    await page.goto('http://localhost:3007');
    const rouletteSection = page.locator('#roulette');
    
    if (await rouletteSection.isVisible()) {
      // Location filter dropdown
      const locationFilter = page.locator('button:has-text("All Destinations")');
      await expect(locationFilter).toBeVisible();
      await locationFilter.click();
      // Verify dropdown opens

      // Activity filter dropdown
      const activityFilter = page.locator('button:has-text("Any Activity")');
      await expect(activityFilter).toBeVisible();
      await activityFilter.click();
      // Verify dropdown opens

      // Spin button
      const spinButton = page.getByRole('button', { name: 'SPIN NOW' });
      await expect(spinButton).toBeVisible();
      await spinButton.click();
      // Verify spin animation starts

      // After spin, check for result buttons
      // View Details button
      // Spin Again button
    }
  });

  // Destination Card Tests
  test('Destination card interactive elements', async ({ page }) => {
    await page.goto('http://localhost:3007/destinations');
    
    // Get first destination card
    const firstCard = page.locator('.group').first();
    await expect(firstCard).toBeVisible();

    // Favorite button
    const favoriteButton = firstCard.locator('button[aria-label="Favorite"]');
    if (await favoriteButton.isVisible()) {
      await favoriteButton.click();
      // Verify favorite state changes
    }

    // Share button
    const shareButton = firstCard.locator('button[aria-label="Share"]');
    if (await shareButton.isVisible()) {
      await shareButton.click();
      // Verify share functionality
    }

    // Pin button
    const pinButton = firstCard.locator('button[aria-label="Pin destination"]');
    if (await pinButton.isVisible()) {
      await pinButton.click();
      // Verify pin functionality
    }

    // View AI Itinerary button
    const viewButton = firstCard.getByRole('link', { name: 'View AI Itinerary' });
    if (await viewButton.isVisible()) {
      await viewButton.click();
      // Verify navigation to itinerary page
    }
  });

  // Newsletter Tests
  test('Newsletter interactive elements', async ({ page }) => {
    // Scroll to newsletter section
    await page.goto('http://localhost:3007');
    const newsletterSection = page.locator('section#subscribe');
    if (await newsletterSection.isVisible()) {
      await newsletterSection.scrollIntoViewIfNeeded();

      // Email input
      const emailInput = page.locator('input[placeholder="Enter your email"]');
      await expect(emailInput).toBeVisible();
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');

      // Subscribe button
      const subscribeButton = page.getByRole('button', { name: 'Get My Free Guide' });
      await expect(subscribeButton).toBeVisible();
      await subscribeButton.click();
      // Verify subscription success message
    }
  });

  // Footer Tests
  test('Footer interactive elements', async ({ page }) => {
    // Scroll to footer
    await page.goto('http://localhost:3007');
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    // About Us link
    const aboutLink = page.getByRole('link', { name: 'About Us' });
    await expect(aboutLink).toBeVisible();
    // Similar tests for other footer links...

    // Privacy Policy link
    const privacyLink = page.getByRole('link', { name: 'Privacy Policy' });
    await expect(privacyLink).toBeVisible();
    await privacyLink.click();
    await expect(page).toHaveURL(/.*privacy/);

    // Reset to home
    await page.goto('http://localhost:3007');
    await footer.scrollIntoViewIfNeeded();

    // Terms of Service link
    const termsLink = page.getByRole('link', { name: 'Terms of Service' });
    await expect(termsLink).toBeVisible();
    await termsLink.click();
    await expect(page).toHaveURL(/.*terms/);
  });

  // Auth Modal Tests
  test('Authentication modal interactive elements', async ({ page }) => {
    await page.goto('http://localhost:3007');
    
    // Open auth modal
    const signInButton = page.getByRole('button', { name: 'Save My Plan' });
    await signInButton.click();
    
    // Email input
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('test@example.com');
    
    // Password input
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('password123');
    
    // Submit button
    const submitButton = page.getByRole('button', { name: 'Sign In' });
    await expect(submitButton).toBeVisible();
    // Don't actually submit to avoid test complexity
    
    // Switch mode button
    const switchButton = page.getByRole('button', { name: /Don't have an account/ });
    await expect(switchButton).toBeVisible();
    await switchButton.click();
    // Verify switch to signup form
    
    // Name input (signup form)
    const nameInput = page.locator('input[name="name"]');
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
    }
    
    // Close modal
    const closeButton = page.locator('button[aria-label="Close"]');
    await closeButton.click();
  });

  // AI Chat Modal Tests
  test('AI Chat modal interactive elements', async ({ page }) => {
    await page.goto('http://localhost:3007');
    
    // Open AI chat
    const aiButton = page.getByRole('button', { name: 'AI Assistant' });
    await aiButton.click();
    
    // Chat input
    const chatInput = page.locator('textarea[placeholder*="Ask me anything"]');
    await expect(chatInput).toBeVisible();
    await chatInput.fill('What are the best destinations for beaches?');
    
    // Send button
    const sendButton = page.getByRole('button', { name: 'Send' });
    await expect(sendButton).toBeVisible();
    // Don't actually send to avoid API calls in tests
    
    // Close modal
    const closeButton = page.locator('button[aria-label="Close"]').first();
    await closeButton.click();
  });

  // Keyboard Navigation Tests
  test('Keyboard navigation accessibility', async ({ page }) => {
    await page.goto('http://localhost:3007');
    
    // Test tab navigation through header elements
    await page.keyboard.press('Tab');
    // Verify focus moves to first interactive element
    
    // Test enter key on buttons
    const firstButton = page.getByRole('button').first();
    await firstButton.focus();
    await expect(firstButton).toBeFocused();
  });

  // Focus State Tests
  test('Focus states for interactive elements', async ({ page }) => {
    await page.goto('http://localhost:3007');
    
    // Check focus state for buttons
    const button = page.getByRole('button').first();
    await button.focus();
    await expect(button).toHaveCSS('outline', /2px solid/);
  });

  // Color Contrast Tests
  test('Color contrast for interactive elements', async ({ page }) => {
    await page.goto('http://localhost:3007');
    
    // Check color contrast for primary buttons
    const primaryButton = page.locator('.btn-primary').first();
    await expect(primaryButton).toBeVisible();
    // Actual contrast testing would require specialized tools
  });
});