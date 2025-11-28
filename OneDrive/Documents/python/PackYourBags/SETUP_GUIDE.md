# PackYourBags - Setup & Deployment Guide

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.11+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env file with your API keys (already configured with OpenAI key)

# Migrate data to database
python migrate_data.py

# Update destination images
python update_real_images.py

# Generate AI-powered blog posts (optional - uses AI credits)
python generate_blogs.py

# Start backend server
python app.py
```

Backend will run on: http://localhost:5000

### Frontend Setup

```bash
# Navigate to frontend
cd frontend_temp

# Install dependencies  
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:3000

## 🔑 AI Configuration

The app is already configured with your OpenAI API key:
- AI_PROVIDER=openai
- AI_API_KEY=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

### Features Using AI:
✅ Travel itinerary generation
✅ AI chat assistant  
✅ Blog post generation
✅ Personalized recommendations

## 📸 Real Images

Destination images have been updated with high-quality Unsplash photos. No additional API key needed for images.

## 🎨 Features Completed

### ✅ Legal Pages
- Terms of Service (`/terms`)
- Privacy Policy (`/privacy`)
- About Us (`/about`)

### ✅ Professional Subscription System
Qoder-style tiered pricing:

**Explorer (Free)**
- 500+ destinations
- 5 itineraries/month
- Basic AI features

**Adventurer Pro ($9.99/mo)**
- Unlimited itineraries
- Priority AI responses
- Personalized recommendations
- Ad-free experience

**Globetrotter Premium ($19.99/mo)**
- Everything in Pro
- 1-on-1 consultation
- Exclusive deals
- Concierge service

### ✅ Backend API Routes

**Subscriptions:**
- `GET /api/subscription/tiers` - Get all tiers
- `POST /api/subscription/subscribe` - Subscribe to newsletter
- `POST /api/subscription/upgrade` - Upgrade subscription
- `GET /api/subscription/status/<id>` - Get subscription status
- `POST /api/subscription/cancel` - Cancel subscription
- `POST /api/subscription/unsubscribe` - Unsubscribe from emails

**Destinations:**
- `GET /api/destinations` - List destinations (with filters)
- `GET /api/destination/<id>/details` - Get destination details

**AI Features:**
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/travel-plan` - Generate travel plan

**Blogs:**
- `GET /api/blogs` - List blog posts
- `GET /api/blogs/<slug>` - Get single blog
- `POST /api/ai/blogs/generate` - Generate blog with AI

**Authentication:**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

## 📱 Frontend Pages

- `/` - Homepage with roulette, destinations, blogs
- `/blog` - Blog listing
- `/blog/:slug` - Individual blog post
- `/my-trips` - User's saved trips
- `/itinerary/new` - Create new itinerary
- `/itinerary/:id` - View/edit itinerary
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy
- `/about` - About Us

## 🗄️ Database

Using SQLite for development (`packyourbags.db`).

### Tables:
- `users` - User accounts
- `blogs` - Travel blog posts
- `destinations` - Travel destinations
- `subscribers` - Newsletter subscribers with tiers
- `itineraries` - User itineraries

## 🚢 Production Deployment

### Environment Variables for Production

```bash
# Backend (.env)
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secure-random-key-here
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=postgresql://user:pass@host:5432/dbname
AI_API_KEY=your-openai-key
SITE_URL=https://yourdomain.com

# Frontend (.env)
VITE_API_BASE_URL=https://yourdomain.com/api
```

### Backend Deployment (Production)

```bash
# Install gunicorn for production
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 'app:create_app()'
```

### Frontend Build

```bash
cd frontend_temp
npm run build
# Deploy 'dist' folder to hosting (Vercel, Netlify, etc.)
```

## 📊 Content Management

### Generate Blog Posts

```bash
# Generate AI-powered blogs for all destinations
python generate_blogs.py

# This will create SEO-optimized blog posts for each destination
```

### Update Images

```bash
# Update with real Unsplash images
python update_real_images.py
```

## 🔧 Maintenance Scripts

- `migrate_data.py` - Migrate JSON data to database
- `generate_blogs.py` - Generate AI blog posts
- `update_real_images.py` - Update destination images
- `test_complete_system.py` - Run system tests

## 📝 API Key Management

### Current Configuration:
✅ OpenAI API Key - Configured
✅ Unsplash Images - Using free CDN URLs (no key needed)

### Optional Services:
- Stripe - For payment processing (subscription upgrades)
- SendGrid - For email newsletters
- Google Analytics - For tracking

## 🎯 Next Steps

1. **Test the Application**
   - Start backend and frontend
   - Test roulette feature
   - Try AI chat
   - Generate an itinerary
   - Subscribe to newsletter

2. **Customize Content**
   - Update About Us page with your story
   - Customize subscription pricing
   - Add your branding

3. **Production Ready**
   - Change secret keys
   - Set up PostgreSQL database
   - Configure domain
   - Set up SSL certificates
   - Deploy!

## 💡 Tips

- Blog generation uses AI credits - use sparingly in testing
- Free tier subscribers get limited AI requests (10/day)
- Images are served from Unsplash CDN (free, high-quality)
- Database auto-creates on first run

## 🐛 Troubleshooting

**Import errors:**
```bash
pip install -r requirements.txt
```

**Database issues:**
```bash
# Delete and recreate database
rm packyourbags.db
python migrate_data.py
```

**Frontend won't start:**
```bash
cd frontend_temp
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📞 Support

For issues or questions:
- Check console logs (browser & terminal)
- Verify API keys are set correctly
- Ensure all dependencies are installed

---

**Built with ❤️ using Flask, React, and AI**
