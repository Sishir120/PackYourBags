# 🗄️ Backend Integration Guide - Supabase + Stripe

## Overview
This guide shows how to migrate your app from **mock data** to a **real database** (Supabase) and add **payment processing** (Stripe).

---

## Part 1: Supabase Setup (FREE Database)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create a new project:
   - **Name:** PackYourBags
   - **Database Password:** (save this!)
   - **Region:** Choose closest to your users

### Step 2: Create Database Tables

Go to **SQL Editor** in Supabase and run:

```sql
-- Destinations Table
CREATE TABLE destinations (
  id SERIAL PRIMARY KEY,
  destination_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  continent VARCHAR(50),
  image_url TEXT,
  description TEXT,
  quick_fact TEXT,
  highlights TEXT[],
  local_tips TEXT[],
  best_season VARCHAR(255),
  budget_tier VARCHAR(50),
  price_range JSONB,
  rating DECIMAL(2,1),
  review_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users Table (for authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Favorites Table
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  destination_id VARCHAR(50) REFERENCES destinations(destination_id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, destination_id)
);

-- Enable Row Level Security
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Allow public read for destinations
CREATE POLICY "Public destinations"
  ON destinations FOR SELECT
  USING (true);

-- Users can manage their own favorites
CREATE POLICY "Own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);
```

### Step 3: Import Your Data

1. Open `src/data/mockDestinations.js`
2. Copy the destinations array
3. In Supabase, go to **Table Editor** → destinations
4. Click **Insert** → **Insert row** and paste data

Or use this migration script:
```javascript
// scripts/migrateToSupabase.js
import { createClient } from '@supabase/supabase-js'
import mockDestinations from '../src/data/mockDestinations.js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_SERVICE_KEY'
)

async function migrate() {
  for (const dest of mockDestinations) {
    const { error } = await supabase
      .from('destinations')
      .insert(dest)
    
    if (error) console.error('Error:', error)
    else console.log('Migrated:', dest.name)
  }
}

migrate()
```

### Step 4: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public** key
   - **service_role** key (keep secret!)

### Step 5: Install Supabase Client

```bash
cd c:\Users\sishi\OneDrive\Documents\python\PackYourBags\frontend_temp
npm install @supabase/supabase-js
```

### Step 6: Configure Environment Variables

Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Add to Vercel:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the same variables

### Step 7: Update API Code

Replace `src/utils/api.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const destinationApi = {
  getDestinations: async (params = {}) => {
    let query = supabase.from('destinations').select('*')
    
    if (params.limit) query = query.limit(params.limit)
    if (params.continent) query = query.eq('continent', params.continent)
    if (params.budget_tier) query = query.eq('budget_tier', params.budget_tier)
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching destinations:', error)
      return { success: false, destinations: [] }
    }
    
    return { success: true, destinations: data }
  },
  
  getDestinationDetails: async (id) => {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('destination_id', id)
      .single()
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true, destination: data }
  }
}
```

---

## Part 2: Stripe Payment Integration

### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up (it's free)
3. Enable **Test Mode** (toggle in top-right)

### Step 2: Get API Keys
1. Go to **Developers** → **API keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 3: Install Stripe

```bash
npm install @stripe/stripe-js
```

### Step 4: Set Up Payment Flow

Create `src/utils/stripe.js`:
```javascript
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export const createCheckout = async (destination) => {
  const stripe = await stripePromise
  
  // In production, call your backend to create session
  // For now, redirect to Stripe Checkout
  const { error } = await stripe.redirectToCheckout({
    lineItems: [{
      price: destination.stripe_price_id,
      quantity: 1
    }],
    mode: 'payment',
    successUrl: `${window.location.origin}/booking-success`,
    cancelUrl: `${window.location.origin}/destinations`
  })
  
  if (error) console.error('Error:', error)
}
```

### Step 5: Add to Environment

`.env.local`:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Step 6: Update Booking Button

In `DestinationCard.jsx`:
```javascript
import { createCheckout } from '../utils/stripe'

const handleBooking = () => {
  createCheckout(destination)
}

// Replace "Book Now" button onClick with:
onClick={handleBooking}
```

---

## Part 3: Deploy Changes

### Update Vercel Environment Variables
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

### Redeploy
```bash
git add .
git commit -m "Add Supabase and Stripe integration"
git push origin main
```

Vercel will auto-deploy.

---

## Testing

### Test Supabase
1. Open browser console
2. Navigate to `/destinations`
3. Check Network tab - should see calls to `supabase.co`

### Test Stripe
1. Use test card: `4242 4242 4242 4242`
2. Expiry: Any future date
3. CVC: Any 3 digits
4. ZIP: Any 5 digits

---

## Free Tier Limits

### Supabase
- ✅ 500MB database
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth
- ✅ Unlimited API requests

### Stripe
- ✅ No monthly fees
- ✅ 2.9% + 30¢ per transaction
- ✅ Unlimited test transactions

---

## Need Help?
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Supabase Discord: https://discord.supabase.com
