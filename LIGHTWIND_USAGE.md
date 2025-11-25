# Lightswind Components Integration Guide

This document explains how to use Lightswind components in the PackYourBags application.

## Installation

Lightswind has already been installed in the project:

```bash
npm install lightswind
```

## Available Components

Lightswind provides the following components that can be used in the PackYourBags application:

1. **Button** - For actions and navigation
2. **Card** - For content containers
3. **Input** - For text inputs
4. **Select** - For dropdown selections
5. **TextArea** - For multi-line text inputs
6. **Badge** - For tags and status indicators
7. **Alert** - For notifications and messages

## Usage Examples

### Basic Import

```jsx
import { Button } from '@/components/lightswind/button';
import { Card } from '@/components/lightswind/card';
import { Input } from '@/components/lightswind/input';
import { Badge } from '@/components/lightswind/badge';
import { Alert } from '@/components/lightswind/alert';
```

### Button Examples

```jsx
// Primary button
<Button variant="primary">Book Now</Button>

// Secondary button
<Button variant="secondary">Learn More</Button>

// Outline button
<Button variant="outline">Cancel</Button>

// Ghost button
<Button variant="ghost">Close</Button>
```

### Card Example

```jsx
<Card className="p-6">
  <h2 className="text-xl font-semibold mb-4">Card Title</h2>
  <p className="text-gray-700">Card content goes here.</p>
</Card>
```

### Input Example

```jsx
<Input 
  placeholder="Enter your destination" 
  value={value}
  onChange={handleChange}
/>
```

### Badge Example

```jsx
<Badge variant="primary">Popular</Badge>
<Badge variant="success">Best Deal</Badge>
<Badge variant="warning">Limited Time</Badge>
```

### Alert Example

```jsx
<Alert>
  <Alert.Title>Success!</Alert.Title>
  <Alert.Description>Your booking was confirmed.</Alert.Description>
</Alert>
```

## Customization

All Lightswind components can be customized using Tailwind CSS classes. The components will automatically inherit your Tailwind configuration, including colors, spacing, and typography.

## Integration with PackYourBags

The following components have been created to demonstrate Lightswind integration:

1. `LightswindDemo.jsx` - Shows all available components
2. `LightswindDestinationCard.jsx` - A travel-specific destination card
3. `LightswindTravelForm.jsx` - A complete travel planning form

### Routes

The following routes have been added to showcase Lightswind components:

- `/lightswind-demo` - General component showcase
- `/lightswind-form` - Travel planning form example

### Navigation

Links to these demos have been added to both desktop and mobile navigation menus.

## Best Practices

1. **Consistency**: Use the same variant styles throughout the application
2. **Accessibility**: All Lightswind components are accessible by default
3. **Responsive Design**: Use responsive classes to ensure components work on all devices
4. **Performance**: Lightswind components are lightweight and optimized for performance

## Getting Started

To see Lightswind components in action:

1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000/lightswind-demo
3. Explore the components and examples

For implementation in your own components, simply import the required components from 'lightswind' and use them as shown in the examples above.