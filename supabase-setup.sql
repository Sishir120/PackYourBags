-- PackYourBags Database Schema
-- Run this SQL in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/rulbdvjornlxvdqmdvcu/sql

-- ============================================
-- 1. Create Destinations Table
-- ============================================
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  destination_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  country VARCHAR(100),
  continent VARCHAR(50),
  location VARCHAR(255),
  image_url TEXT,
  images TEXT[],
  description TEXT,
  quick_fact TEXT,
  blog TEXT,
  highlights TEXT[],
  local_tips TEXT[],
  coordinates JSONB,
  best_season VARCHAR(255),
  budget_tier VARCHAR(50),
  price_range JSONB,
  estimated_budget INTEGER,
  rating DECIMAL(3,1),
  review_count INTEGER,
  popularity_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_destinations_continent ON destinations(continent);
CREATE INDEX IF NOT EXISTS idx_destinations_budget ON destinations(budget_tier);
CREATE INDEX IF NOT EXISTS idx_destinations_rating ON destinations(rating DESC);
CREATE INDEX IF NOT EXISTS idx_destinations_popularity ON destinations(popularity_score DESC);

-- ============================================
-- 2. Create Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. Create Favorites Table
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  destination_id VARCHAR(50) REFERENCES destinations(destination_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, destination_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- ============================================
-- 4. Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. Create Security Policies
-- ============================================

-- Public read access to destinations
CREATE POLICY "Public destinations are viewable by everyone"
  ON destinations FOR SELECT
  USING (true);

-- Only authenticated users can view user data
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can manage their own favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. Create Function for Updated Timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to destinations table
CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON destinations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ✅ Setup Complete!
-- ============================================
-- Next steps:
-- 1. Run the migration script to import your destination data
-- 2. Restart your dev server (npm run dev)
-- 3. Your app will automatically use Supabase!
