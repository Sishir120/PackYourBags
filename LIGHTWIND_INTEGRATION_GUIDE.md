# Lightswind Integration Guide for PackYourBags

This guide explains how Lightswind components have been integrated into the PackYourBags project and how to use them.

## Installation and Setup

Lightswind has been installed and configured in the project with the following steps:

1. Installed the lightswind package: `npm install lightswind`
2. Initialized components using the CLI: `npx create-lightswind`
3. Added lightswind.css to the main.jsx file (`import './components/lightswind.css'`)

## Component Structure

Lightswind components are now available in the project at:
```
src/components/lightswind/
```

Each component is in its own file (e.g., button.tsx, card.tsx, input.tsx).

## How to Use Lightswind Components

### Importing Components

To use Lightswind components, import them using the following pattern:

```jsx
import { Button } from '@/components/lightswind/button';
import { Card } from '@/components/lightswind/card';
import { Input } from '@/components/lightswind/input';
import { Badge } from '@/components/lightswind/badge';
import { Alert } from '@/components/lightswind/alert';
```

### Using Components

Once imported, you can use the components in your JSX:

```jsx
<Button variant="primary">Click me</Button>

<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

<Input placeholder="Enter text" />
```

## Available Components

The following Lightswind components are available in the project:

- Button
- Card
- Input
- Badge
- Alert
- Select
- Textarea
- And many more (100+ components total)

## Examples

### Demo Pages

Two demo pages have been created to showcase Lightswind components:

1. **Lightswind Demo** - `/lightswind-demo`
   - Shows various Lightswind components
   - Includes examples of buttons, cards, inputs, badges, and alerts

2. **Travel Form** - `/lightswind-form`
   - A complete travel planning form using Lightswind components
   - Demonstrates form elements and layout

### Navigation

Links to these demo pages have been added to both desktop and mobile navigation menus:
- "Lightswind Demo" link
- "Travel Form" link

## Customization

Lightswind components automatically inherit your Tailwind CSS configuration, including:
- Colors
- Spacing
- Typography
- And other design tokens

You can customize components by passing additional Tailwind classes:

```jsx
<Button className="px-8 py-4 text-lg">Large Button</Button>
<Card className="shadow-xl rounded-2xl">Custom Card</Card>
```

## Best Practices

1. **Consistent Imports**: Always use the full path import pattern for consistency
2. **Component Variants**: Use appropriate variants (primary, secondary, outline, etc.) for visual hierarchy
3. **Accessibility**: Lightswind components are built with accessibility in mind
4. **Responsive Design**: Use responsive classes to ensure components work on all devices

## Adding New Components

To add new Lightswind components to your project:

1. Use the CLI tool to install specific components:
   ```bash
   npx create-lightswind [component-name]
   ```

2. Or, the component will already be available in the `src/components/lightswind/` directory

## Troubleshooting

If you encounter issues:

1. Ensure you're using the correct import paths
2. Check that lightswind.css is imported in main.jsx
3. Verify that Tailwind CSS is properly configured
4. Restart the development server if changes aren't reflected

## Additional Resources

- [Lightswind Documentation](https://lightswind.com)
- [Component Examples](https://lightswind.com/components)