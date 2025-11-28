# GitHub & Vercel Deployment Guide

## Step 1: Create GitHub Repository

I've opened https://github.com/new for you.

Fill in:
- **Repository name:** `PackYourBags`
- **Description:** "AI-powered travel planning app"
- **Visibility:** Public or Private (your choice)
- **DO NOT** check "Add a README"
- Click **"Create repository"**

## Step 2: Get Your Repository URL

After creating, GitHub will show commands. Look for your repository URL:
`https://github.com/YOUR_USERNAME/PackYourBags.git`

**Tell me your GitHub username and I'll prepare the commands!**

## Step 3: Push Code (I'll do this)

I'll run:
```bash
cd frontend_temp
git add .
git commit -m "Initial commit with Supabase integration"
git remote add origin https://github.com/YOUR_USERNAME/PackYourBags.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Import your `PackYourBags` repo
4. Configure:
   - Root: `frontend_temp`
   - Framework: Vite
5. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://rulbdvjornlxvdqmdvcu.supabase.co
   VITE_SUPABASE_ANON_KEY=(your key)
   ```
6. Click Deploy!

## What I Need From You

Just tell me your **GitHub username** and I'll handle the rest!
