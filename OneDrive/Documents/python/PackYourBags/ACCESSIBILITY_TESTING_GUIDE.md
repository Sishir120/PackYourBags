# Accessibility Testing Guide for PackYourBags

## Keyboard Navigation Testing

### Header Navigation
1. Press Tab to move focus to the first interactive element
2. Verify focus moves through all header elements in logical order:
   - Logo/Home button
   - Navigation buttons (Destinations, Discover, Deals, Blog, AI Assistant)
   - Theme toggle
   - Favorites button
   - User menu/Sign in button
   - Mobile menu toggle (on mobile view)
3. Press Enter on each focused element to verify functionality
4. Use Shift+Tab to navigate backwards and verify reverse tab order

### Hero Section
1. Tab to search input field
2. Verify focus indicator is clearly visible
3. Type text and verify it's readable
4. Tab to search button and press Enter
5. Tab to "Spin to Discover" and "Find Travel Deals" buttons
6. Press Enter on each to verify functionality

### Roulette Section
1. Tab to location filter dropdown
2. Press Enter to open dropdown
3. Use arrow keys to navigate options
4. Press Enter to select an option
5. Tab to activity filter dropdown and repeat
6. Tab to spin button and press Enter
7. After spin, tab to "View Details" and "Spin Again" buttons

### Destination Cards
1. Navigate to Destinations page
2. Tab through destination cards
3. Verify focus moves to:
   - Favorite button
   - Share button
   - Navigation arrows (if multiple images)
   - Pin button
   - "View AI Itinerary & Book" button
4. Press Enter on each focused element

### Newsletter Section
1. Tab to email input field
2. Verify focus indicator visibility
3. Tab to subscribe button
4. Press Enter to submit

### Footer
1. Tab through all footer links
2. Verify focus order is logical
3. Press Enter on each link to verify navigation

## Screen Reader Testing

### NVDA (Windows) / VoiceOver (Mac)
1. Enable screen reader
2. Navigate through all interactive elements
3. Verify each element has appropriate:
   - Role (button, link, input, etc.)
   - Name/label
   - State (pressed, expanded, etc.)
4. Test dynamic content updates (spin results, loading states)

### ARIA Labels and Roles
1. Verify all interactive elements have appropriate ARIA attributes:
   - `aria-label` for icon-only buttons
   - `aria-expanded` for dropdowns
   - `aria-disabled` for disabled elements
   - `aria-live` for dynamic content

## Color Contrast Testing

### WCAG AA Compliance (4.5:1 minimum)
1. Test all interactive element text against backgrounds:
   - Header navigation buttons
   - Hero section buttons
   - Form inputs and labels
   - Card content
   - Footer links

### Tools for Testing
- WebAIM Contrast Checker
- axe DevTools
- WAVE Evaluation Tool

## Focus States

### Visible Focus Indicators
1. Verify all interactive elements show clear focus indicators:
   - Buttons: Outline or background change
   - Links: Underline or color change
   - Form inputs: Border change
   - Dropdowns: Visual indication of focus

### Focus Management
1. Modal dialogs:
   - Focus moves to modal when opened
   - Focus trapped within modal
   - Focus returns to triggering element when closed
2. Dropdowns:
   - Focus moves to first item when opened
   - Focus returns to trigger when closed

## Loading States

### Spinner/Progress Indicators
1. Verify loading states for:
   - AI chat responses
   - Search results
   - Image loading
   - Form submissions

### Loading Accessibility
1. Screen readers should announce loading state
2. Loading indicators should be visible and understandable
3. Cancel options should be available when appropriate

## Toast Notifications

### Notification Accessibility
1. Toast notifications should be announced by screen readers
2. Toast should be dismissible via keyboard
3. Toast should not interrupt important user actions
4. Multiple toasts should be manageable

## RTL (Right-to-Left) Support

### Layout Testing
1. Set browser language to RTL language (Arabic, Hebrew)
2. Verify all interactive elements:
   - Maintain proper spacing
   - Text alignment is correct
   - Icons remain in appropriate positions
   - Focus indicators are properly positioned

### Form Inputs
1. Text direction in input fields
2. Label positioning
3. Button alignment

## Mobile Testing

### Touch Target Sizes
1. Verify all interactive elements meet minimum 44x44px size:
   - Header buttons
   - Form inputs
   - Cards
   - Navigation elements

### Mobile-Specific Interactions
1. Touch actions:
   - Tap
   - Double tap
   - Long press (if applicable)
2. Gestures:
   - Swipe (carousel navigation)
   - Pinch to zoom (if applicable)

## Testing Checklist

### Desktop
- [ ] Keyboard navigation through all elements
- [ ] Screen reader compatibility
- [ ] Color contrast compliance
- [ ] Focus state visibility
- [ ] Loading state announcements
- [ ] Toast notification accessibility
- [ ] RTL layout support

### Mobile
- [ ] Touch target sizes (44x44px minimum)
- [ ] Screen reader on mobile
- [ ] Focus management on mobile
- [ ] Orientation changes (portrait/landscape)

### Tablet
- [ ] All desktop tests
- [ ] Touch interaction
- [ ] Hybrid keyboard/touch usage

## Common Issues to Watch For

1. Missing focus indicators
2. Insufficient color contrast
3. Inaccessible modal dialogs
4. Missing ARIA labels
5. Poor touch target sizes
6. Inadequate loading state communication
7. RTL layout breaking
8. Dynamic content not announced to screen readers

## Testing Tools

### Browser Extensions
- axe DevTools
- WAVE Evaluation Tool
- Accessibility Insights for Web

### Screen Readers
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (Mac)
- TalkBack (Android)
- VoiceOver (iOS)

### Color Contrast Checkers
- WebAIM Contrast Checker
- Colour Contrast Analyser
- Accessibility Insights contrast checker

## Reporting Issues

### Issue Template
1. Element affected
2. Type of accessibility issue
3. Severity (Low/Medium/High/Critical)
4. Steps to reproduce
5. Expected behavior
6. Actual behavior
7. Screenshots/videos if applicable
8. Environment (browser, screen reader, OS)