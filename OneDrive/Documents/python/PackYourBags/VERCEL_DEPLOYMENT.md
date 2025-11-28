# 🚀 Deploy to Vercel - Quick Start Guide

## What You're Deploying
Your **PackYourBags** frontend application (with mock data) will go live on Vercel's global CDN. This gives you a shareable URL immediately.

---

## Prerequisites
- ✅ GitHub account
- ✅ Vercel account (sign up free at [vercel.com](https://vercel.com))
- ✅ Your code pushed to a GitHub repository

---

## Method 1: Deploy via Vercel Dashboard (Easiest - 5 Minutes)

### Step 1: Push Code to GitHub
```bash
cd c:\Users\sishi\OneDrive\Documents\python\PackYourBags\frontend_temp
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your **PackYourBags** repository
4. Click **"Import"**

### Step 3: Configure Project
Vercel will auto-detect Vite. Verify these settings:
- **Framework Preset:** Vite
- **Root Directory:** `frontend_temp` (if repo contains both frontend and backend)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Deploy
Click **"Deploy"** and wait 2-3 minutes. ✅ You'll get a live URL like:
```
https://packyourbags.vercel.app
```

---

## Method 2: Deploy via CLI (For Developers)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
cd c:\Users\sishi\OneDrive\Documents\python\PackYourBags\frontend_temp
vercel --prod
```

Follow the prompts:
- Link to existing project or create new? → **Create new**
- Project name? → `packyourbags`
- Which directory? → `./` (press Enter)

---

## Post-Deployment

### 1. Get Your URL
After deployment, you'll receive:
- **Production URL:** `https://packyourbags.vercel.app`
- **Deployment ID:** For rollbacks if needed

### 2. Test Your Site
Visit your URL and verify:
- ✅ Homepage loads
- ✅ Destinations page works
- ✅ Arcade games function
- ✅ Roulette spins
- ✅ Mobile responsive

### 3. Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `packyourbags.com`)
3. Follow DNS configuration instructions

---

## What Happens Next?

### Current State (Live Now)
- ✅ Frontend is live with mock data
- ✅ All games and features work
- ✅ Fast global CDN delivery
- ✅ Automatic HTTPS

### Future Integration (Optional)
When you're ready to add a real backend:
1. **Set up Supabase** (free database)
2. **Connect Stripe** (for payments)
3. **Add environment variables** in Vercel

See `DEPLOYMENT_PLAN.md` for backend integration steps.

---

## Troubleshooting

### Build Failed?
Check Vercel logs:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click the failed deployment
3. View build logs

Common fixes:
```bash
# Clear cache and rebuild locally
rm -rf node_modules dist
npm install
npm run build
```

### Images Not Loading?
- Ensure images are in `public/` folder
- Check browser console for errors
- Verify `vercel.json` is in the root

---

## 🎉 You're Live!

Share your link:
```
https://packyourbags.vercel.app
```

Track analytics in Vercel Dashboard → Analytics tab.

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
