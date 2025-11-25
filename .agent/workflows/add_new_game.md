---
description: How to add a new game to the Arcade
---

# Adding a New Game to the Arcade

Follow these steps to add a new game module to the Arcade page.

## 1. Create the Game Component
Create a new file in `src/components/games/` (e.g., `TriviaGame.jsx`).

```jsx
import React from 'react';

const TriviaGame = () => {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
      <h2 className="text-white text-xl font-bold">Travel Trivia</h2>
      {/* Game logic here */}
    </div>
  );
};

export default TriviaGame;
```

## 2. Export the Game
Ensure the component is exported as default.

## 3. Add to Arcade Page
Open `src/pages/Arcade.jsx`.

1. Import your new game:
   ```jsx
   import TriviaGame from '../components/games/TriviaGame';
   ```

2. Add it to the Grid:
   Find the `Games Grid` section and add your component inside a `motion.div` wrapper.

   ```jsx
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: 0.5 }}
     className="lg:col-span-1" // Adjust span as needed
   >
     <TriviaGame />
   </motion.div>
   ```

## 4. Add Monetization Hooks
To monetize, wrap premium features with a check:

```jsx
if (!isPremium) {
  return <PremiumOverlay />;
}
```

## 5. Test
Run `npm run dev` and navigate to `/arcade` to test your new game.
