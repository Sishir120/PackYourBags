# Supabase Integration for PackYourBags

This document explains how to integrate Supabase as a Backend-as-a-Service (BaaS) platform for the PackYourBags application.

## Prerequisites

1. A Supabase account (https://supabase.com/)
2. A Supabase project created
3. Supabase project URL and API keys

## Setup Instructions

### 1. Create a Supabase Project

1. Go to https://supabase.com/ and sign up or log in
2. Create a new project
3. Note down your:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anonymous key (anon key)
   - Service role key (service key)

### 2. Configure Environment Variables

Update your backend `.env` file with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
```

Update your frontend `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-supabase-anon-key
```

### 3. Install Required Dependencies

Install the Supabase Python client in your backend:

```bash
pip install supabase
```

Or add to your `requirements.txt`:

```txt
supabase==2.10.0
```

### 4. Database Schema Setup

In your Supabase SQL editor, create the required tables:

```sql
-- Users table
create table users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  name text,
  subscription_tier text default 'free',
  ai_credits integer default 10,
  total_ai_queries integer default 0,
  preferences jsonb default '{}',
  travel_history jsonb default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table users enable row level security;

-- Create policy to allow users to read their own data
create policy "Users can view own profile" on users
  for select using (auth.uid() = id);

-- Create policy to allow users to update their own data
create policy "Users can update own profile" on users
  for update using (auth.uid() = id);
```

### 5. Authentication Setup

Enable Email authentication in your Supabase project:

1. Go to Authentication → Providers
2. Enable Email provider
3. Configure as needed

## Key Features Implemented

### 1. User Authentication
- Email/password registration and login
- JWT token management
- Session handling

### 2. Subscription Management
- Free tier with limited AI credits (10/month)
- Premium tier with unlimited AI access
- Credit tracking and usage monitoring

### 3. User Profiles
- Personal information storage
- Travel preferences
- Usage statistics

### 4. AI Credit System
- Credit deduction for AI queries
- Premium user unlimited access
- Usage tracking

## API Endpoints

### Authentication Routes
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/subscription` - Upgrade subscription
- `GET /api/auth/subscription-status` - Get subscription status

### AI Chat Routes (Supabase integrated)
- `POST /api/ai-chat/message` - Send AI chat message
- `GET /api/ai-chat/credits` - Get AI credit balance

## Testing the Integration

Run the test script to verify the integration:

```bash
cd backend
python test_supabase.py
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure `supabase` package is installed
2. **Authentication Errors**: Check your Supabase URL and keys
3. **Database Connection**: Verify your Supabase project is active

### Debugging Steps

1. Check environment variables are set correctly
2. Verify Supabase project credentials
3. Ensure required tables are created
4. Check network connectivity to Supabase

## Security Considerations

1. Never expose service role keys in frontend
2. Use anon keys for client-side operations
3. Implement proper Row Level Security (RLS)
4. Use JWT tokens for authentication
5. Regularly rotate API keys

## Migration from SQLite

The Supabase integration is designed to work alongside the existing SQLite database. You can gradually migrate features to use Supabase while maintaining backward compatibility.

## Support

For issues with Supabase integration:
1. Check Supabase documentation: https://supabase.com/docs
2. Review the integration code in `backend/services/supabase_service.py`
3. Contact Supabase support for platform-specific issues